import fs from 'fs'
import _ from 'lodash'


const input = fs.readFileSync('test.txt').toString()

let floor = input.split("\n").map(r => r.split(''))

function d(floor) {
  console.log(
    floor.map(row => row.join('')).join('\n')
  )
}

d(floor)

for(let i = 0; i < 10000; i++) {
  const og = floor.map(row => row.join('')).join('')
  let f = floor.map(row => [...row].fill('.'))
  
  for(let y = 0; y < floor.length; y++) {
    for(let x = 0; x < floor[y].length; x++) {
      // east
      const xx = (x+1) % floor[y].length
      if(floor[y][x] == '>') {
        if(floor[y][xx] == '.') f[y][xx] = '>'
        else f[y][x] = '>'
      }
      if(floor[y][x] == 'v') f[y][x] = 'v'
    }
  }

  floor = f
  f = floor.map(row => [...row].fill('.'))

  for(let y = 0; y < floor.length; y++) {
    for(let x = 0; x < floor[y].length; x++) {
      // south
      const yy = (y+1) % floor.length
      if(floor[y][x] == 'v') {
        if(floor[yy][x] == '.') f[yy][x] = 'v'
        else f[y][x] = 'v'
      }
      if(floor[y][x] == '>') f[y][x] = '>'
    }
  }

  floor = f
  console.log(`After ${i+1} steps`)
  //d(floor)
  const fg = floor.map(row => row.join('')).join('')
  if(og == fg) {
    console.log("STUCK!")
    console.log("Turn", i+1)
    break
  }
}

