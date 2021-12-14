import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const [seed,rulesString] = input.split("\n\n")
const rulesArray = rulesString.split("\n").map(rule => {
  const r = rule.split(" -> ")
  return {
    pair: r[0],
    insert: r[1]
  }
})
const rules = _.keyBy(rulesArray, r => r.pair)

console.log(rules)

let polymer = seed
for(let t = 0; t < 10; t++) {
  console.log(`${t}: ${polymer}`)
  for(let i = 0; i < polymer.length-1; i++) {
    const pair = polymer.slice(i,i+2)
    if(rules[pair]) {
      //console.log("insert:",rules[pair].insert)
      polymer = `${polymer.slice(0,i+1)}${rules[pair].insert}${polymer.slice(i+1)}`
      i++
    }
  }
}

console.log(_.countBy(polymer.split('')))
console.log(_.max)