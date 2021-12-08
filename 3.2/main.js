import fs from 'fs'

const input = fs.readFileSync('input.txt').toString()
const diags = input.split('\n')


function getMask(diags){
  const bits = new Array(diags[0].length).fill(0)
  for(let i = 0; i < diags.length; i++) {
    const diag = diags[i].split('').map(b => parseInt(b))
    
    for(let j = 0; j < diag.length; j++) {
      bits[j] += (diag[j] > 0) ? 1 : -1
    }
  }

  console.log(bits)
  const commonBitMask = bits.map(b => (b >= 0) ? 1 : 0)
  console.log(commonBitMask)
  return commonBitMask
}

let o2 = 0;
let co2 = 0;

let O2rating = diags
for(let i = 0; i < diags.length; i++) {
  const commonBitMask = getMask(O2rating)
  O2rating = O2rating.filter(diag => {
    return diag[i] == commonBitMask[i]
  })

  //console.log("Round ",i)
  //console.log(O2rating)

  if(O2rating.length == 1) {
    o2 = parseInt(O2rating[0],2)
    console.log("O2rating:", O2rating[0], " ", o2)
    
    break
  }
}

let CO2rating = diags
for(let i = 0; i < diags.length; i++) {
  const commonBitMask = getMask(CO2rating)
  CO2rating = CO2rating.filter(diag => {
    return diag[i] != commonBitMask[i]
  })

  if(CO2rating.length == 1) {
    co2 = parseInt(CO2rating[0],2)
    console.log("CO2rating:", CO2rating[0], " ", co2)
    
    break
  }
}

console.log(o2 * co2)