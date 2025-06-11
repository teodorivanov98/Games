// card-war.js
const resultDiv = document.getElementById("result");

function drawCard() {
  return Math.floor(Math.random() * 13) + 1; // Cards 1 to 13
}

function drawCards() {
  const player = drawCard();
  const computer = drawCard();
  let result = `You drew ${player}, Computer drew ${computer}. `;

  if (player > computer) result += "You win!";
  else if (player < computer) result += "Computer wins!";
  else result += "It's a tie!";

  resultDiv.textContent = result;
}
