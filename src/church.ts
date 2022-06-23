
type Church = <T>(f: (x: T) => T) => (x: T) => T

const toNum: (n: Church) => number = n => n<number>(x => 1 + x)(0)

const zero: Church = f => x => x
const succ : (n: Church) => Church = n => f => x => f(n(f)(x))

const one = succ(zero)
const two = succ(one)
const three = succ(two) 

console.log(toNum(three))