import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const displays = input.split("\n").map(display => {
  const [digits, output] = display.split("|");
  return {
    digits: _.compact(digits.split(" ")),
    output: _.compact(output.split(" "))
  }
})

// console.log(displays)

// const l2d = {
//   'a' : [0, 2, 3, 5, 6, 7, 8, 9],
//   'b' : [0, 4, 5, 6, 8, 9],
//   'c' : [0, 1, 2, 3, 4, 7, 8, 9],
//   'd' : [2, 3, 4, 5, 6, 8, 9],
//   'e' : [0, 2, 6, 8],
//   'f' : [0, 1, 3, 4, 5, 6, 7, 8, 9],
//   'g' : [0, 2, 3, 5, 6, 8, 9]
// }

// const d2l = {
//   0 : ['a','b','c','e','f','g'],
//   1 : ['c','f'],
//   2 : ['a','c','d','e','g'],
//   3 : ['a','c','d','f','g'],
//   4 : ['b','c','d','f'],
//   5 : ['a','b','d','f','g'],
//   6 : ['a','b','d','e','f','g'],
//   7 : ['a','c','f'],
//   8 : ['a','b','c','d','e','f','g'],
//   9 : ['a','b','c','d','f','g']
// }

// Some output to help me create the algorithm
// _.each(d2l, i => {
//   console.log(
//     _.map(isevens, j => {
//       return _.intersection(i, j).length
//     }).join(",")
//   )
// })

const results = displays.map(display => {

  const letters1 = _.find(display.digits, d=>d.length == 2).split('')
  const letters4 = _.find(display.digits, d=>d.length == 4).split('')
  
  // 5s
  const fives = _.keyBy(
    _.filter(display.digits, d=>d.length == 5),
    option => {
      const overlap1 = _.intersection(option.split(''), letters1)
      if(overlap1.length == 2) return 3
      const overlap4 = _.intersection(option.split(''), letters4)
      if(overlap4.length == 2) return 2
      if(overlap4.length == 3) return 5
      throw "Oh no 5s"
    }
  )

  // 6s
  const sixes = _.keyBy(
    _.filter(display.digits, d=>d.length == 6),
    option => {
      const overlap1 = _.intersection(option.split(''), letters1)
      if(overlap1.length == 1) return 6
      const overlap4 = _.intersection(option.split(''), letters4)
      if(overlap4.length == 4) return 9
      if(overlap4.length == 3) return 0
      throw "Oh no 6s"
    }
  )

  const mapping = {
    1: _.find(display.digits, d=>d.length == 2),
    2: fives[2],
    3: fives[3],
    4: _.find(display.digits, d=>d.length == 4),
    5: fives[5],
    6: sixes[6],
    7: _.find(display.digits, d=>d.length == 3),
    8: _.find(display.digits, d=>d.length == 7),
    9: sixes[9],
    0: sixes[0],
  }

  const outputDigits = display.output.map(digit => _.findKey(mapping, word => {
    const xor = _.xor(word.split(''), digit.split(''))
    return xor.length == 0
  }))
  return outputDigits
})

const outputs = results.map(r => parseInt(r.join('')))
console.log(outputs)
console.log(_.sum(outputs))