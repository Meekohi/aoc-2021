import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const lines = input.split("\n")

const pointMultipliers = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const lines1 = lines.map(originalLine => {
  let trimmedLine = originalLine
  while(true) {
    const newline = trimmedLine.replace(/\(\)|\[\]|\{\}|\<\>/g,'')
    if(trimmedLine == newline) break
    trimmedLine = newline
  }
  return {
    originalLine,
    trimmedLine,
  }
})

const scoredLines = lines1.map(l => {
  const endsOnly = l.trimmedLine.replace(/\(|\[|\{|\</g,'')
  if(endsOnly.length > 1) return false; // corrupted

  const stack = _.reverse(l.trimmedLine.split(''))
  console.log(stack)
  const score = _.reduce(stack, (score, char) => {
    return score * 5 + pointMultipliers[char]
  }, 0)
  return score
  
  // const line = l.originalLine.split('')
  // const stack = []
  // for(let i = 0; i < line.length; i++) {
  //   if(line.length == 0) {
  //     // TODO Switch to popping off the stack
  //     let score = 0
  //     while(stack.length) {
  //       score = score * 5 + pointMultipliers[stack[0]]
  //       console.log(score)
  //       stack.shift()
  //     }
  //     return score
  //   }
  //   if(stack.length == 0) {
  //     stack.push(line.shift())
  //     return
  //   }
  //   if(paired(stack[0], line[0])) {
  //     stack.shift()
  //     line.shift()
  //   }
  // }

  // return "DOOM"
})

console.log(scoredLines)
const sortedScores = _.sortBy(_.compact(scoredLines))
console.log(sortedScores)
console.log(sortedScores[Math.floor(sortedScores.length / 2)])