const sentences = [
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
];

let currentSentence = "";
let score = 0;
let currentRound = 0;
const maxRounds = 10;

const userInput = document.getElementById("userInput");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const speakBtn = document.getElementById("speakBtn");
const progressBar = document.getElementById("progress-bar");
const finalResult = document.getElementById("finalResult");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

function getRandomSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function speakSentence(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  window.speechSynthesis.speak(utterance);
}

function updateProgressBar() {
  const percent = (currentRound / maxRounds) * 100;
  progressBar.style.width = `${percent}%`;
}

function nextRound() {
  if (currentRound >= maxRounds) {
    showFinalResult();
    return;
  }

  currentSentence = getRandomSentence();
  resultEl.textContent = "";
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
  speakBtn.disabled = false;
  speakSentence(currentSentence);
  updateProgressBar();
}

function showFinalResult() {
  document.querySelector('.progress-container').style.display = 'none'; // ← ここ追加
  userInput.style.display = "none";
  speakBtn.style.display = "none";
  startBtn.style.display = "none";
  finalScore.textContent = `あなたのスコアは ${score} / ${maxRounds} です`;
  finalResult.style.display = "block";
}

startBtn.addEventListener("click", () => {
  score = 0;
  currentRound = 0;
  finalResult.style.display = "none";
  userInput.style.display = "block";
  speakBtn.style.display = "inline-block";
  startBtn.style.display = "none";
  scoreEl.textContent = `スコア: ${score}`;
  nextRound();
});

speakBtn.addEventListener("click", () => {
  speakSentence(currentSentence);
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const answer = userInput.value.trim();
    if (answer === currentSentence) {
      score++;
      resultEl.textContent = `✅ 正解！`;
    } else {
      resultEl.textContent = `❌ 不正解。正解: 「${currentSentence}」`;
    }

    scoreEl.textContent = `スコア: ${score}`;
    userInput.disabled = true;
    speakBtn.disabled = true;
    currentRound++;

    setTimeout(nextRound, 2000);
  }
});

restartBtn.addEventListener("click", () => {
  score = 0;
  currentRound = 0;
  finalResult.style.display = "none";
  document.querySelector('.progress-container').style.display = 'block'; // ← ここ追加
  userInput.style.display = "block";
  speakBtn.style.display = "inline-block";
  startBtn.style.display = "inline-block";
  scoreEl.textContent = `スコア: ${score}`;
  progressBar.style.width = `0%`;
});
