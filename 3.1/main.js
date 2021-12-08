import fs from 'fs'

const input = fs.readFileSync('input.txt').toString()
const diags = input.split('\n')

const bits = new Array(diags[0].length).fill(0)
for(let i = 0; i < diags.length; i++) {
  const diag = diags[i].split('').map(b => parseInt(b))

  console.log(diag)
  
  for(let j = 0; j < diag.length; j++) {
    bits[j] += (diag[j] > 0) ? 1 : -1
  }
}

console.log(bits)
const gamma2 = bits.map(b => b > 0 ? 1 : 0).join('')
const epsilon2 = bits.map(b => b > 0 ? 0 : 1).join('')

const gamma = parseInt(gamma2,2)
const epsilon = parseInt(epsilon2,2)

console.log('gamma ', gamma2 ,' ', gamma)
console.log('epsilon ', epsilon2, ' ', epsilon)

console.log(gamma * epsilon)