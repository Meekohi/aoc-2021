import fs from 'fs'

const input = fs.readFileSync('input.txt').toString()
const cmds = input.split('\n')

let horiz = 0
let depth = 0
let aim = 0

for(let i = 0; i < cmds.length; i++) {
  const cmd = cmds[i].split(' ')
  const dir = cmd[0]
  const val = parseInt(cmd[1])

  if(dir == 'forward') {
    horiz += val
    depth += val*aim
  }
  else if(dir == 'down')
    aim += val
  else if (dir == 'up')
    aim -= val
  else
    console.log("BAD DATA")
}

console.log(horiz, depth, horiz*depth)