const sentences = [
  "今日はいい天気ですね",
  "明日は早く起きます",
  "猫がソファで寝ている",
  "宿題を早く終わらせたい",
  "コーヒーを飲みながら音楽を聴く",
  "公園で友達と遊びました",
  "新しい本を買いました",
  "電車の中はとても静かでした",
  "お寿司が食べたいです",
  "日曜日に映画を見に行きます"
];

let currentSentence = "";
let score = 0;

const userInput = document.getElementById("userInput");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const speakBtn = document.getElementById("speakBtn");

function getRandomSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function speakSentence(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  window.speechSynthesis.speak(utterance);
}

function nextRound() {
  currentSentence = getRandomSentence();
  resultEl.textContent = "";
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
  speakBtn.disabled = false;
  speakSentence(currentSentence);
}

startBtn.addEventListener("click", () => {
  score = 0;
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
      resultEl.textContent = `❌ 不正解です。正解は「${currentSentence}」でした`;
    }
    scoreEl.textContent = `スコア: ${score}`;
    userInput.disabled = true;
    speakBtn.disabled = true;
    setTimeout(nextRound, 2500);
  }
});
  