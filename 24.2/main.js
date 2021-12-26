
function func(digits) {
  
  const magic = [15, 10, 2 , 16, 12 , 11, 5 , 16, 6 , 15 , 3  , 12, 10 , 13 ]
  const addX =  [15, 15, 12, 13, -12, 10, -9, 14, 13, -14, -11, -2, -16, -14]
  const divZ =  [1 , 1 , 1 , 1 , 26 , 1 , 26, 1 , 1 , 26 , 26 , 26, 26 , 26 ]
  let w=0, x=0, y=0, z=0

  for(let i = 0; i < magic.length; i++) {
    x = z % 26
    x += addX[i]
    z = Math.floor(z / divZ[i])
    
    // greedy search
    if(x > 0 && x < 10) {
      digits[i] = x
    }

    w = digits[i]

    if(x != w) {
      z *= 26
      z = z + w + magic[i]
    }
  }
  
  if(z == 0) {
    console.log(digits.join(''))
    throw "wow"
  }
  return
}

for(let a = 1; a < 10; a++)
for(let b = 1; b < 10; b++)
for(let c = 1; c < 10; c++)
for(let d = 1; d < 10; d++)
for(let e = 1; e < 10; e++)
for(let f = 1; f < 10; f++)
for(let g = 1; g < 10; g++)
for(let h = 1; h < 10; h++)
for(let i = 1; i < 10; i++)
  func([a,b,c,d,e,f,g,h,i,1,1,1,1,1])


// func("16115131806102".split('').map(Number))
