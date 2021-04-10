// Default box model, will be copied as a default value to every generated box
const boxModel = {
  digged: false,
  mined: false,
  flagged: false,
  adjacentMines: null
}

export default class GameBoard {
  constructor($element, width) {
    this.grid = null
    this.$element = $element
    this.width = width
    this.initEmptyGrid()
  }

  // Generates an array of dimensions width*width
  // Then fills it with default empty boxes
  initEmptyGrid() {
    const tmpGrid = new Array(this.width)
    .fill([])
    .map((row, rowIdx) => {
      return new Array(this.width).fill([])
        .map((box, colIdx) => {
          return {
            ...boxModel,
            x: colIdx,
            y: rowIdx
          }
        })
      }
    )
    this.grid = [...tmpGrid]
  }

  // Flag the mine boxes as mined, given a set of coordinate tuples
  addMines(mineCoordinates) {
    mineCoordinates.forEach(coords => {
      this.grid[coords[0]][coords[1]].mined = true
    })
  }

  // For each box, get the adjacent ones then check if they're mined
  computeAdjacentMines() {
    this.grid.forEach((row, rowIdx) => {
      row.forEach((box, colIdx) => {
        const adjacent = this.getAdjacentBoxes(rowIdx, colIdx)
        const adjacentMines = adjacent.reduce((prev, box) => {
          if(this.isBoxMined(box[0], box[1])) return prev + 1
          return prev
        }, 0)
        this.grid[rowIdx][colIdx].adjacentMines = adjacentMines
      })
    })
  }

  // Given a X and Y coordinate, compute the coordinates of adjacent boxes
  // This takes corners and "walls" of the game board into account, hence the different conditions.
  getAdjacentBoxes(x, y) {
    const adjacentMines = []

    if(x < this.width - 1) {
      adjacentMines.push([x+1, y])
      if(y < this.width - 1) {
        adjacentMines.push([x+1, y+1])
      }
      if(y >= 1) {
        adjacentMines.push([x+1, y-1])
      }
    }
    if(x > 0) {
      adjacentMines.push([x-1, y])
      if(y < this.width - 1) {
        adjacentMines.push([x-1, y+1])
      }
      if(y >= 1) {
        adjacentMines.push([x-1, y-1])
      }
    }

    if(y < this.width - 1) {
      adjacentMines.push([x, y+1])
    }
    if(y >= 1) {
      adjacentMines.push([x, y-1])
    }
    return adjacentMines
  }

  isBoxMined(x, y) {
    return this.grid[x][y].mined
  }

  // Renders the gameboard object as a HTML element
  // We will add some events and other stuff in part.2
  render() {
    // Reset the HTML Element (will be useful in part.2)
    this.$element.innerHTML = ''

    this.grid.forEach(row => {
      const $row = document.createElement('div')
      $row.classList.add('row')
      
      row.forEach(box => {
        const $box = document.createElement('button')
        $box.classList.add('box')

        if(box.digged) $box.classList.add('uncovered')
        if(box.mined) $box.classList.add('mined')
        if(box.adjacentMines && !box.mined) {
          $box.classList.add('has-indicator')
          $box.dataset.mineCount = box.adjacentMines
        }

        $box.classList.add('uncovered')

        $row.appendChild($box)
      })

      this.$element.appendChild($row)
    })
  }

}