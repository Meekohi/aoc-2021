import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const octos = input.split("\n").map(r => r.split('').map(Number))

function d(grid){
  console.log(
    grid.map(r=>r.map(o => o>9 ? '*' : o).join("")).join("\n")
  )
}

let flashses = 0

function flash(grid, i, j) {
  if(!_.inRange(i,0,grid.length) || !_.inRange(j,0,grid[i].length)) return
  grid[i][j]++
  if(grid[i][j] == 10) {
    flashses++
    flash(grid,i-1,j-1)
    flash(grid,i-1,j)
    flash(grid,i-1,j+1)

    flash(grid,i,j-1)
    flash(grid,i,j+1)

    flash(grid,i+1,j-1)
    flash(grid,i+1,j)
    flash(grid,i+1,j+1)
  }
}

function step(grid) {
  
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      flash(grid,i,j)
    }
  }

  return grid.map(r => r.map(o => o > 9 ? 0 : o))
}

let grid = octos
d(grid)
for(let t = 1; t < 101; t++) {
  grid = step(grid)
  console.log(` === ${t} ===`)
  d(grid)
}

console.log("flashu:",flashses)