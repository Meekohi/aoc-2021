import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

let cmds = input.split("\n").map(cmd => {
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

// It would be faster to split as you need to instead of all at the beginning, but 
// this is much simpler to code up.

const xSplits = _.uniq(_.sortBy(_.flatMap(cmds, cmd => [cmd.xRange.low, cmd.xRange.high+1])))
const ySplits = _.uniq(_.sortBy(_.flatMap(cmds, cmd => [cmd.yRange.low, cmd.yRange.high+1])))
const zSplits = _.uniq(_.sortBy(_.flatMap(cmds, cmd => [cmd.zRange.low, cmd.zRange.high+1])))

const blkidx = (i,j,k) => k*(xSplits.length)*(ySplits.length) + j*(xSplits.length) + i
const blocks = Buffer.alloc(xSplits.length * ySplits.length * zSplits.length).fill(0)
console.log(blocks.length, "blocks")

// cmds = cmds.slice(0,1)

_.each(cmds, (cmd,idx) => {
  console.log("cmd: ",idx/cmds.length)
  for(let i = 0; i < xSplits.length-1; i++) {
    if(!_.inRange(xSplits[i], cmd.xRange.low, cmd.xRange.high+1)) continue
    for(let j = 0; j < ySplits.length-1; j++) {
    if(!_.inRange(ySplits[j], cmd.yRange.low, cmd.yRange.high+1)) continue
      for(let k = 0; k < zSplits.length-1; k++) {
      if(!_.inRange(zSplits[k], cmd.zRange.low, cmd.zRange.high+1)) continue
        blocks[blkidx(i,j,k)] = cmd.flip
      }
    }
  }
})

// Count up blocks
let nBlocks = 0
let nLit = 0
for(let i = 0; i < xSplits.length-1; i++) {
  for(let j = 0; j < ySplits.length-1; j++) {
    for(let k = 0; k < zSplits.length-1; k++) {
      if(blocks[blkidx(i,j,k)]) {
        nBlocks++
        const size = (xSplits[i+1] - xSplits[i]) *
                     (ySplits[j+1] - ySplits[j]) *
                     (zSplits[k+1] - zSplits[k])
        nLit += size
      }
    }
  }
}

console.log(nBlocks, nLit)