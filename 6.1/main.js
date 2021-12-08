import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const ages = _.countBy(input.split(","))
console.log(ages)

for(let t = 0; t < 256; t++){
  const newFish = ages['0'] || 0
  ages['0'] = ages['1'] || 0
  ages['1'] = ages['2'] || 0
  ages['2'] = ages['3'] || 0
  ages['3'] = ages['4'] || 0
  ages['4'] = ages['5'] || 0
  ages['5'] = ages['6'] || 0
  ages['6'] = ages['7'] || 0
  ages['7'] = ages['8'] || 0
  ages['8'] = newFish

  ages['6'] += newFish

  console.log(ages)
}

const total = _.reduce(ages, (result, value, key) => {
  return result + value
}, 0)

console.log(total)