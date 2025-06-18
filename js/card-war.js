document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("drawBtn");
  const revealBtn = document.getElementById("revealBtn"); // You may not have this button, adjust accordingly
  const resultDiv = document.getElementById("result");
  const playerCard = document.getElementById("player-card");
  const computerCard = document.getElementById("computer-card");

  const cardValues = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
  ];

  let playerCardValue = null;
  let computerCardValue = null;

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
    [playerCard, computerCard].forEach(cardDiv => {
      cardDiv.classList.remove("flipped");
      cardDiv.querySelector(".back").src = "";
    });
    resultDiv.textContent = "";
  }

  function flipComputerCard() {
    computerCardValue = getRandomCard();
    computerCard.querySelector(".back").src = `../assets/images/${computerCardValue}.png`;
    setTimeout(() => {
      computerCard.classList.add("flipped");
    }, 200);
  }

  function flipPlayerCard() {
    playerCardValue = getRandomCard();
    playerCard.querySelector(".back").src = `../assets/images/${playerCardValue}.png`;
    setTimeout(() => {
      playerCard.classList.add("flipped");
    }, 200);

    setTimeout(() => {
      showResult();
      flipCardsBack();
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
  }

  function flipCardsBack() {
    setTimeout(() => {
      [playerCard, computerCard].forEach(cardDiv => {
        cardDiv.classList.remove("flipped");
        cardDiv.querySelector(".back").src = "";
      });
      resultDiv.textContent = "";
      startBtn.disabled = false;
    }, 2500);
  }

  startBtn.addEventListener("click", () => {
    resetCards();
    startBtn.disabled = true;
    flipComputerCard();
    setTimeout(() => {
      flipPlayerCard();
    }, 1200);
  });
});
