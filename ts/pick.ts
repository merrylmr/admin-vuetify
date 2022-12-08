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


type TupleToObject<T extends readonly (number | string | symbol)[]> = {
    [P in T[number]]: P
}


type First<T extends any[]> = T['length'] extends 0 ? never : T[0]

//1 TS判断条件使用extend
// type First<T extends readonly any[]> =T extends [] ?never: T[0]

//2 获取tuple的length属性
// type First<T extends readonly any[]> =T['length'] extends 0 ?never: T[0]

//3 extends union 判断规则
// type First<T extends readonly any[]> =T[0] extends T[number] ? T[0] : never


function fail(msg: string): never {
    throw new Error(msg);
}
