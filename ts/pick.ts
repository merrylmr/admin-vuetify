// keyof in
// jianshu.com/p/0543bd031166
interface Point {
    x: number;
    y: number;
}

// type keys="x"|"y"
type keys = keyof Point;


function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]
}


// in

type Keys = "a" | "b"

type Obj = {
    [p in Keys]: any
}

type Partial<T> = { [p in keyof T]?: T[p] }

type Required<T> = {
    [P in keyof T]-?: T[P];
}

type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}

type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
}
interface User {
    id: number,
    age: number,
    name: string
}

type ParticalUser = Partial<User>

type typeUser = Pick<User, "id" | "age">


type TupleToObject<T extends readonly (number| string| symbol)[]> = {
    [P in  T[number]]: P
}
