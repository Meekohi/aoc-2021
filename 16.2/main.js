import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

let s = input.split('').map(hex => parseInt(hex, 16).toString(2).padStart(4,'0')).join('')

function parseLiteralSegments(){
  const continueFlag = (s[0] == 1)
  let binaryString = s.slice(1,5)
  s = s.slice(5)
  if(continueFlag)
    binaryString += parseLiteralSegments()
  return binaryString 
}

function parseLiteral() {
  const binaryString = parseLiteralSegments(s)
  // console.log(parseInt(binaryString, 2))
  return parseInt(binaryString, 2)
}

function parseSubpacketsBits(bitLength) {
  const packets = []
  const remainder = s.slice(bitLength)
  s = s.slice(0,bitLength)
  while(s.length)
    packets.push(parsePacket())
  s = remainder
  return packets
}

function parseSubpacketsNum(nPackets) {
  const packets = []
  for(let i = 0; i < nPackets; i++)
    packets.push(parsePacket())
  return packets
}

function parsePacket() {
  // console.log(s)
  const version = parseInt(s.slice(0,3), 2)
  const type = parseInt(s.slice(3,6), 2)
  // console.log("v",version,"t",type)
  s = s.slice(6)
  if(type == 4) return parseLiteral()
  else {
    let subPackets = []
    const lengthType = s[0]
    if(lengthType == '0') {
      const bitLength = parseInt(s.slice(1,16), 2)
      s = s.slice(16)
      //console.log('(subpackets: ',bitLength,'bits)')
      subPackets = parseSubpacketsBits(bitLength)
    } else {
      const nSubpackets = parseInt(s.slice(1,12), 2)
      s = s.slice(12)
      //console.log('(subpackets: ',nSubpackets,'subpackets)')
      subPackets = parseSubpacketsNum(nSubpackets)
    }

    if(type == 0) return _.sum(subPackets)
    if(type == 1) return _.reduce(subPackets, (res, val, idx) => res*val)
    if(type == 2) return _.min(subPackets)
    if(type == 3) return _.max(subPackets)
    if(type == 5) return subPackets[0] > subPackets[1] ? 1 : 0
    if(type == 6) return subPackets[0] < subPackets[1] ? 1 : 0
    if(type == 7) return subPackets[0] == subPackets[1] ? 1 : 0
      
  }
}

console.log(
  parsePacket()
)