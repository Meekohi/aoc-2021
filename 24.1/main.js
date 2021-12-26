
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

for(let a = 9; a > 0; a--)
for(let b = 9; b > 0; b--)
for(let c = 9; c > 0; c--)
for(let d = 9; d > 0; d--)
for(let e = 9; e > 0; e--)
for(let f = 9; f > 0; f--)
for(let g = 9; g > 0; g--)
for(let h = 9; h > 0; h--)
for(let i = 9; i > 0; i--)
  func([a,b,c,d,e,f,g,h,i,9,9,9,9,9])

