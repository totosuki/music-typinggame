// 文章のコレクション（ご友人の作成した20個 + 先ほど追加した100個以上）
const sentences = [
  // ご友人の作成した20個
  "宇宙開発に新たな企業が参入",
  "高校生が国際科学賞を受賞",
  "水不足対策で節水呼びかけ",
  "大規模な火災訓練が実施される",
  "スマホ決済の利用者が増加中",
  "歴史的建造物の修復工事始まる",
  "高速道路で長時間の渋滞発生",
  "美術館で特別展が開幕しました",
  "再生可能エネルギーの導入拡大",
  "新たな法律案が衆議院で可決",
  "全国でインフルエンザが流行中",
  "新空港の建設計画が正式決定",
  "大学でAI研究が本格化している",
  "登山客の増加で安全対策強化",
  "海洋プラスチックごみ問題深刻",
  "新作アニメ映画が話題を呼ぶ",
  "農産物の輸出額が過去最高に",
  "オンライン授業が常態化進む",
  "住宅価格の高騰が各地で続く",
  "外国人観光客の受け入れ再開",
  
  // 追加した100個
  "今日はいい天気ですね",
  "明日は早く起きます",
  "猫がソファで寝ている",
  "宿題を早く終わらせたい",
  "コーヒーを飲みながら音楽を聴く",
  "公園で友達と遊びました",
  "新しい本を買いました",
  "電車の中はとても静かでした",
  "お寿司が食べたいです",
  "日曜日に映画を見に行きます",
  "空には星が輝いている",
  "私は毎朝コーヒーを飲む",
  "彼女は美しい絵を描いた",
  "今日の天気は晴れです",
  "図書館で本を借りました",
  "音楽を聴くのが好きです",
  "海辺で貝殻を集めた",
  "友達と映画を見に行った",
  "美味しいケーキを食べた",
  "電車が遅れて困った",
  "新しいパソコンを買った",
  "彼は英語が上手に話せる",
  "桜の花が風に舞っている",
  "明日は早起きする予定だ",
  "隣の猫がとても可愛い",
  "この問題は難しすぎる",
  "彼女は優しい笑顔をした",
  "窓から富士山が見える",
  "私の趣味は写真撮影です",
  "彼は昨日遅くまで仕事をした",
  "季節の変わり目は体調に気をつけよう",
  "新しいレシピを試してみた",
  "公園でジョギングをする",
  "手紙を書くのは楽しい",
  "彼女は二か国語を話せる",
  "夏は海に行きたいです",
  "彼は数学が得意だった",
  "雨の日は読書が捗る",
  "このカメラはとても高性能だ",
  "子供たちは元気に遊んでいる",
  "冬は雪が降ることがある",
  "コンビニでおにぎりを買った",
  "日本語の勉強は楽しい",
  "彼女は医者になりたかった",
  "この道をまっすぐ行ってください",
  "昨日の夜は良く眠れた",
  "彼は歌が上手だと思う",
  "週末は家族と過ごした",
  "この料理のレシピを教えて",
  "花火大会は夏の風物詩だ",
  "電話番号を忘れてしまった",
  "山登りは健康に良い",
  "彼女は毎日日記を書いている",
  "この問題の解き方を教えて",
  "彼は有名な小説家になった",
  "駅までの道を教えてください",
  "彼女は料理が上手だ",
  "新幹線で東京へ行く",
  "パーティーは楽しかった",
  "彼は親切にしてくれた",
  "この本はとても面白い",
  "明日は雨が降るだろう",
  "彼女は歌手になりたい",
  "夕日がとても綺麗だった",
  "彼は数学の問題を解いた",
  "私たちは一緒に旅行した",
  "この映画は感動的だった",
  "彼女は早く寝る習慣がある",
  "カレーライスを作った",
  "彼は自転車で通勤している",
  "花が美しく咲いている",
  "私は朝食を食べなかった",
  "彼女はピアノが弾ける",
  "この靴はとても履きやすい",
  "彼は毎日ランニングをする",
  "虹がきれいに見えた",
  "時計の電池が切れた",
  "彼女は外国語が得意だ",
  "この問題は解決できる",
  "彼は昨日病院へ行った",
  "私は寿司が好きです",
  "音楽会はとても楽しかった",
  "彼女は早く起きる人だ",
  "この地図を見てください",
  "彼はテニスが得意だ",
  "彼女はケーキを焼いた",
  "私は毎日ブログを書いている",
  "この山は高くて険しい",
  "彼女は静かに座っていた",
  "野球の試合を見に行った",
  "彼は新しい車を買った",
  "私は毎週水泳に行く",
  "この問題は誰も解けない",
  "彼女は明日来ると言った",
  "彼はコーヒーを飲まない",
  "私は夜更かしをした",
  "彼女は優しく微笑んだ",
  "この絵はとても美しい",
  "日本語を勉強しています",
  "明日の予定を確認してください",
  "彼は昨日遅く帰った",
  "私は旅行が好きです",
  "この料理はとても美味しい",
  "彼女は歩くのが速い",
  "彼は友達と遊んでいる",
  "私は海が好きです",
  "雪が静かに降っている",
  "彼女は英語を教えている",
  "彼は昨日早く寝た",
  "私はギターを弾きます"
];

