import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const floor = input.split("\n").map(row => row.split('').map(Number))

// console.log(floor.length)
// console.log(floor.map(r=>r.length).join(", "))

const mins = []

for(var i = 0; i < floor.length; i++){
  for(var j = 0; j < floor[i].length; j++) {
    const p = floor[i][j]
    if(i > 0 && floor[i-1][j] <= p) continue
    if(j > 0 && floor[i][j-1] <= p) continue

    if(i+1 < floor.length && floor[i+1][j] <= p) continue
    if(j+1 < floor[i].length && floor[i][j+1] <= p) continue
    

    //console.log("floor:",i,j)
    mins.push(floor[i][j])
  }
}

//console.log(mins)
console.log(_.sum(mins.map(m=>m+1)))