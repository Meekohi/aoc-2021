import fs from 'fs'
import _ from 'lodash'  

const input = fs.readFileSync('input.txt').toString()

const links = input.split("\n").map(link => {
  const [start,end] = link.trim().split("-")
  return {start,end}
})

console.log(links)

function swim(path) {
  // console.log("SWIM",path)
  const currentRoom = _.last(path)

  if(currentRoom == 'end') {
    // console.log("  * ", path.join(","))
    return [path.join(",")]
  }

  const doors = _.filter(links, l => l.start==currentRoom || l.end==currentRoom)

  const DUPWARNING = '22222'

  const paths = 
    _.compact(
      doors.map(door => {
        const next = door.start == currentRoom ? door.end : door.start
        // console.log(">>", path.join(",")," -> ", next)
        const newPath = _.clone(path)
        if(next == next.toLowerCase()) {
          if(newPath.filter(room => room==next).length == 2) {
            return null
          }
          if(newPath.filter(room => room==next).length == 1) {
            if(next == 'start') return null

            if(newPath[0] == DUPWARNING) return null
            newPath.unshift(DUPWARNING)
          }
        }
        newPath.push(next)
        return swim(newPath)
      })
    )

  if(paths.length == 0)
    return null
  else
    return _.flatten(paths)
}

const allPaths = swim(['start'])
// console.log(allPaths)
console.log(allPaths.length)