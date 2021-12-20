import fs from 'fs'
import _ from 'lodash'

const input = fs.readFileSync('input.txt').toString()

const scanners = input.split("\n\n").map(row => row.split("\n")).map(s => s.slice(1).map(coords => {
  const x3 = coords.split(",").map(Number)
  return {
    x: x3[0],
    y: x3[1],
    z: x3[2]
  }
}))
// console.log(scanners)

const distances = scanners.map(scanner => scanner.map(coord1 => {
  return scanner.map(coord2 => {
    return Math.round(100*Math.abs(coord1.x-coord2.x) + 100*Math.abs(coord1.y-coord2.y) + 100*Math.abs(coord1.z-coord2.z))
  })
}))


const happyScanners = [0]

function findHappyScanner(i,j){
  const A = []
  const B = []

  for(let s = 0; s < distances[i].length; s++) {
    for(let t = 0; t < distances[j].length; t++) {
      const iDists = distances[i][s]
      const jDists = distances[j][t]

      const matchingDistances = _.intersection(iDists,jDists)
      // console.log(`${i} x ${j} -> ${matchingDistances.length}`)
      const isMatch = matchingDistances.length > 11
      if(!isMatch) continue

      // console.log("matched",matchingDistances.length,":")
      // console.log("scanner",i,"beacon",s)
      // console.log("scanner",j,"beacon",t)

      A.push(scanners[i][s])
      B.push(scanners[j][t])
    }
  }

  // console.log("A is size:",A.length)
  if(A.length < 3) return false

  // Try to solve:
  console.log(`Try to solve for ${i}->${j}`)
  //console.log(A)
  //console.log(B)

  function flipper(Q, type) {
    return Q.map(p => {
      switch(type) {
        case 0:
          return {x:p.x, y:p.y, z:p.z}
        case 1:
          return {x:p.x, y:p.z, z:p.y}
        case 2:
          return {x:p.y, y:p.x, z:p.z}
        case 3:
          return {x:p.z, y:p.x, z:p.y}
        case 4:
          return {x:p.y, y:p.z, z:p.x}
        case 5:
          return {x:p.z, y:p.y, z:p.x}
      }
    })
  }

  function flopper(Q, type) {
    return Q.map(p => {
      switch(type) {
        case 0:
          return {x:p.x, y:p.y, z:p.z}
        case 1:
          return {x:p.x, y:p.y, z:-p.z}
        case 2:
          return {x:p.x, y:-p.y, z:p.z}
        case 3:
          return {x:p.x, y:-p.y, z:-p.z}
        case 4:
          return {x:-p.x, y:p.y, z:p.z}
        case 5:
          return {x:-p.x, y:p.y, z:-p.z}
        case 6:
           return {x:-p.x, y:-p.y, z:p.z}
        case 7:
          return {x:-p.x, y:-p.y, z:-p.z}
      }
    })
  }

  function centroid(Q) {
    return Q.reduce( (result, point) => ({
      x: result.x + point.x / Q.length,
      y: result.y + point.y / Q.length,
      z: result.z + point.z / Q.length
    }), {x:0, y:0, z:0})
  }

  function center(Q) {
    const avg = centroid(Q)

    return Q.map(p => ({
      x: p.x - avg.x,
      y: p.y - avg.y,
      z: p.z - avg.z
    }))
  }
  
  function floppinator(Q, R) {
    for(let flippy = 0; flippy < 6; flippy++) {
      for(let floppy = 0; floppy < 8; floppy++) {
        const Ap = center(flopper(flipper(Q,flippy),floppy))
        const Bp = center(R)
        const diff = _.reduce(Ap, (result, ap, idx) => {
          // ap == Ap[idx], just easier to read this way
          return result +
            (Ap[idx].x - Bp[idx].x) * (Ap[idx].x - Bp[idx].x) + 
            (Ap[idx].y - Bp[idx].y) * (Ap[idx].y - Bp[idx].y) + 
            (Ap[idx].z - Bp[idx].z) * (Ap[idx].z - Bp[idx].z)
        },0)
  
        if(diff < 1.0) {
          return [flippy, floppy]
        }
      }
    }
    throw ("fail whale")
  }

  let [flippy,floppy] = floppinator(A, B)

  const avgA = centroid(flopper(flipper(A,flippy),floppy))
  const avgB = centroid(B)
  const translation = {
    x: avgB.x-avgA.x,
    y: avgB.y-avgA.y,
    z: avgB.z-avgA.z,
  }

  // Remember, j is the "already good" index
  // i need to be unfucked
  scanners[i] = flopper(flipper(scanners[i],flippy),floppy)
  for(let s = 0; s < scanners[i].length; s++) {
    scanners[i][s] = {
      x : Math.round(scanners[i][s].x + translation.x),
      y : Math.round(scanners[i][s].y + translation.y),
      z : Math.round(scanners[i][s].z + translation.z),
    }
  }

  return true
}

while(happyScanners.length < scanners.length) {
//for(let N = 0; N < 3; N++) {
  console.log("AGAIN")
  let restart = false
  for(let i = 0; i < scanners.length; i++) {
    if(happyScanners.includes(i)) continue;
    if(restart) break;

    const nextScanner = scanners[i]
    // Try to match this nextScanner to one of the existing scanners in the happy set

    for(let happyIdx = 0; happyIdx < happyScanners.length; happyIdx++) {
      const j = happyScanners[happyIdx]
      const prevScanner = scanners[j]

      if(i==j) continue

      // ~~~~~~~~
      // Seeing if i,j is a match... check each beacon to see if there is a match in the other distances set
      console.log("Trying to match cubes",i,j)
      const foundMatch = findHappyScanner(i,j)
      if(foundMatch) {
        console.log("OK!")
        happyScanners.push(i)
        console.log(happyScanners)
        restart = true
        break
      }
    }
  }

}

console.log("Done?")
// console.log(scanners)
const beacons = _.uniqBy(_.flatten(scanners), p => `${p.x},${p.y},${p.z}`)
console.log(beacons.length)