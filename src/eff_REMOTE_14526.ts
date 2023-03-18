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

function* effect<TResult, TEffect extends Effect<TResult>>(effect: TEffect): Generator<TEffect, TResult, any> {
    return yield effect;
} 

function log(msg: string): Generator<Log, void> {
    return effect({ type: "log", msg: msg });
}

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



const iter = guessGame();
run(iter).then(x => console.log(x));





