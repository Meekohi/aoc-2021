import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const floor = input.split("\n").map(row => row.split('').map(Number))
const visited = floor.map(row => row.slice().fill(false))

console.log(visited)

const basins = []

function fillBasin(i,j,basin){
  if(i < 0) return
  if(j < 0) return
  if(i >= floor.length) return
  if(j >= floor[i].length) return
  if(visited[i][j]) return

  visited[i][j] = true
  if(floor[i][j] == 9) {
    return
  }
  
  fillBasin(i-1,j,basin)
  fillBasin(i+1,j,basin)
  fillBasin(i,j-1,basin)
  fillBasin(i,j+1,basin)

  basin.push({i,j,v:floor[i][j]})
}

for(var i = 0; i < floor.length; i++){
  for(var j = 0; j < floor[i].length; j++) {
    const newBasin = []
    fillBasin(i,j,newBasin)
    if(newBasin.length > 0) basins.push(newBasin)
  }
}

const basinSizes = _.sortBy(basins.map(b => b.length), b => -b)

console.log(basinSizes)
console.log(basinSizes[0] * basinSizes[1] * basinSizes[2])