import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const poss = _.countBy(input.split(","))

const xMax = _.max(_.keys(poss).map(k => parseInt(k)))
console.log(xMax)

let bestAlign = Infinity
let bestCost = Infinity

for(let align = 0; align < xMax; align++) {
  const cost = _.reduce(poss, (result, value, key) => {
    const pos = parseInt(key)
    const dist = Math.abs(pos - align)
    return result + value * dist
  },0)
  console.log(align, cost)
  if(cost < bestCost) {
    bestCost = cost
    bestAlign = align
  }
}
console.log("Final:")
console.log(bestAlign, bestCost)