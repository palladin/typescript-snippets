namespace Snippet1 {

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

  type NotEval<T> = T extends "0" ? "1" : "0"
  type OrEval<TLeft, TRight> = "1" extends TLeft | TRight ? "1" : "0" 
  type AndEval<TLeft, TRight> = "0" extends TLeft | TRight ? "0" : "1"

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


  type Test = Eval<And<Var<"x">, Not<Var<"y">>>, {"x" : "1"; "y": "0"}>
}