// 難易度別の文章コレクション
const easySentences = sentences.filter(sentence => sentence.length <= 10);
const normalSentences = sentences.filter(sentence => sentence.length > 10 && sentence.length <= 20);
const hardSentences = sentences.filter(sentence => sentence.length > 20);

// グローバル変数
let currentSentence = "";
let score = 0;
let timer;
let timeLimit = 60; // デフォルトの全体時間制限：60秒
let sentenceTimeLimit = 0; // 各文章の時間制限
let timeRemaining;
let sentenceTimeRemaining;
let sentenceTimer;
let isGameActive = false;
let currentDifficulty = "normal"; // デフォルトの難易度
let isGameStarted = false; // ゲームが開始されたかどうかのフラグ
let currentRound = 0; // 現在のラウンド
let maxRounds = 10; // 最大ラウンド数

// DOM要素
const userInput = document.getElementById("userInput");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const speakBtn = document.getElementById("speakBtn");
const timeSelect = document.getElementById("time-select");
const timeDisplay = document.getElementById("time-display");
const progressBar = document.getElementById("progress-bar");
const finalResult = document.getElementById("finalResult");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty-select");
const sentenceTimerEl = document.getElementById("sentence-timer");
const instructionsEl = document.getElementById("instructions");
const rankBadge = document.getElementById("rank-badge");
const rankMessage = document.getElementById("rank-message");

