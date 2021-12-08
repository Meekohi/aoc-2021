import fs from 'fs'

const input = fs.readFileSync('input.txt').toString()
const depths = input.split('\n').map(str => parseInt(str))

let incs = 0
for(let i = 1; i < depths.length; i++) {
  if(depths[i-1] < depths[i])
    incs++
}

console.log(incs)
