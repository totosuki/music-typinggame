"""
音声タイピングゲーム - FastAPI サーバー
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import bcrypt
from jose import jwt
import json

# JWT設定
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# データベース設定
SQLITE_DATABASE_URL = "sqlite:///./typing_game.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPIインスタンス
app = FastAPI(title="音声タイピングゲーム API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT認証
security = HTTPBearer()

# ===========================
# データベースモデル
# ===========================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    game_sessions = relationship("GameSession", back_populates="user")
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    messages = relationship("CommunityMessage", back_populates="user")
    rewards = relationship("Reward", back_populates="user")

class GameSession(Base):
    __tablename__ = "game_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    total_characters = Column(Integer, nullable=False)
    correct_characters = Column(Integer, nullable=False)
    rank = Column(String, nullable=False)
    weak_keys = Column(Text)  # JSON文字列として保存
    played_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    user = relationship("User", back_populates="game_sessions")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    level = Column(Integer, default=1)
    experience_points = Column(Integer, default=0)
    total_play_time = Column(Integer, default=0)  # 秒数
    career_best_wpm = Column(Float, default=0.0)
    career_best_accuracy = Column(Float, default=0.0)
    consecutive_days = Column(Integer, default=0)
    last_play_date = Column(DateTime)
    achievements = Column(Text)  # JSON文字列として保存
    is_professional = Column(Boolean, default=False)  # プロ認定
    
    # リレーション
    user = relationship("User", back_populates="profile")

class CommunityMessage(Base):
    __tablename__ = "community_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    message_type = Column(String, default="general")  # general, achievement, job_offer
    is_official = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    user = relationship("User", back_populates="messages")

class JobOffer(Base):
    __tablename__ = "job_offers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    company = Column(String, default="テレビ朝日")
    required_level = Column(Integer, default=10)
    required_wpm = Column(Float, default=100.0)
    required_accuracy = Column(Float, default=95.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_type = Column(String, nullable=False)  # experience, achievement, job_invitation
    reward_data = Column(Text)  # JSON文字列として保存
    claimed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # リレーション
    user = relationship("User", back_populates="rewards")

# データベーステーブル作成
Base.metadata.create_all(bind=engine)

# ===========================
# Pydanticモデル
# ===========================

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class GameResult(BaseModel):
    score: int
    wpm: float
    accuracy: float
    total_characters: int
    correct_characters: int
    rank: str
    weak_keys: List[dict] = []

class UserStats(BaseModel):
    total_games: int
    best_wpm: float
    best_accuracy: float
    average_wpm: float
    average_accuracy: float
    total_score: int
    recent_games: List[dict] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class CommunityMessageCreate(BaseModel):
    message: str
    message_type: str = "general"

class CommunityMessageResponse(BaseModel):
    id: int
    username: str
    message: str
    message_type: str
    is_official: bool
    created_at: datetime
    user_level: int

class UserProfileResponse(BaseModel):
    level: int
    experience_points: int
    total_play_time: int
    career_best_wpm: float
    career_best_accuracy: float
    consecutive_days: int
    achievements: List[dict] = []
    is_professional: bool

class JobOfferResponse(BaseModel):
    id: int
    title: str
    description: str
    company: str
    required_level: int
    required_wpm: float
    required_accuracy: float
    created_at: datetime

class RewardResponse(BaseModel):
    id: int
    reward_type: str
    reward_data: dict
    claimed: bool
    created_at: datetime

# ===========================
# 依存関数
# ===========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def calculate_experience_points(score, wpm, accuracy, rank):
    """ゲーム結果から経験値を計算"""
    base_exp = score * 10
    wpm_bonus = int(wpm) * 2
    accuracy_bonus = int(accuracy) * 3
    
    rank_multiplier = {"S": 2.0, "A": 1.5, "B": 1.2, "C": 1.0}
    multiplier = rank_multiplier.get(rank, 1.0)
    
    total_exp = int((base_exp + wpm_bonus + accuracy_bonus) * multiplier)
    return max(total_exp, 10)  # 最低10EXP

def calculate_level_from_exp(exp):
    """経験値からレベルを計算"""
    # レベル = sqrt(経験値 / 100) + 1
    import math
    return int(math.sqrt(exp / 100)) + 1

def get_or_create_user_profile(user_id: int, db: Session):
    """ユーザープロフィールを取得または作成"""
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

def check_achievements(profile: UserProfile, game_result: dict, db: Session):
    """実績チェックと報酬付与"""
    achievements = []
    
    # 実績の判定
    if game_result["wpm"] >= 150:
        achievements.append({"type": "speed_demon", "name": "スピードデーモン", "description": "150WPM達成"})
    
    if game_result["accuracy"] >= 98:
        achievements.append({"type": "perfectionist", "name": "完璧主義者", "description": "98%以上の正確率達成"})
    
    if profile.level >= 20:
        achievements.append({"type": "master", "name": "タイピングマスター", "description": "レベル20達成"})
    
    # 実績を報酬として追加
    for achievement in achievements:
        existing_reward = db.query(Reward).filter(
            Reward.user_id == profile.user_id,
            Reward.reward_type == "achievement",
            Reward.reward_data.contains(achievement["type"])
        ).first()
        
        if not existing_reward:
            reward = Reward(
                user_id=profile.user_id,
                reward_type="achievement",
                reward_data=json.dumps(achievement)
            )
            db.add(reward)
    
    db.commit()
    return achievements

def check_job_eligibility(profile: UserProfile, db: Session):
    """就職招待の資格チェック"""
    if profile.level >= 15 and profile.career_best_wpm >= 120 and profile.career_best_accuracy >= 95:
        # 就職招待の資格あり
        existing_invite = db.query(Reward).filter(
            Reward.user_id == profile.user_id,
            Reward.reward_type == "job_invitation",
            Reward.claimed == False
        ).first()
        
        if not existing_invite:
            job_invite = Reward(
                user_id=profile.user_id,
                reward_type="job_invitation",
                reward_data=json.dumps({
                    "company": "テレビ朝日",
                    "position": "字幕制作スタッフ",
                    "message": "あなたの優秀なタイピングスキルに注目しています。私たちのチームで一緒に働きませんか？"
                })
            )
            db.add(job_invite)
            db.commit()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ===========================
# APIエンドポイント
# ===========================

@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # ユーザー名の重複チェック
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="ユーザー名は既に使用されています")
    
    # 新しいユーザーを作成
    hashed_password = hash_password(user_data.password)
    new_user = User(username=user_data.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # トークンを生成
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが間違っています")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "created_at": current_user.created_at
    }

@app.post("/api/game/submit-result")
async def submit_game_result(game_result: GameResult, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # ゲーム結果をデータベースに保存
    game_session = GameSession(
        user_id=current_user.id,
        score=game_result.score,
        wpm=game_result.wpm,
        accuracy=game_result.accuracy,
        total_characters=game_result.total_characters,
        correct_characters=game_result.correct_characters,
        rank=game_result.rank,
        weak_keys=json.dumps(game_result.weak_keys)
    )
    
    db.add(game_session)
    db.commit()
    db.refresh(game_session)
    
    # ユーザープロフィールを更新
    profile = get_or_create_user_profile(current_user.id, db)
    
    # 経験値計算と付与
    exp_gained = calculate_experience_points(
        game_result.score, 
        game_result.wpm, 
        game_result.accuracy, 
        game_result.rank
    )
    
    old_level = profile.level
    profile.experience_points += exp_gained
    profile.level = calculate_level_from_exp(profile.experience_points)
    
    # 記録更新
    if game_result.wpm > profile.career_best_wpm:
        profile.career_best_wpm = game_result.wpm
    if game_result.accuracy > profile.career_best_accuracy:
        profile.career_best_accuracy = game_result.accuracy
    
    # プレイ時間更新（推定）
    estimated_play_time = 60  # 60秒ゲーム
    profile.total_play_time += estimated_play_time
    
    # 連続プレイ日数更新
    today = datetime.utcnow().date()
    if profile.last_play_date:
        if profile.last_play_date.date() == today - timedelta(days=1):
            profile.consecutive_days += 1
        elif profile.last_play_date.date() != today:
            profile.consecutive_days = 1
    else:
        profile.consecutive_days = 1
    
    profile.last_play_date = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    
    # 実績チェック
    game_data = {
        "score": game_result.score,
        "wpm": game_result.wpm,
        "accuracy": game_result.accuracy,
        "rank": game_result.rank
    }
    achievements = check_achievements(profile, game_data, db)
    
    # 就職招待資格チェック
    check_job_eligibility(profile, db)
    
    # レベルアップチェック
    level_up = profile.level > old_level
    
    return {
        "message": "ゲーム結果が保存されました",
        "session_id": game_session.id,
        "exp_gained": exp_gained,
        "current_level": profile.level,
        "level_up": level_up,
        "achievements": achievements
    }

@app.get("/api/stats/user", response_model=UserStats)
async def get_user_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # ユーザーのゲームセッションを取得
    sessions = db.query(GameSession).filter(GameSession.user_id == current_user.id).order_by(GameSession.played_at.desc()).all()
    
    if not sessions:
        return UserStats(
            total_games=0,
            best_wpm=0.0,
            best_accuracy=0.0,
            average_wpm=0.0,
            average_accuracy=0.0,
            total_score=0,
            recent_games=[]
        )
    
    # 統計計算
    total_games = len(sessions)
    best_wpm = max(session.wpm for session in sessions)
    best_accuracy = max(session.accuracy for session in sessions)
    average_wpm = sum(session.wpm for session in sessions) / total_games
    average_accuracy = sum(session.accuracy for session in sessions) / total_games
    total_score = sum(session.score for session in sessions)
    
    # 最近の10ゲームの情報
    recent_games = []
    for session in sessions[:10]:
        recent_games.append({
            "date": session.played_at.isoformat(),
            "score": session.score,
            "wpm": session.wpm,
            "accuracy": session.accuracy,
            "rank": session.rank
        })
    
    return UserStats(
        total_games=total_games,
        best_wpm=best_wpm,
        best_accuracy=best_accuracy,
        average_wpm=round(average_wpm, 1),
        average_accuracy=round(average_accuracy, 1),
        total_score=total_score,
        recent_games=recent_games
    )

@app.get("/api/stats/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    """上位プレイヤーのリーダーボードを取得"""
    # 各ユーザーの最高WPMを取得
    users_best_wpm = db.query(
        User.username,
        db.func.max(GameSession.wpm).label('best_wpm'),
        db.func.max(GameSession.accuracy).label('best_accuracy'),
        db.func.count(GameSession.id).label('total_games')
    ).join(GameSession).group_by(User.id).order_by(db.text('best_wpm DESC')).limit(10).all()
    
    leaderboard = []
    for rank, (username, best_wpm, best_accuracy, total_games) in enumerate(users_best_wpm, 1):
        leaderboard.append({
            "rank": rank,
            "username": username,
            "best_wpm": best_wpm,
            "best_accuracy": best_accuracy,
            "total_games": total_games
        })
    
    return leaderboard

# コミュニティ機能のエンドポイント

@app.get("/api/community/messages")
async def get_community_messages(limit: int = 50, db: Session = Depends(get_db)):
    """コミュニティメッセージを取得"""
    messages = db.query(CommunityMessage, User, UserProfile).join(
        User, CommunityMessage.user_id == User.id
    ).outerjoin(
        UserProfile, User.id == UserProfile.user_id
    ).order_by(CommunityMessage.created_at.desc()).limit(limit).all()
    
    result = []
    for message, user, profile in messages:
        result.append({
            "id": message.id,
            "username": user.username,
            "message": message.message,
            "message_type": message.message_type,
            "is_official": message.is_official,
            "created_at": message.created_at,
            "user_level": profile.level if profile else 1
        })
    
    return result

@app.post("/api/community/messages")
async def post_community_message(
    message_data: CommunityMessageCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """コミュニティメッセージを投稿"""
    message = CommunityMessage(
        user_id=current_user.id,
        message=message_data.message,
        message_type=message_data.message_type
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {"message": "メッセージが投稿されました", "message_id": message.id}

@app.get("/api/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """ユーザープロフィールを取得"""
    profile = get_or_create_user_profile(current_user.id, db)
    
    achievements = []
    if profile.achievements:
        try:
            achievements = json.loads(profile.achievements)
        except:
            achievements = []
    
    return UserProfileResponse(
        level=profile.level,
        experience_points=profile.experience_points,
        total_play_time=profile.total_play_time,
        career_best_wpm=profile.career_best_wpm,
        career_best_accuracy=profile.career_best_accuracy,
        consecutive_days=profile.consecutive_days,
        achievements=achievements,
        is_professional=profile.is_professional
    )

@app.get("/api/rewards")
async def get_user_rewards(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """ユーザーの報酬を取得"""
    rewards = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.claimed == False
    ).order_by(Reward.created_at.desc()).all()
    
    result = []
    for reward in rewards:
        reward_data = {}
        try:
            reward_data = json.loads(reward.reward_data)
        except:
            reward_data = {}
        
        result.append({
            "id": reward.id,
            "reward_type": reward.reward_type,
            "reward_data": reward_data,
            "claimed": reward.claimed,
            "created_at": reward.created_at
        })
    
    return result

@app.post("/api/rewards/{reward_id}/claim")
async def claim_reward(reward_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """報酬を受け取る"""
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.user_id == current_user.id,
        Reward.claimed == False
    ).first()
    
    if not reward:
        raise HTTPException(status_code=404, detail="報酬が見つかりません")
    
    reward.claimed = True
    db.commit()
    
    return {"message": "報酬を受け取りました"}

@app.get("/api/job-offers")
async def get_job_offers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """利用可能な求人情報を取得"""
    profile = get_or_create_user_profile(current_user.id, db)
    
    # ユーザーの資格に基づいて求人をフィルタリング
    job_offers = db.query(JobOffer).filter(
        JobOffer.is_active == True,
        JobOffer.required_level <= profile.level,
        JobOffer.required_wpm <= profile.career_best_wpm,
        JobOffer.required_accuracy <= profile.career_best_accuracy
    ).order_by(JobOffer.created_at.desc()).all()
    
    return job_offers

# 静的ファイルの配信
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)