// 音声フィードバック用の関数
function speakFeedback(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.volume = 1.0;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// 正解時のフィードバック
function playCorrectFeedback() {
  speakFeedback("ピンポーン");
}

// 不正解時のフィードバック
function playIncorrectFeedback() {
  speakFeedback("ブッブー");
}

// 時間切れ時のフィードバック
function playTimeupFeedback() {
  speakFeedback("時間切れです");
}

// 文の長さに基づいて時間制限を計算
function calculateSentenceTimeLimit(sentence) {
  // 基本時間と追加時間は難易度によって変わる
  let baseTime;
  let extraTimePerChar;
  
  switch(currentDifficulty) {
    case "easy":
      baseTime = 12;
      extraTimePerChar = 1 / 4;
      break;
    case "hard":
      baseTime = 8;
      extraTimePerChar = 1 / 6;
      break;
    case "normal":
    default:
      baseTime = 10;
      extraTimePerChar = 1 / 5;
      break;
  }
  
  return Math.ceil(baseTime + (sentence.length * extraTimePerChar));
}

// 難易度に基づいてランダムな文章を取得
function getRandomSentence() {
  let selectedSentences;
  
  switch(currentDifficulty) {
    case "easy":
      selectedSentences = easySentences;
      break;
    case "hard":
      selectedSentences = hardSentences;
      break;
    case "normal":
    default:
      selectedSentences = normalSentences;
      break;
  }
  
  // 選択された難易度の文章がない場合は全体から選ぶ
  if (selectedSentences.length === 0) {
    selectedSentences = sentences;
  }
  
  return selectedSentences[Math.floor(Math.random() * selectedSentences.length)];
}

// ランク判定関数
function calculateRank(score) {
  // 難易度によってランク判定基準を変える
  const percentage = (score / currentRound) * 100;
  
  switch(currentDifficulty) {
    case "easy":
      if (percentage >= 90) return "S";
      if (percentage >= 70) return "A";
      if (percentage >= 50) return "B";
      return "C";
    case "hard":
      if (percentage >= 80) return "S";
      if (percentage >= 60) return "A";
      if (percentage >= 40) return "B";
      return "C";
    case "normal":
    default:
      if (percentage >= 85) return "S";
      if (percentage >= 65) return "A";
      if (percentage >= 45) return "B";
      return "C";
  }
}

// ランクに応じたメッセージ
function getRankMessage(rank) {
  switch(rank) {
    case "S":
      return "素晴らしい！タイピングの達人ですね！";
    case "A":
      return "excellent! 素晴らしいタイピング力です！";
    case "B":
      return "よくできました！もう少し練習を続けましょう！";
    case "C":
      return "タイピングの基本を身につけましょう。毎日の練習が大切です！";
    default:
      return "";
  }
}

// 文章を読み上げる
function speakSentence(text) {
  // 音声合成が利用可能か確認
  if ('speechSynthesis' in window) {
    // 既存の音声をキャンセル
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.volume = 1.0; // 音量最大
    utterance.rate = 1.0;   // 標準速度
    utterance.pitch = 1.0;  // 標準ピッチ
    
    // 音声再生開始
    window.speechSynthesis.speak(utterance);
    
    // デバッグ用
    console.log("読み上げ開始: " + text);
    
    // エラーハンドリング
    utterance.onerror = function(event) {
      console.error("音声合成エラー:", event);
    };
  } else {
    console.error("このブラウザは音声合成をサポートしていません");
    alert("このブラウザは音声合成をサポートしていません。別のブラウザをお試しください。");
  }
}

// プログレスバーを更新
function updateProgressBar() {
  // ラウンドベースのモードの場合
  if (maxRounds > 0) {
    const percent = (currentRound / maxRounds) * 100;
    progressBar.style.width = `${percent}%`;
  }
  // 時間制限モードの場合
  else {
    const percent = ((timeLimit - timeRemaining) / timeLimit) * 100;
    progressBar.style.width = `${percent}%`;
  }
}

// 文章タイマーの開始
function startSentenceTimer() {
  if (sentenceTimer) {
    clearInterval(sentenceTimer);
  }
  
  sentenceTimeLimit = calculateSentenceTimeLimit(currentSentence);
  sentenceTimeRemaining = sentenceTimeLimit;
  updateSentenceTimerDisplay();
  
  sentenceTimer = setInterval(() => {
    sentenceTimeRemaining--;
    updateSentenceTimerDisplay();
    
    if (sentenceTimeRemaining <= 0) {
      // 文章の時間切れ
      clearInterval(sentenceTimer);
      
      resultEl.textContent = `⏱ 時間切れ！正解は「${currentSentence}」でした`;
      userInput.disabled = true;
      speakBtn.disabled = true;
      
      // 不正解の音声フィードバック
      playIncorrectFeedback();
      
      // 次のラウンド
      currentRound++;
      
      // ラウンド制の場合
      if (maxRounds > 0 && currentRound >= maxRounds) {
        setTimeout(showFinalResult, 2000);
      } else {
        setTimeout(nextRound, 2000);
      }
    }
  }, 1000);
}

// 文章タイマー表示の更新
function updateSentenceTimerDisplay() {
  const sentenceTimeRemainingEl = document.getElementById("sentence-time-remaining");
  if (sentenceTimeRemainingEl) {
    sentenceTimeRemainingEl.textContent = sentenceTimeRemaining;
    
    // 残り時間が3秒以下になったら赤く表示
    if (sentenceTimeRemaining <= 3) {
      sentenceTimeRemainingEl.classList.add("time-warning");
    } else {
      sentenceTimeRemainingEl.classList.remove("time-warning");
    }
  }
}

// タイマーを開始する
function startTimer() {
  if (timer) {
    clearInterval(timer);
  }
  
  isGameActive = true;
  timeRemaining = timeLimit;
  updateTimerDisplay();
  
  timer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    updateProgressBar(); // プログレスバーも更新
    
    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

// タイマー表示を更新
function updateTimerDisplay() {
  timeDisplay.textContent = `残り時間: ${timeRemaining}秒`;
  
  // 残り時間が10秒以下になったら赤く表示
  if (timeRemaining <= 10) {
    timeDisplay.classList.add("time-warning");
  } else {
    timeDisplay.classList.remove("time-warning");
  }
}

// ゲーム終了処理
function endGame() {
  clearInterval(timer);
  clearInterval(sentenceTimer);
  isGameActive = false;
  
  userInput.disabled = true;
  speakBtn.disabled = true;
  
  showFinalResult();
}

// 最終結果を表示
function showFinalResult() {
  // プログレスバーを非表示にする
  document.querySelector('.progress-container').style.display = 'none';
  
  // 入力欄や再生ボタンを非表示にする
  userInput.style.display = "none";
  speakBtn.style.display = "none";
  startBtn.style.display = "none";
  
  // ランク判定
  const rank = calculateRank(score);
  const rankMessageText = getRankMessage(rank);
  
  // ランク表示を更新
  rankBadge.textContent = rank;
  rankBadge.className = `rank rank-${rank.toLowerCase()}`;
  rankMessage.textContent = rankMessageText;
  
  // 最終スコア表示
  if (maxRounds > 0) {
    finalScore.textContent = `あなたのスコアは ${score} / ${maxRounds} です`;
  } else {
    finalScore.textContent = `あなたは ${timeLimit} 秒間で ${score} 問正解しました！`;
  }
  
  // 最終結果を表示
  finalResult.style.display = "block";
  
  // 時間切れ音声フィードバック
  playTimeupFeedback();
}

// タイトル画面に戻る
function returnToTitle() {
  // タイマーを停止
  clearInterval(timer);
  clearInterval(sentenceTimer);
  
  // ゲーム状態をリセット
  isGameActive = false;
  isGameStarted = false;
  
  // UIをリセット
  score = 0;
  currentRound = 0;
  scoreEl.textContent = `スコア: ${score}`;
  resultEl.textContent = "";
  userInput.value = "";
  userInput.style.display = "block";
  userInput.disabled = true;
  
  // ボタン表示を戻す
  speakBtn.style.display = "inline-block";
  speakBtn.disabled = true;
  startBtn.style.display = "inline-block";
  
  // 最終結果を非表示
  finalResult.style.display = "none";
  
  // プログレスバーをリセット
  document.querySelector('.progress-container').style.display = 'block';
  progressBar.style.width = "0%";
  
  // 文章タイマーを非表示
  sentenceTimerEl.style.display = "none";
  
  // タイトル画面のメッセージを表示
  resultEl.innerHTML = `
    <div class="title-screen">
      <h2>🎧 タイピングで聞き取りゲーム</h2>
      <p>Enterキーを押すか、スタートボタンをクリックしてゲームを開始しましょう！</p>
      <p>難易度と制限時間を選択できます。</p>
    </div>
  `;
  
  // 操作説明を表示
  instructionsEl.style.display = "block";
}

// 次のラウンドを開始
function nextRound() {
  // ラウンド制の場合、最大ラウンド数に達したらゲーム終了
  if (maxRounds > 0 && currentRound >= maxRounds) {
    showFinalResult();
    return;
  }
  
  currentSentence = getRandomSentence();
  resultEl.textContent = "";
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
  speakBtn.disabled = false;
  
  // プログレスバーを更新
  updateProgressBar();
  
  // ゲームがアクティブでなければタイマーを開始
  if (!isGameActive) {
    startTimer();
  }
  
  // 文章タイマーを開始
  startSentenceTimer();
  
  // 音声読み上げ
  speakSentence(currentSentence);
}

// ゲームをリセット
function resetGame() {
  score = 0;
  currentRound = 0;
  scoreEl.textContent = `スコア: ${score}`;
  
  // UIをリセット
  finalResult.style.display = "none";
  document.querySelector('.progress-container').style.display = 'block';
  userInput.style.display = "block";
  speakBtn.style.display = "inline-block";
  
  // タイマーをリセット
  clearInterval(timer);
  timeRemaining = timeLimit;
  updateTimerDisplay();
  
  // 文章タイマーを表示
  sentenceTimerEl.style.display = "block";
  
  // 操作説明を非表示
  instructionsEl.style.display = "none";
  
  // ゲーム状態をリセット
  isGameStarted = true;
  
  // プログレスバーをリセット
  progressBar.style.width = "0%";
  
  // ゲームを開始
  nextRound();
}

// ゲームスタート関数
function startGame() {
  // 難易度を取得
  currentDifficulty = difficultySelect ? difficultySelect.value : "normal";
  
  // 制限時間を取得
  timeLimit = parseInt(timeSelect ? timeSelect.value : 60);
  timeRemaining = timeLimit;
  updateTimerDisplay();
  
  // スコアリセット
  score = 0;
  currentRound = 0;
  scoreEl.textContent = `スコア: ${score}`;
  
  // UI調整
  userInput.style.display = "block";
  speakBtn.style.display = "inline-block";
  startBtn.style.display = "none";
  finalResult.style.display = "none";
  
  // 文章タイマー要素を表示
  sentenceTimerEl.style.display = "block";
  
  // 操作説明を非表示
  instructionsEl.style.display = "none";
  
  // ゲーム状態を更新
  isGameStarted = true;
  
  // ゲームを開始
  nextRound();
}

// イベントリスナー
// スタートボタンのイベントリスナー
startBtn.addEventListener("click", startGame);

// リスタートボタンのイベントリスナー
restartBtn.addEventListener("click", returnToTitle);

// キーボードイベント
document.addEventListener("keydown", function(e) {
  // Escキーでタイトルに戻る
  if (e.key === "Escape") {
    returnToTitle();
    return;
  }
  
  // Enterキーでゲーム開始（ゲーム開始前の場合）
  if (e.key === "Enter" && !isGameStarted) {
    // フォーカスがユーザー入力欄にない場合のみ
    if (document.activeElement !== userInput) {
      e.preventDefault(); // デフォルトの挙動を防ぐ
      startGame();
    }
  }
});

speakBtn.addEventListener("click", () => {
  speakSentence(currentSentence);
});

// 制限時間選択時の処理
if (timeSelect) {
  timeSelect.addEventListener("change", () => {
    timeLimit = parseInt(timeSelect.value);
    timeRemaining = timeLimit;
    updateTimerDisplay();
  });
}

// 難易度選択時の処理
if (difficultySelect) {
  difficultySelect.addEventListener("change", function() {
    currentDifficulty = this.value;
  });
}

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && isGameActive) {
    const answer = userInput.value.trim();
    
    // 文章タイマーを停止
    clearInterval(sentenceTimer);
    
    if (answer === currentSentence) {
      score++;
      resultEl.textContent = `✅ 正解！`;
      playCorrectFeedback(); // 正解時の音声フィードバック「ピンポーン」
    } else {
      resultEl.textContent = `❌ 不正解です。正解は「${currentSentence}」でした`;
      playIncorrectFeedback(); // 不正解時の音声フィードバック「ブッブー」
    }
    
    scoreEl.textContent = `スコア: ${score}`;
    userInput.disabled = true;
    speakBtn.disabled = true;
    
    // ラウンドをカウントアップ
    currentRound++;
    
    // ラウンド制の場合
    if (maxRounds > 0 && currentRound >= maxRounds) {
      setTimeout(showFinalResult, 2000);
    } else {
      setTimeout(nextRound, 2000);
    }
  }
});

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", () => {
  // タイマー表示の初期化
  timeRemaining = timeLimit;
  updateTimerDisplay();
  
  // 最初はタイトル画面を表示
  returnToTitle();
});