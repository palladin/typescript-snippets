namespace Snippet2 {

    interface BoolExpr { sort: "expr" }
    interface Var<T extends string> extends BoolExpr { type: "var" }
    interface And<TLeft extends BoolExpr, TRight extends BoolExpr> extends BoolExpr { type: "and" }
    interface Or<TLeft extends BoolExpr, TRight extends BoolExpr> extends BoolExpr { type: "or" }
    interface Not<T extends BoolExpr> extends BoolExpr { type: "not" }
  
    type CollectVars<TExpr extends BoolExpr> = 
      TExpr extends And<infer TLeft, infer TRight> ? CollectVars<TLeft> | CollectVars<TRight>
      : TExpr extends Or<infer TLeft, infer TRight> ? CollectVars<TLeft> | CollectVars<TRight>
      : TExpr extends Not<infer TExpr> ? CollectVars<TExpr>
      : TExpr extends Var<infer TVar> ? TVar
      : never
  
    type NotEval<T> = T extends never ? never : T extends "0" ? "1" : "0"
    type OrEval<TLeft, TRight> = TLeft extends never ? never : TRight extends never ? never : "1" extends TLeft | TRight ? "1" : "0" 
    type AndEval<TLeft, TRight> = TLeft extends never ? never : TRight extends never ? never : "0" extends TLeft | TRight ? "0" : "1"
  
    type Eval_<TExpr extends BoolExpr, TLookup> = 
        TExpr extends And<infer TLeft, infer TRight> ? AndEval<Eval_<TLeft, TLookup>, Eval_<TRight, TLookup>>
        : TExpr extends Or<infer TLeft, infer TRight> ? OrEval<Eval_<TLeft, TLookup>, Eval_<TRight, TLookup>>
        : TExpr extends Not<infer TExpr> ? NotEval<Eval_<TExpr, TLookup>>
        : TExpr extends Var<infer TVar> ? TLookup extends { [P in CollectVars<TExpr>]: "0" | "1" } ? 
                                            TVar extends CollectVars<TExpr> ? TLookup[TVar] 
                                            : never 
                                          : never
        : never
  
    type Eval<TExpr extends BoolExpr, TLookup extends { [P in CollectVars<TExpr>]: "0" | "1" }> = Eval_<TExpr, TLookup>

    type Append<T, TArray> = TArray extends [infer TCurrent,  ...infer Rest] ? 
        TCurrent extends any[] ? [[T, ...TCurrent], ...Append<T, Rest>] : never : [] 

    type AllCombinations<TArray extends string[]> = 
        TArray extends [infer TCurrent, ...infer TRest] ? 
            TRest extends string[] ? [...Append<[TCurrent, "0"], AllCombinations<TRest>>, ...Append<[TCurrent, "1"], AllCombinations<TRest>>] : never
        : [[]]

    type CreateLookup<TArray extends [string, string][]> = 
        TArray extends [[infer TVar, infer TVal], ...infer TRest] ? 
            TVar extends string ? 
                TRest extends [string, string][] ? { [P in TVar]: TVal } & CreateLookup<TRest> : never
            : never
        : unknown

    type Evals<TExpr extends BoolExpr, TArray extends [string, string][][]> = 
        TArray extends [infer TCurrent,  ...infer TRest] ? 
            TCurrent extends [string, string][] ? 
                TRest extends [string, string][][] ? 
                    CreateLookup<TCurrent> extends infer TLookup ? 
                        Eval_<TExpr, TLookup> extends "1" ? [["1", TLookup], ...Evals<TExpr, TRest>] : Evals<TExpr, TRest>
                    : never 
                : never
            : never
        : []

    type MapVarsToLookup<TVars> = (TVars extends string ? ((x: [{ [P in TVars]: "0" | "1" }]) => void) : never) extends ((x: infer R) => void) ? R : never
    type LastVar<TLookup> = TLookup extends [infer T] ? T : never
    type MapVarsToTuple<TVars> = 
        [TVars] extends [never] ? [] : 
            LastVar<MapVarsToLookup<TVars>> extends infer TVar ? 
                [keyof TVar, ...MapVarsToTuple<Exclude<TVars, TVar>>] 
            : never

    type fsfdfsdfsfds = Evals<And<Var<"x">, Not<Var<"y">>>, AllCombinations<["x", "y"]>>

    type fsdfdsf = MapVarsToLookup<CollectVars<And<Var<"x">, Not<Var<"y">>>>>
   
    type sfsfsdfs = MapVarsToTuple<"x" | "y"> //LastVar<MapVarsToLookup<"x" | "y">>

}

