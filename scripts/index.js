import { generateGameBoard } from "./helpers/gameboard.js"

document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = generateGameBoard(10, 15)
  gameBoard.render()
})