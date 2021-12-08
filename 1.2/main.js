import fs from 'fs'

const input = fs.readFileSync('input.txt').toString()
const depths = input.split('\n').map(str => parseInt(str))

const avgs = []
for(let i = 2; i < depths.length; i++) {
  avgs.push( depths[i-2] + depths[i-1] + depths[i] )
}

let incs = 0
for(let i = 1; i < avgs.length; i++) {
  if(avgs[i-1] < avgs[i])
    incs++
}

console.log(incs)