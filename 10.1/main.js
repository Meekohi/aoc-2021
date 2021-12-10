import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('test.txt').toString()

const lines = input.split("\n")

const pointMultipliers = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const score = {
  ')': 0,
  ']': 0,
  '}': 0,
  '>': 0,
}

const trimmedLines = lines.map(line => {
  while(true) {
    const newline = line.replace(/\(\)|\[\]|\{\}|\<\>/g,'')
    if(line == newline) break
    line = newline
  }
  return line
})

console.log(trimmedLines)

const scoredLines = trimmedLines.map(l => {
  const endsOnly = l.replace(/\(|\[|\{|\</g,'')
  console.log(endsOnly)
  if(endsOnly.length == 0) return 0
  else return pointMultipliers[endsOnly[0]]
})

console.log(scoredLines)
console.log(_.sum(scoredLines))