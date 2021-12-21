import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const pawns = input.split("\n").map(line => _.last(line.split(" "))).map(Number)
const points = [0,0]

// p goes from 0 to 9
pawns[0] -= 1
pawns[1] -= 1

// roll goes from 0 to 99
let roll = 0
function nextRoll() {
  return (roll++)%100 + 1
}
for(let turn = 0; ; turn = (turn + 1)%2) {
  const move = nextRoll() + nextRoll() + nextRoll()

  console.log(turn,"move:",move)

  pawns[turn] = (pawns[turn] + move)%10
  
  points[turn] += pawns[turn]+1

  if(points[turn] >= 1000) {
    console.log(points)
    console.log(roll)
    console.log(_.min(points)*roll)
    break
  }
}