import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const displays = input.split("\n").map(display => {
  const [digits, output] = display.split("|");
  return {
    digits: _.compact(digits.split(" ")),
    output: _.compact(output.split(" "))
  }
})

// console.log(displays)

const simpledigcount = displays.map(display => {
  return display.output.filter(out => {
    return [2,3,4,7].includes(out.length)
  }).length
})

console.log(simpledigcount)
console.log(_.sum(simpledigcount))