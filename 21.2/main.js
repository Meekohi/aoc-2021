import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const pawns = input.split("\n").map(line => _.last(line.split(" "))).map(Number)
const points = [0,0]

// p goes from 0 to 9
pawns[0] -= 1
pawns[1] -= 1

// lolz, totally different problem...
// 1/3^3 is 1/27

// 5 is like (3,1,1) (1,3,1) (1,1,3) (1,2,2) (2,1,2) (2,2,1)
// 6 is like (3,2,1) (3,1,2) (2,3,1) (2,1,3) (1,3,2) (1,2,3) (2,2,2)

// probability of rolls
//         0  1  2  3  4  5  6  7  8  9
const P = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1]

// 30 x 10 grid of universes -- will update for each round, remove winners as they occur, and keep going until we are done.

let scores = [
  Array(30).fill(0).map(a => Array(10).fill(0)),
  Array(30).fill(0).map(a => Array(10).fill(0))
]

function d(s) {
  console.log( 
      s[0].map( (r,idx) => {
        return String(idx).padStart(2,' ')
          + ': '
          + r.map(n => String(n).padStart(4,' ')).join(" ")
          + ' | '
          + s[1][idx].map(n => String(n).padStart(4,' ')).join(" ")
      })
  )
}

// Set initial condition
scores[0][0][pawns[0]] = 1
scores[1][0][pawns[1]] = 1
d(scores)

const wins = [0,0]
for(let roll = 0; roll < 300; roll++) {
  const newScores = [
    Array(21).fill(0).map(a => Array(10).fill(0)),
    Array(21).fill(0).map(a => Array(10).fill(0))
  ]
  const turn = roll % 2
  const opponentUniverses = _.sum(_.flatMap(scores[(roll+1)%2]))

  for(let score = 0; score < scores[turn].length; score++){
    const prevScore = score
    for(let prevPos = 0; prevPos < scores[turn][score].length; prevPos++) {
      const nUniverses = scores[turn][score][prevPos]
      if(nUniverses == 0) continue

      for(let move = 0; move < P.length; move++) {
        const nextPos = (prevPos + move) % 10
        const newScore = prevScore + (nextPos + 1)
        if(newScore >= 21) {
          wins[turn] += P[move] * nUniverses * opponentUniverses // hardest part was understanding why this is correct
        } else {
          newScores[turn][newScore][nextPos] += P[move] * nUniverses
        }
      }
    }
  }

  scores[turn] = newScores[turn]
  
  console.log("Player",turn,"Roll",roll)
  d(scores)
  console.log("universes...",[
    _.sum(_.flatMapDeep(scores[0])),
    _.sum(_.flatMapDeep(scores[1]))
  ]);
  console.log("wins...",wins)
  
  if(_.every(_.flatMapDeep(scores), s => s == 0)) {
    break;
  }
}
