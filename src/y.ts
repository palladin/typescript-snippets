module Snippet6 {

    type Func<T, R> = (_: T) => R
    type FactType = Func<number, number>

    const factorial: (_: FactType) => FactType  = fact => n => {
        if(n === 0)
            return 1
        else {
            return n * fact(n - 1)
        }
    }

    const Y: <T, R>(_: (_: Func<T, R>) => Func<T, R>) => Func<T, R> = f => {
        const omega = (o: any) => (n: any) => f(o(o))(n)
        return omega(omega)
    }

    const log: <T, R>(_: Func<T, R>) => Func<T, R>  = f => n => {
        console.log("arg " + n)
        let result = f(n)
        console.log("result " + result)
        return result
    }

    const comp: <T, U, R>(_: Func<U, R>) => (_: Func<T, U>) => Func<T, R> = 
        f => g => x => f(g(x))

    const f = comp<FactType, FactType, FactType>(log)(factorial)

    console.log(Y(f)(5))

}

