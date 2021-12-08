import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const danger = []
const lines = input.split("\n").map(line => {
  const [a,b] = line.split(" -> ")
  let [ax,ay] = a.split(",").map(d => parseInt(d))
  let [bx,by] = b.split(",").map(d => parseInt(d))

  if(ax!=bx && ay!=by) return false

  if(ax > bx) {
    let tmp = ax
    ax = bx
    bx = tmp
  }
  if(ay > by) {
    let tmp = ay
    ay = by
    by = tmp
  }

  //console.log(a,b)
  //console.log(ax,ay,bx,by)
  for(let x = ax; x <= bx; x++) {
    for(let y = ay; y <= by; y++) {
      //console.log(x,y)
      danger.push([x,y])
    }
  }

  return {a:[ax,ay], b:[bx,by]}
})

console.log(lines)

const counts = _.countBy(danger, d=>JSON.stringify(d))
const answer = _.reduce(counts, (result, value, key) => {
  return result + (value > 1 ? 1 : 0)
}, 0)
console.log(answer)
