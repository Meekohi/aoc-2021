import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const costs = input.split("\n").map(row => row.split('').map(Number))

function d(m) {
  console.log(m.map(row => row.join("")).join("\n"))
}
d(costs)

const shortestJourneys = costs.map(r => r.map(c => ({
  cost: Infinity,
  path: []
})))
shortestJourneys[0][0] = {
  cost: 0,
  path:[{x:0,y:0}]
}

const revisit = [shortestJourneys[0][0]]

let calls = 0
function walk(oldJourney) {
  //console.log("calls",calls++)
  const pos = _.last(oldJourney.path)

  const dirs = [
    {x: 1,y: 0},
    {x:-1,y: 0},
    {x: 0,y: 1},
    {x: 0,y:-1}
  ]

  _.each(dirs, dir => {
    const x = pos.x + dir.x
    const y = pos.y + dir.y
    if(!_.inRange(y,0,costs.length) || !_.inRange(x,0,costs[y].length))
      return;

    const newJourney = {
      cost: oldJourney.cost + costs[y][x],
      path: [...oldJourney.path, {x,y}]
    }
    
    if(newJourney.cost < shortestJourneys[y][x].cost) {
      //console.log(x,y,'=',newJourney.cost)
      shortestJourneys[y][x] = newJourney
      revisit.push(newJourney)
    }
  })

  calls--
}

while(revisit.length) {
  walk(revisit.shift())
}

console.log("Done!")
console.log(_.last(_.last(shortestJourneys)))