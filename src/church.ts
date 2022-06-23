
type Church = <T>(f: (x: T) => T) => (x: T) => T

const toNum: (n: Church) => number = n => n<number>(x => 1 + x)(0)

const zero: Church = f => x => x
const succ : (n: Church) => Church = n => f => x => f(n(f)(x))
const add: (m: Church) => (n: Church) => Church = m => n => f => x => m(f)(n(f)(x))
const mult: (m: Church) => (n: Church) => Church = m => n => f => x => m(n(f))(x)
const exp: (m: Church) => (n: Church) => Church = m => n => n(m)

const one = succ(zero)
const two = succ(one)
const three = succ(two) 

console.log(toNum(add(three)(two)))
console.log(toNum(mult(three)(two)))
console.log(toNum(exp(three)(two)))