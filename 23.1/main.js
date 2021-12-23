import fs from 'fs'
import _ from 'lodash'

// Could use way more optimization

const input = fs.readFileSync('input.txt').toString()

const map = input.split("\n")

const top = map[2].match(/[ABCD]/g)
const bottom = map[3].match(/[ABCD]/g)

const topShramp = _.map(top, (s,idx) => ({
  type: s,
  room: 1 + 2*idx,
  slot: 0,
  locked: false
}))
const bottomShramp = _.map(bottom, (s,idx) => ({
  type: s,
  room: 1 + 2*idx,
  slot: 1,
  locked: false
}))

const ogShramps = [...topShramp, ...bottomShramp]

function d(ss) {
  let a = "#############".split('')
  let b = "#...........#".split('')
  let c = "###.#.#.#.###".split('')
  let d = "  #.#.#.#.#  ".split('')
  let e = "  #########  ".split('')
  _.each(ss, shramp => {
    if(shramp.room == 0) {
      if(shramp.slot == 0) b[2] = shramp.type
      if(shramp.slot == 1) b[1] = shramp.type
    }
    else if(shramp.room == 8) {
      if(shramp.slot == 0) b[10] = shramp.type
      if(shramp.slot == 1) b[11] = shramp.type
    }
    else if(shramp.room % 2 == 1) {
      if(shramp.slot == 0) c[2 + shramp.room] = shramp.type
      if(shramp.slot == 1) d[2 + shramp.room] = shramp.type
    }
    else {
      b[2 + shramp.room] = shramp.type
    }
  })

  console.log(a.join(''))
  console.log(b.join(''))
  console.log(c.join(''))
  console.log(d.join(''))
  console.log(e.join(''))
}

console.log(ogShramps)
d(ogShramps)

const costs = {
  'A': 1,
  'B': 10,
  'C': 100,
  'D': 1000
}

function isInside(room) {
  return room%2 == 1
}
function isOutside(room) {
  return room%2 == 0
}

let bestCost = Infinity

function move(journey) {
  // O. Don't bother following paths more expensive than the best one
  if(journey.cost >= bestCost) return

  const shramps = journey.shramps
  const blocked2 = _.some(shramps, s => (s.room == 2))
  const blocked4 = _.some(shramps, s => (s.room == 4))
  const blocked6 = _.some(shramps, s => (s.room == 6))

  _.each(shramps, (shramp, shrampIdx) => {
    // A. shramp is locked
    if(shramp.locked) return

    // B. blocked in this room so can't move anywhere
    if(
      shramp.slot == 1 &&
      _.some(shramps, s => (s.room == shramp.room && s.slot == 0))
    ) return

    _.each(_.range(0,9), (room, roomIdx) => {

      // progress bar
      if(journey.path.length == 0) {
        const perc = (shrampIdx/shramps.length) + (1/shramps.length)*(roomIdx/9);
        console.log("progress:",`layer ${journey.path.length} (${perc})`, shramp.type, roomIdx)
      }


      // D. can't move between outdoor spots
      if(isOutside(shramp.room) && isOutside(room)) return

      // E. can't move between indoor spots
      // * we force them to do this as two steps to simplify confirming the path
      //   same cost as moving all at once so it's fine
      if(isInside(shramp.room) && isInside(room)) return

      // Q. God damnit I didn't catch this at first. They have to end up IN ORDER not just
      // paired together in rooms
      const destinations = {
        'A':1,
        'B':3,
        'C':5,
        'D':7
      }
      if(isInside(room) && room != destinations[shramp.type]) return

      // G. can't get to the room because someone is in the way.
      if(shramp.room < 2 && room > 2 && blocked2) return
      if(shramp.room > 2 && room < 2 && blocked2) return
      if(shramp.room < 4 && room > 4 && blocked4) return
      if(shramp.room > 4 && room < 4 && blocked4) return
      if(shramp.room < 6 && room > 6 && blocked6) return
      if(shramp.room > 6 && room < 6 && blocked6) return

      _.each([0,1], slot => {
        // I. spot doesn't exist
        if([2,4,6].includes(room) && slot == 1) return

        // C. spot is taken
        if(_.some(shramps, s => (s.room == room && s.slot == slot))) return

        // F. can't get to spot because it's blocked in the same room
        if(
          slot == 1 &&
          _.some(shramps, s => (s.room == room && s.slot == 0 && s != shramp))
        ) return

        // H. moving indoors but wrong type of shramp is in the room.
        //    damn racist shramps
        const h = _.find(shramps, s => (s.room == room && s != shramp))
        if(h && h.type != shramp.type) return

        // Ok, let's go to there!
        const fromInsideBonus = (isInside(shramp.room) && (shramp.room != room)) ? 1 : 0
        const toInsideBonus = (isInside(room) && (shramp.room != room)) ? 1 : 0
        const moveCost = costs[shramp.type] * (
          Math.abs(shramp.room - room) +
          shramp.slot + slot +
          fromInsideBonus + toInsideBonus
        )

        // Early abort if it's too expensive, no need to check it out
        if(journey.cost + moveCost >= bestCost) return

        const newShramps = [...shramps]
        newShramps[shrampIdx] = {
          type: newShramps[shrampIdx].type,
          room,
          slot,
          locked: isInside(room)
        }
        const newJourney = {
          shramps: newShramps,
          cost: journey.cost + moveCost,
          path: [...journey.path, {c: moveCost, s: newShramps}]
        }

        // Check for win condition
        if(_.every(newJourney.shramps, s => s.room == destinations[s.type])) {
          d(ogJourney.shramps)
          _.each(newJourney.path, p => {
            console.log("    =====> ",p.c)
            d(p.s)
          })
          bestCost = newJourney.cost
          console.log("Total:",bestCost)
          return
        }

        move(newJourney)
      })
    })
  })
}

const ogJourney = {
  shramps: ogShramps,
  cost: 0,
  path: []
}
move(ogJourney, 0)
