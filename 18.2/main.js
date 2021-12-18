import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const summands = input.split("\n").map(row => JSON.parse(row))
let globalProblem = []

function add(problem, flatIdx, n) {
  if(flatIdx < 0) return

  let walked = 0
  for(let i = 0; i < problem.length; i++) {
    if(_.isNumber(problem[i])) {
      if(flatIdx-walked == 0) {
        problem[i] += n
      }
      walked++
    } else {
      walked += add(problem[i], flatIdx-walked, n)
    }
  }
  return walked
}

// To explode a pair, the pair's left value is added to the first regular number to the left of the exploding pair (if any), and the pair's right value is added to the first regular number to the right of the exploding pair (if any).
// Exploding pairs will always consist of two regular numbers.
// Then, the entire exploding pair is replaced with the regular number 0.
function explode(problem, flatIdx=0, depth=0) {
  let walked = 0
  for(let i = 0; i < problem.length; i++) {
    if(_.isNumber(problem[i])) {
      walked++
      continue
    }

    if(_.isArray(problem[i]) && depth == 3){
      // sanity checks
      if(problem[i].length != 2) throw "OH NO"
      if(!_.isNumber(problem[i][0]) || !_.isNumber(problem[i][1])) throw "OH NO"

      add(globalProblem, flatIdx+walked-1, problem[i][0])
      add(globalProblem, flatIdx+walked+2, problem[i][1])
      problem[i] = 0
      return false
    }

    const innerWalked = explode(problem[i], flatIdx+walked, depth+1)
    if(innerWalked == false) return false // bail out so you don't explode twice by accident now that you changed the flatIdx
    walked += innerWalked
  }
  return walked
}

// To split a regular number, replace it with a pair;
// the left element of the pair should be the regular number divided by two and rounded down,
// while the right element of the pair should be the regular number divided by two and rounded up.
// Then, the entire exploding pair is replaced with the regular number 0.
function split(problem) {
  for(let i = 0; i < problem.length; i++) {
    if(_.isNumber(problem[i]) && problem[i] >= 10) {
      problem[i] = [
        Math.floor(problem[i]/2),
        Math.ceil(problem[i]/2)
      ]
      return false
    }

    if(split(problem[i]) == false)
      return false // bail out so you don't split twice... although in theory you could keep going tbh
  }
  return true
}

function reduce(problem) {
  globalProblem = problem
  while(true) {
    console.log(JSON.stringify(globalProblem))
    const exploded = explode(globalProblem)
    if(exploded == false) continue
    const splitted = split(globalProblem)
    if(splitted != false) break
  }
  return globalProblem
}

function magnitude(problem) {
  if(_.isNumber(problem)) return problem
  return 3 * magnitude(problem[0]) + 2 * magnitude(problem[1])
}

// Debug fun
let bestI = 0
let bestJ = 0
let bestP = 0
let maxM = 0
for(let i = 0; i < summands.length; i++) {
  for(let j = 0; j < summands.length; j++) {
    if(i == j) continue
    const sumCopy = _.cloneDeep(summands)
    const p = reduce([sumCopy[i], sumCopy[j]])
    const M = magnitude(p)
    if(M > maxM) {
      maxM = M
      bestI = i
      bestJ = j
      bestP = p
    }
  }
}
console.log(maxM, bestI, bestJ)
console.log(JSON.stringify(summands[bestI]))
console.log("+")
console.log(JSON.stringify(summands[bestJ]))
console.log("=")
console.log(JSON.stringify(bestP))
console.log(magnitude(bestP))
