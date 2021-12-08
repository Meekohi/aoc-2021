import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const draws = input.split("\n")[0].split(",").map(draw => parseInt(draw))

const boards = input.split("\n\n").slice(1).map(
  boardString => boardString.split('\n').map(
    boardRow => _.compact(boardRow.split(/ +/)).map(
      b => parseInt(b)
    )
  )
)

console.log(draws)
console.log(boards)

let flags = JSON.parse(JSON.stringify(boards));
flags = _.map(flags, flagBoard => _.map(flagBoard, flagRow => flagRow.fill(false)))

function checkBoard(flagBoard) {
  for(let i = 0; i < flagBoard.length; i++) {
    let rowBingo = true
    let colBingo = true
    for(let j = 0; j < flagBoard[i].length; j++) {
      rowBingo = rowBingo && flagBoard[i][j]
      colBingo = colBingo && flagBoard[j][i]
    }
    if(colBingo || rowBingo) {
      // console.log(flagBoard)
      return true
    }
  }
  return false
}

function scoreWinner(board, flagBoard) {
  let sum = 0
  for(let y = 0; y < flagBoard.length; y++) {
    for(let x = 0; x < flagBoard[y].length; x++) {
      if(!flagBoard[y][x])
        sum += board[y][x]
    }
  }
  console.log("Winner Score: ", sum)
  return sum
}

function findWinner() {
  const winnerIdxs = []
  for(let drawIdx = 0; drawIdx < draws.length; drawIdx++) {
    const draw = draws[drawIdx]
    console.log("Round ",drawIdx)
    console.log(draw,"...")
    for(let boardIdx = 0; boardIdx < boards.length; boardIdx++){
      if(winnerIdxs.includes(boardIdx)) continue
      const board = boards[boardIdx]
      for(let y = 0; y < board.length; y++) {
        const row = board[y]
        for(let x = 0; x < row.length; x++) {
          if(draw == board[y][x]) {
            flags[boardIdx][y][x] = true
          }
        }
      }

      if(checkBoard(flags[boardIdx])) {
        winnerIdxs.push(boardIdx)
        console.log("Winner is board", boardIdx)
        if(winnerIdxs.length == boards.length) {
          console.log("The last winner:")
          console.log( draw * scoreWinner(boards[boardIdx], flags[boardIdx]) )
          return
        }
      }
    }
  }
}

findWinner()