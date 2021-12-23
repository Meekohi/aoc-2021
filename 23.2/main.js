import fs from 'fs'
import _ from 'lodash'

// Fair warning:
// Something is still wrong with this solution, it can get stuck in extremely
// long search loops under certain conditions but I am not sure what

const input = fs.readFileSync('input.txt').toString()

const map = input.split("\n")

const rows = [
  map[2].match(/[ABCD]/g),
  map[3].match(/[ABCD]/g),
  map[4].match(/[ABCD]/g),
  map[5].match(/[ABCD]/g),
]

const ogShramps = _.flatMap(rows, (row, rowIdx) => {
  return _.map(row, (shramp, roomIdx) => {
    return {
      type: shramp,
      room: 1 + 2*roomIdx,
      slot: rowIdx,
      locked: false
    }
  })
})

// const ogShramps = [
//   { type: 'B', room: 1, slot: 0, locked: false },
//   { type: 'C', room: 0, slot: 1, locked: false },
//   { type: 'B', room: 5, slot: 0, locked: false },
//   { type: 'D', room: 8, slot: 1, locked: false },
//   { type: 'D', room: 1, slot: 1, locked: false },
//   { type: 'C', room: 0, slot: 0, locked: false },
//   { type: 'B', room: 5, slot: 1, locked: false },
//   { type: 'A', room: 7, slot: 1, locked: false },
//   { type: 'D', room: 1, slot: 2, locked: false },
//   { type: 'B', room: 2, slot: 0, locked: false },
//   { type: 'A', room: 5, slot: 2, locked: false },
//   { type: 'C', room: 7, slot: 2, locked: false },
//   { type: 'A', room: 1, slot: 3, locked: false },
//   { type: 'D', room: 8, slot: 0, locked: false },
//   { type: 'C', room: 5, slot: 3, locked: false },
//   { type: 'A', room: 7, slot: 3, locked: false }
// ]

function d(ss) {
  let a = "#############".split('')
  let b = "#...........#".split('')
  let c = "###.#.#.#.###".split('')
  let d = "  #.#.#.#.#  ".split('')
  let e = "  #.#.#.#.#  ".split('')
  let f = "  #.#.#.#.#  ".split('')
  let g = "  #########  ".split('')
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
      if(shramp.slot == 2) e[2 + shramp.room] = shramp.type
      if(shramp.slot == 3) f[2 + shramp.room] = shramp.type
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
  console.log(f.join(''))
  console.log(g.join(''))
}

console.log(ogShramps)
d(ogShramps)

const costs = {
  'A': 1,
  'B': 10,
  'C': 100,
  'D': 1000
}

const destinations = {
  'A':1,
  'B':3,
  'C':5,
  'D':7
}

function isInside(room) {
  return room%2 == 1
}
function isOutside(room) {
  return room%2 == 0
}

let bestCost = 46754

function move(journey, depth) {
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
      _.some(shramps, s => (s.room == shramp.room && s.slot < shramp.slot))
    ) return

    let roomsToTry = _.range(0,9)
    // Special case: if you can go home right now, then just go there.
    // there is never a reason to sit around taking up space if you can dunk.
    if(isOutside(shramp.room)) {
      const finalRoom = destinations[shramp.type]
      // G. can't get to the room because someone is in the way.
      const isBlocked =
        (shramp.room < 2 && finalRoom > 2 && blocked2) ||
        (shramp.room > 2 && finalRoom < 2 && blocked2) ||
        (shramp.room < 4 && finalRoom > 4 && blocked4) ||
        (shramp.room > 4 && finalRoom < 4 && blocked4) ||
        (shramp.room < 6 && finalRoom > 6 && blocked6) ||
        (shramp.room > 6 && finalRoom < 6 && blocked6)
      
      const roomIsSafe = _.every(shramps, s => s.room != finalRoom || s.type == shramp.type)

      if(!isBlocked && roomIsSafe) {
        roomsToTry = [finalRoom]
      }
    }


    _.each(roomsToTry, room => {

      // D. can't move between outdoor spots
      if(isOutside(shramp.room) && isOutside(room)) return

      // E. can't move between indoor spots
      // * we force them to do this as two steps to simplify confirming the path
      //   same cost as moving all at once so it's fine
      if(isInside(shramp.room) && isInside(room)) return

      // Q. They have to end up IN ORDER not just paired together in rooms
      if(isInside(room) && room != destinations[shramp.type]) return

      // G. can't get to the room because someone is in the way.
      if(shramp.room < 2 && room > 2 && blocked2) return
      if(shramp.room > 2 && room < 2 && blocked2) return
      if(shramp.room < 4 && room > 4 && blocked4) return
      if(shramp.room > 4 && room < 4 && blocked4) return
      if(shramp.room < 6 && room > 6 && blocked6) return
      if(shramp.room > 6 && room < 6 && blocked6) return

      _.each([0,1,2,3], slot => {
        // I. spot doesn't exist
        if([2,4,6].includes(room) && slot > 0) return
        if([0,8].includes(room) && slot > 1) return

        // Z. Don't block someone in or leave a gap indoors, never the right answer because you can't undo it
        if(isInside(room)) {
          for(let lower = slot+1; lower < 4; lower++) {
            const stuckShramp = _.find(shramps, s => (s.room == room && s.slot == lower))
            if(!stuckShramp) return
            if(stuckShramp.room != destinations[stuckShramp.type]) return
          }
        }

        // C. spot is taken
        if(_.some(shramps, s => (s.room == room && s.slot == slot))) return

        // F. can't get to spot because it's blocked in the same room
        if(
          _.some(shramps, s => (s.room == room && s.slot < slot && s != shramp))
        ) return

        // H. moving indoors but wrong type of shramp is in the room.
        //    damn racist shramps
        // Redundant with check (Q) shramp is right type and (Z) everyone else is too
        // if(isInside(room)) {
        //   const h = _.find(shramps, s => (s.room == room && s != shramp))
        //   if(h && h.type != shramp.type) return
        // }

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

        move(newJourney, depth+1)
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
