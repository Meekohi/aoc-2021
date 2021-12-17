import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const re = input.match(/[\-\d]+\.\.[\-\d]+/g).map(range => {
  const [min,max] = range.split("..").map(Number)
  return {min, max}
})
const target = { x: re[0], y: re[1] }
console.log(target)

let okCount = 0
for(let vx = 1; vx < target.x.max+1; vx++) {
  for(let vy = target.y.min; vy < 1000; vy++) {
    const p = {x:0, y:0}
    const v = {x:vx, y:vy}
    while(true) {
      p.x += v.x
      p.y += v.y
      v.x = v.x <= 0 ? 0 : v.x - 1
      v.y -= 1

      if(
        _.inRange(p.x, target.x.min, target.x.max+1) &&
        _.inRange(p.y, target.y.min, target.y.max+1)
      ) {
        okCount++
        console.log("✓",vx,vy, okCount)
        break
      }

      if(v.y < 0 && p.y < target.y.min) {
        // console.log("X",vx,vy)
        break
      }
    }
  }
}