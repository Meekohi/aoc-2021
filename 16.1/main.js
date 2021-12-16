import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

let s = input.split('').map(hex => parseInt(hex, 16).toString(2).padStart(4,'0')).join('')
let versionCounter = 0

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
  console.log("literal", parseInt(binaryString, 2))
  return parseInt(binaryString, 2)
}

function parseSubpacketsBits(bitLength) {
  console.log("parseSubpacketsBits...")
  const remainder = s.slice(bitLength)
  s = s.slice(0,bitLength)
  while(s.length)
    parsePacket()
  s = remainder
}

function parseSubpacketsNum(nPackets) {
  console.log("parseSubpacketsNum...")
  for(let i = 0; i < nPackets; i++)
    parsePacket()
}

function parsePacket() {
  // console.log(s)
  const version = parseInt(s.slice(0,3), 2)
  const type = parseInt(s.slice(3,6), 2)
  console.log("v",version,"t",type)
  versionCounter += version
  s = s.slice(6)
  if(type == 4) parseLiteral()
  else {
    const lengthType = s[0]
    if(lengthType == '0') {
      const bitLength = parseInt(s.slice(1,16), 2)
      s = s.slice(16)
      console.log('(subpackets: ',bitLength,'bits)')
      parseSubpacketsBits(bitLength)
    } else {
      const nSubpackets = parseInt(s.slice(1,12), 2)
      s = s.slice(12)
      console.log('(subpackets: ',nSubpackets,'subpackets)')
      parseSubpacketsNum(nSubpackets)
    }
      
  }
}

parsePacket()
console.log(versionCounter)