import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const [lookupString, imageParagraph] = input.split("\n\n")
const lookup = lookupString.split('').map(c => c=='#' ? 1 : 0)
const origImg = imageParagraph.split('\n').map(row => row.split('').map(c => c=='#' ? 1 : 0))

const N = 50
const sidePadding = Array(2*N).fill(0)
const wideImg = origImg.map(row => [...sidePadding, ...row, ...sidePadding])
const vertPadding = Array(2*N).fill( _.clone(wideImg[0]).fill(0) )
let img = [...vertPadding, ...wideImg, ...vertPadding]

function d(image) {
  const s = image.map(row => row.map(b => (b == '?') ? '?' : b==1 ? '#' : '.').join('')).join('\n')
  console.log(s)
  console.log(" ")
}
//d(img)

let background = 0
for(let n = 0; n < N; n++) {
  background = n % 2
  const nextImg = img.map(row => row.map(b => '?'))
  for(let y = 0; y < nextImg.length; y++) {
    for(let x = 0; x < nextImg[y].length; x++) {
      const bits = [
        img[y-1] && img[y-1][x-1],
        img[y-1] && img[y-1][x+0],
        img[y-1] && img[y-1][x+1],
        img[y+0] && img[y+0][x-1],
        img[y+0] && img[y+0][x+0],
        img[y+0] && img[y+0][x+1],
        img[y+1] && img[y+1][x-1],
        img[y+1] && img[y+1][x+0],
        img[y+1] && img[y+1][x+1],
      ]
      let idx = parseInt(bits.map(b => b == undefined ? background : b).join(''),2)
      nextImg[y][x] = lookup[idx]
    }
  }
  //d(nextImg)
  img = nextImg
}

console.log(
  _.countBy(img.flat())
)