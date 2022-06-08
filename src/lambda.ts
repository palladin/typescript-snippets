namespace Snippet3 {

    interface Term { sort: "term" }
    interface Var<T extends string> extends Term { type: "var" }
    interface Lambda<TVar extends string, TBody extends Term> extends Term { type: "lambda" }
    interface App<TLeft extends Term, TRight extends Term> extends Term { type: "app" }


    type Parse<T extends string> = 
        T extends `(lambda (${infer TVar}) ${infer TBody})` ? 
            Lambda<TVar, Parse<TBody>>
        : T extends `(${infer TLeft} ${infer TRight})` ? 
            App<Parse<TLeft>, Parse<TRight>>
        : T extends string ?
            Var<T>
        : never


    type Print<T extends Term> = 
        T extends Lambda<infer TVar, infer TBody> ?
            `(lambda (${TVar}) ${Print<TBody>})`
        : T extends App<infer TLeft, infer TRight> ?
            `(${Print<TLeft>} ${Print<TRight>})`
        : T extends Var<infer TVar> ?
            TVar
        : never

    type Tree = Parse<"(lambda (x) (x x))">

    type Result = Print<Tree>
}

