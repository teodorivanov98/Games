document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const resultDiv = document.getElementById("result");
  const playerCard = document.getElementById("player-card");
  const computerCard = document.getElementById("computer-card");

  const cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  let playerCardValue = null;
  let computerCardValue = null;
  let roundActive = false;

  function cardValueToNumber(card) {
    if (card === "A") return 14;
    if (card === "K") return 13;
    if (card === "Q") return 12;
    if (card === "J") return 11;
    return parseInt(card);
  }

  function getRandomCard() {
    const idx = Math.floor(Math.random() * cardValues.length);
    return cardValues[idx];
  }

  function resetCards() {
    playerCard.classList.remove("flipped");
    computerCard.classList.remove("flipped");
    playerCard.querySelector(".back").src = "";
    computerCard.querySelector(".back").src = "";
    resultDiv.textContent = "";
    playerCardValue = null;
    computerCardValue = null;
    roundActive = true;
  }

  function flipComputerCard() {
    computerCardValue = getRandomCard();
    const backImg = computerCard.querySelector(".back");
    backImg.src = `../assets/images/${computerCardValue}.png`;
    setTimeout(() => {
      computerCard.classList.add("flipped");
    }, 300);
  }

  function flipPlayerCard() {
    if (!roundActive) return;

    playerCardValue = getRandomCard();
    const backImg = playerCard.querySelector(".back");
    backImg.src = `../assets/images/${playerCardValue}.png`;
    playerCard.classList.add("flipped");

    setTimeout(() => {
      showResult();
    }, 1000);
  }

  function showResult() {
    const playerNum = cardValueToNumber(playerCardValue);
    const computerNum = cardValueToNumber(computerCardValue);

    let resultText = `You drew ${playerCardValue}, Computer drew ${computerCardValue}. `;
    if (playerNum > computerNum) resultText += "🎉 You win!";
    else if (playerNum < computerNum) resultText += "Computer wins!";
    else resultText += "It's a tie!";
    resultDiv.textContent = resultText;

    setTimeout(() => {
      playerCard.classList.remove("flipped");
      computerCard.classList.remove("flipped");
      roundActive = false;
    }, 2500);
  }

  startBtn.addEventListener("click", () => {
    resetCards();
    flipComputerCard();
  });

  playerCard.addEventListener("click", () => {
    if (roundActive && !playerCard.classList.contains("flipped")) {
      flipPlayerCard();
    }
  });
});
