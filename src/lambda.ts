namespace Snippet3 {

    interface Term { sort: "term" }
    interface Var<T extends string> extends Term { type: "var" }
    interface Lambda<TVar extends string, TBody extends Term> extends Term { type: "lambda" }
    interface App<TLeft extends Term, TRight extends Term> extends Term { type: "app" }

    type Print<T extends Term> = 
        T extends Lambda<infer TVar, infer TBody> ?
            `(lambda (${TVar}) ${Print<TBody>})`
        : T extends App<infer TLeft, infer TRight> ?
            `(${Print<TLeft>} ${Print<TRight>})`
        : T extends Var<infer TVar> ?
            TVar
        : never

    type Env = [string, Closure][]
    type Closure = [Term, Env]
    
    type Lookup<TVar extends string, TEnv extends Env> = 
        TEnv extends [[infer TCurrentVar, infer TClosure], ...infer TRest] ?
            TRest extends Env ?  
                TVar extends TCurrentVar ? TClosure : Lookup<TVar, TRest> 
            : never
        : never

    type Eval<T extends Term, TEnv extends Env = []> = 
        T extends Lambda<infer TVar, infer TBody> ?
            [Lambda<TVar, TBody>, TEnv]
        : T extends App<infer TLeft, infer TRight> ? 
            Eval<TLeft, TEnv> extends [Lambda<infer TVar, infer TBody>, infer TClosureEnv] ? 
                Eval<TRight, TEnv> extends infer TRightValue ? 
                    TClosureEnv extends Env ? 
                        TRightValue extends Closure ?
                            Eval<TBody, [[TVar, TRightValue], ...TClosureEnv]>
                        : `Error TRightValue ${string & TRightValue}`
                    : `Error TClosureEnv ${string & TClosureEnv}`
                : `Error infer TRightValue`
            : `Error Eval<TLeft, TEnv> ${Eval<TLeft, TEnv>}`
        : T extends Var<infer TVar> ?
           Lookup<TVar, TEnv>
        : `Error T: ${string & T}` 

    type Omega = Lambda<"x", App<Var<"x">, Var<"x">>> //"(lambda (x) (x x))"
    type I = Lambda<"x", Var<"x">> //"(lambda (x) x)"
    type K = Lambda<"x", Lambda<"y", Var<"x">>>  //"(lambda (x) (lambda (y) x))"
    type S = Lambda<"x", Lambda<"y", Lambda<"z", App<App<Var<"x">, Var<"z">>, App<Var<"y">, Var<"z">>>>>>

    type Test0 = Eval<App<Omega, I>>
    type Test1 = Eval<App<App<App<S, K>, K>, Omega>>
}

