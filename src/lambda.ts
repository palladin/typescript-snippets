
type Term = 
    | { type: "var"; var: string }
    | { type: "lambda"; var: string; body: Term }
    | { type: "app"; left: Term; right: Term }

type Test<T extends string> = 
    T extends `(lambda (${infer TVar}) ${infer TBody})` ? 
        { type: "lambda", var: TVar, body: Test<TBody> } 
    : T extends `(${infer TLeft} ${infer TRight})` ? 
        { type: "app", left: Test<TLeft>, right: Test<TRight> }
    : T extends string ?
        { type: "var", var: T }
    : never


type Tests<T extends Term> = T extends { type: "lambda"; var: infer TVar; body: infer TBody } ? [TVar, TBody] : T 

type fsfddsf = Test<"(lambda (x) (x x))">

type fsfdsf = Tests<fsfddsf>


