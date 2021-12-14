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

// Yeah yeah I get it... some sort of dynamic programming nonsense...

const elements = _.keys(_.countBy(rulesArray, r => r.pair[0]))
console.log(elements)

// 3D cube with pairs and depth maybe?
function cube(i,j,t){
  if(t == 40) {
    const empty = _.fromPairs(elements.map(e => [e,0]))
    return empty
  }

  const middleElement = rules[`${i}${j}`].insert
  const prefixCount = cube(i,middleElement,t+1)
  const postfixCount = cube(middleElement,j,t+1)

  const total = _.mapValues(prefixCount, (value, key) => {
    return prefixCount[key] + postfixCount[key]
  })
  total[middleElement]++
  //console.log('[',i,j,t,']',':',total)
  return total
}

cube = _.memoize(cube, (i,j,t) => `${i},${j},${t}`)

let tally = _.fromPairs(elements.map(e => [e,0]))
for(let k = 0; k < seed.length; k++) {
  if(k+1 == seed.length) {
    tally[seed[k]]++
    continue
  }

  const more = cube(seed[k],seed[k+1],0)
  tally = _.mapValues(tally, (value, key) => {
    return tally[key] + more[key]
  })
  tally[seed[k]]++
}

console.log(tally)
