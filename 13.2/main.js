import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const [dotsString,foldsString] = input.split("\n\n")

console.log(foldsString)

const dots = dotsString.split("\n").map(pair => pair.split(",").map(Number))
const folds = foldsString.split("\n").map(f => {
  const [axis, value] = f.split(" ")[2].split("=")
  return {
    axis,
    value: Number(value)
  }
})

console.log(dots)
console.log(folds)

function foldfold(p,folds) {
  console.log("folds",folds)
  _.each(folds, fold=> {
    // console.log(fold)
    if(fold.axis == 'x') {
      if(p[0] < fold.value) return
    } else {
      if(p[1] < fold.value) return
    }

    // 5 fold 5 gets nuked
    // 6 fold 5 => 4
    if(fold.axis == 'x') {
      // console.log(fold.value, p[0])
      p[0] = fold.value - Math.abs(fold.value - p[0])
    } else {
      p[1] = fold.value - Math.abs(fold.value - p[1])
    }

  })
  return p
}

function d(dots) {
  const X = _.max(dots.map(d => d[0]))
  const Y = _.max(dots.map(d => d[1]))
  let s = ""
  for(let y = 0; y <= Y; y++) {
    for(let x = 0; x <= X; x++) {
      const d = _.find(dots, d => d[0] == x && d[1] == y)
      s = s + (d ? '#' : ' ')
    }
    s = s + "\n"
  }
  console.log(s)
}

const folded = _.uniqBy(dots.map(p => foldfold(p,folds)), a => JSON.stringify(a))
d(folded)