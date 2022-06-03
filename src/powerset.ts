type Append<T, TArray> = TArray extends [infer TCurrent,  ...infer Rest] ? 
                           TCurrent extends any[] ? [[T, ...TCurrent], ...Append<T, Rest>] : never
                         : [] 
                         
type PowerSet<TArray extends any[]> = 
    TArray extends [infer TCurrent,  ...infer Rest] ? [...Append<TCurrent, PowerSet<Rest>>, ...PowerSet<Rest>] : [[]]

type Test = PowerSet<[1, 2, 3]> // [[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]