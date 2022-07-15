module Snippet5 {

    type Cont<T, R> = (k: (x: T) => R) => R
    type ContMonad<T, R> = 
        { 
            value: Cont<T, R>, 
            then: <U>(f: (x: T) => ContMonad<U, R>) => ContMonad<U, R>
        }


    function begin<T, R>(cont: Cont<T, R>): ContMonad<T, R> {

        const pure: <T, R>(x: T) => Cont<T, R> = x => k => k(x)
        const bind: <T, U, R>(m: Cont<T, R>) => (f: (x: T) => Cont<U, R>) => Cont<U, R> = 
            m => f => k => m(x => f(x)(k))

        return {
            value: cont,
            then: <U>(f: (x: T) => ContMonad<U, R>) => begin<U, R>(bind<T, U, R>(cont)(x => f(x).value))
        }
    }

    function delay<T>(v: T, d: number): ContMonad<T, void> {
        return begin(k => setTimeout(() => k(v), d))
    }

    delay(41, 5000).then(x => delay(x + 1, 5000)).value(x => console.log(x))
}