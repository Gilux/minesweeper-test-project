import GameBoard from "../classes/GameBoard.js"
import { randomNumber } from "./misc.js"

// See in uniqueRandomCoords why this :D
class CoordsSet extends Set {
  add(elem){
    return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
  // Used under the hood (e.g. when add is called) to check if an item already exists
  has(elem){
    return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
}

// Generate the gameboard as a big array of arrays (rows) of squares
export const generateGameBoard = (gameboardWidth, mineCount) => {
  // Call more low-level functions to generate a unique set of mines coordinates
  const minesCoordinates = uniqueRandomCoords(gameboardWidth, mineCount)
  
  const gameBoard = new GameBoard (
    document.querySelector('.board .grid'),
    gameboardWidth
  )
  gameBoard.addMines(minesCoordinates)

  gameBoard.computeAdjacentMines()

  return gameBoard
}

// Fills a set of unique random coords
// Note that we use here a subclass of Set which stringifies coords
// because a classic Set will consider 2 array elements as unique
// (because of their memory address) even with the same content.
const uniqueRandomCoords = (gameboardWidth, pairCount) => {
  // The Set acts like an array, but only allows unique elements inside it.
  const pairs = new CoordsSet()
  
  while(pairs.size < pairCount) {
    pairs.add(randomCoords(gameboardWidth, pairCount))
  }
  return [...pairs].map(JSON.parse)
}

// Generates a tuple (eg: [0, 5]) of x/y coordinates within 0 and max-1.
const randomCoords = (max) => {
  return [
    randomNumber(0, max-1),
    randomNumber(0, max-1)
  ]
}

