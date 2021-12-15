import fs from 'fs'
import _ from 'lodash'
import { exit } from 'process'

const input = fs.readFileSync('input.txt').toString()

const miniCosts = input.split("\n").map(row => row.split('').map(Number))

function bump(row){
  return _.map(row, n => n == 9 ? 1 : n+1)
}

const wideCosts = miniCosts.map(row => [
  ...row,
  ...bump(row),
  ...bump(bump(row)),
  ...bump(bump(bump(row))),
  ...bump(bump(bump(bump(row)))),
])

const costs = [
  ...wideCosts,
  ...wideCosts.map(bump),
  ...wideCosts.map(bump).map(bump),
  ...wideCosts.map(bump).map(bump).map(bump),
  ...wideCosts.map(bump).map(bump).map(bump).map(bump),
]

console.log("Problem size:",costs.length,'x',costs[0].length)

const shortestJourneys = costs.map(r => r.map(c => Infinity))
shortestJourneys[0][0] = 0
let revisit = [{x:0,y:0}]

function walk(pos) {
  const dirs = [
    {x: 0,y:-1},
    {x:-1,y: 0},
    {x: 0,y: 1},
    {x: 1,y: 0},
  ]

  _.each(dirs, dir => {
    const x = pos.x + dir.x
    const y = pos.y + dir.y
    if(!_.inRange(y,0,costs.length) || !_.inRange(x,0,costs[y].length))
      return;

    const newJourney = {
      cost: shortestJourneys[pos.y][pos.x] + costs[y][x]
    }
    
    if(newJourney.cost < shortestJourneys[y][x]) {
      shortestJourneys[y][x] = newJourney.cost
      revisit.push({x,y})
    }
  })
}

let n = 0;
while(true) {
  if(
    revisit.length == 0
  ) {
    console.log("Done!")
    console.log(_.last(_.last(shortestJourneys)))
    exit(0)
  }

  // could do like real A* but no point really.
  // if(n++ % 100000 == 0) {
  //   revisit = _.sortBy(revisit, r => shortestJourneys[r.y][r.x]-5*(r.x-r.y)) // cost, but extra points for being closer
  //   console.log("~~~",revisit[0].x,revisit[0].y,`(${revisit.length} in queue)`)
  //   console.log(_.last(_.last(shortestJourneys)))
  //   fs.writeFileSync('output.txt',shortestJourneys.map(row => row.join(',')).join('\n'))
  // }
  walk(revisit.shift())
}