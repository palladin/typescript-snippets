import readline  from "readline";


interface Effect<TResult> {
    type: string
}

interface Log extends Effect<void> {
    type: "log"
    msg: string
}

interface Rand extends Effect<number> {
    type: "rand"
    min: number
    max: number
}

interface Prompt extends Effect<string> {
    type: "prompt"
    msg: string
}

<<<<<<< HEAD
interface PromiseEffect extends Effect<unknown> {
    type: "promise"
    promise: Promise<unknown>
}

function* effect<TResult, TEffect extends Effect<TResult>>(effect: TEffect): Generator<TEffect, TResult, any> {
    return yield effect;
}

function log(msg: string): Generator<Log, void> {
    return effect({ type: "log", msg: msg });
}

=======
function* effect<TResult, TEffect extends Effect<TResult>>(effect: TEffect): Generator<TEffect, TResult, any> {
    return yield effect;
} 

function log(msg: string): Generator<Log, void> {
    return effect({ type: "log", msg: msg });
}

>>>>>>> b0dc7fdb3f8967d67f4403772088e35f197673dd
function rand(min: number, max: number): Generator<Rand, number>  {
    return effect({ type: "rand", min: min, max: max });
}

function prompt(msg: string): Generator<Prompt, string> {
    return effect({ type: "prompt", msg: msg });
}

function* guessGame(): Generator<Log | Rand | Prompt, void> {
    const secret = yield* rand(1, 100);
    for(let i = 1; i <= 10; i++) {
        const userInput = yield* prompt("Guess a number (1-100): ");
        const guess = parseInt(userInput);
        if (guess === secret) {
            yield* log("Congrats!!!");
            return;
        }
        else if (secret > guess) 
            yield* log("Secret is bigger!");
        else
            yield* log("Secret is smaller!");
    }
    yield* log(`GAME OVER - secret was ${secret}`);
}

function run(iter: Generator<Log | Rand | Prompt, void>) {
    const internalLogs: unknown[] = [];
    return new Promise((resolve, reject) => {
        const result = iter.next();
        function loop(result: IteratorResult<Log | Rand | Prompt, void>) {
            internalLogs.push(result.value);
            if (result.done)
                resolve({ result: result.value, logs: internalLogs });
            else {
                const effect = result.value;
                if (effect.type === "log") {
                    console.log(effect.msg);
                    loop(iter.next());
                }
                else if (effect.type === "rand") {
                    const randValue = Math.floor(Math.random() * effect.max) + effect.min;
                    loop(iter.next(randValue));
                }
                else if (effect.type === "prompt") {
                    const input = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                      
                    input.question(effect.msg,  (value) => {
                        input.close();
                        loop(iter.next(value));
                    });
                }
            }
        }
        loop(result);
    }); 

}

//const iter = guessGame();
//run(iter).then(x => console.log(x));



function* randHandler<TResult, TEffect extends Effect<TResult>>(iter: Generator<Rand | TEffect, void>): Generator<TEffect, void> {
    let result = iter.next();
    while (!result.done) {
        const effect = result.value;
        if (effect.type === "rand") {
            const randEffect = effect as Rand;
            const randValue = Math.floor(Math.random() * randEffect.max) + randEffect.min;
            result = iter.next(randValue);
        }
        else {
            const value = yield effect as TEffect;
            result = iter.next(value);
        }
    }
}

function* logHandler<TResult, TEffect extends Effect<TResult>>(iter: Generator<Log | TEffect, void>): Generator<TEffect, void> {
    let result = iter.next();
    while (!result.done) {
        const effect = result.value;
        if (effect.type === "log") {
            const logEffect = effect as Log;
            console.log(logEffect.msg);
            result = iter.next();
        }
        else {
            const value = yield effect as TEffect;
            result = iter.next(value);
        }
    }
}

function* promptHandler<TResult, TEffect extends Effect<TResult>>(iter: Generator<Prompt | TEffect, void>): Generator<PromiseEffect | TEffect, void> {

    let result = iter.next();
    while (!result.done) {
        const effect = result.value;
        if (effect.type === "prompt") {
            const promptEffect = effect as Prompt;
            function prompt(msg: string): Promise<string> {
                return new Promise((resolve, reject) => {
                    const input = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                        
                    input.question(msg,  (value) => {
                        input.close();         
                        resolve(value);
                    });
                });
            }
            const promise = prompt(promptEffect.msg);
            const value = yield { type: "promise", promise: promise } as PromiseEffect;
            result = iter.next(value);
        }
        else {
            const value = yield effect as TEffect;
            result = iter.next(value);
        }
    }
}

async function runHandler(iter: Generator<PromiseEffect, void>): Promise<void> {
    let result = iter.next();
    while (!result.done) {
        const effect = result.value;
        if (effect.type === "promise") {
            const value = await effect.promise;
            result = iter.next(value);
        }
        else
            throw new Error(`invalid effect ${effect.type}`);
    }
}


runHandler(logHandler(randHandler(promptHandler(guessGame()))));
