import fs from 'fs'
import _ from 'lodash'  

const input = fs.readFileSync('input.txt').toString()

const links = input.split("\n").map(link => {
  const [start,end] = link.trim().split("-")
  return {start,end}
})

console.log(links)

function swim(path) {
  console.log("SWIM",path)
  const currentRoom = _.last(path)

  if(currentRoom == 'end') {
    console.log("  * ", path.join(","))
    return [path.join(",")]
  }

  const doors = _.filter(links, l => l.start==currentRoom || l.end==currentRoom)
  //console.log("doors:",doors)

  const paths = 
    _.compact(
      doors.map(door => {
        const next = door.start == currentRoom ? door.end : door.start
        console.log(">>", path.join(",")," -> ", next)
        const newPath = _.clone(path)
        if(next == next.toLowerCase()) { // small cave, or start/end
          if(newPath.includes(next)) {
            return null
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
console.log(allPaths)
console.log(allPaths.length)