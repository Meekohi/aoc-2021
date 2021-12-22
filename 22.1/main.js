import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const cmds = input.split("\n").map(cmd => {
  const [flip, region] = cmd.split(" ")
  const [xRange, yRange, zRange] = region.split(",").map(dim => {
    const range = dim.match(/[\d\-]+/g).map(Number)
    return {
      low: range[0],
      high:range[1]
    }
  })
  return {
    flip: flip=='on' ? 1 : 0,
    xRange, yRange, zRange
  }
})
console.log(cmds)

let totalOn = 0
for(let x = -50; x <= 50; x++){
  for(let y = -50; y <= 50; y++){
    for(let z = -50; z <= 50; z++){
      const finalState = _.reduce(cmds, (state, cmd) => {
        if(
          _.inRange(x, cmd.xRange.low, cmd.xRange.high+1) &&
          _.inRange(y, cmd.yRange.low, cmd.yRange.high+1) &&
          _.inRange(z, cmd.zRange.low, cmd.zRange.high+1)
        ) {
          return cmd.flip
        }
        return state 
      },0)
      if(finalState) totalOn++
    }
  }
}

console.log(totalOn)