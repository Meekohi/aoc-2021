import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const lines = input.split("\n").map(line => {
  const [a,b] = line.split(" -> ")
  let [ax,ay] = a.split(",").map(d => parseInt(d))
  let [bx,by] = b.split(",").map(d => parseInt(d))

  let xs = _.range(ax, bx + (bx < ax ? -1 : 1))
  let ys = _.range(ay, by + (by < ay ? -1 : 1))

  if(xs.length == 1) xs = Array(ys.length).fill(ax)
  if(ys.length == 1) ys = Array(xs.length).fill(ay)

  const wat = _.zip(xs,ys)

  return wat
})

const danger = _.flatten(lines)

const counts = _.countBy(danger, d=>JSON.stringify(d))
const answer = _.reduce(counts, (result, value, key) => {
  return result + (value > 1 ? 1 : 0)
}, 0)
console.log(answer)
