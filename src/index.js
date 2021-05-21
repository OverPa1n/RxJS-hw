import {from, fromEvent, of,} from "rxjs";
import {debounceTime, filter, map, mergeMap, reduce, tap, combineLatestWith,} from "rxjs/operators";

/* Task 1  **/
// Data Source
const dataSource = [3, 1, '939', null, 3, { numb: 3 }, undefined, 'number'];

const source$ = from(dataSource)

// create variable result$ that sums all numbers in array
// extend with pipe operators, so that you will get expected result
// for example for array [1, 'a', 4, null, '8']
// you should get 1 + 4 + 8 = 13

// const result$ = source$.pipe()
// result$.subscribe((value) => console.log(value))
// expected result: 3 + 1 + 939 + 3 = 946

const result$ = source$.pipe(
    filter(data => {
        if(!isNaN(data)) return data
    }),
    map(element => parseInt(element)),
    reduce((acc, value) => acc + value)
)

result$.subscribe(value => console.log(value))

/* Task 2 **/
// Data Source
// const fetchUsers = {
//     users: MOCK_USERS
// };
const testUsers = {
    users: ['andriy', 'Alex', 'Columbus', 'colya', 'Nazar', 'afonya','Anton','Igor','Canvas']

};
const fetchData$ = of(testUsers);

// lets imagine that it is some kind of http call
// that returns us some users

// you should create variable countUsers$
// it will return us number of users which name starts with 'a' or 'A' or 'c' or 'C'

const countUsers$ = fetchData$.pipe(
    mergeMap(e => e.users),
    map(e => e.toString().toLowerCase()),
    filter(e => e.charAt(0) === 'a' || e.charAt(0) === 'c')

)

countUsers$.subscribe((numberOfUsers) => console.log(getNumOfUsers(numberOfUsers)))

function getNumOfUsers(e) {
    let arr = [];
    arr.push(e)
    return arr.length
}

/* Task 3 **/
// const cars$ = from(MOCK_CARS);

// lets imagine that you have web application that sells cars
// some user want to buy a car which price is less than 22000 (if its price is 22000 - it is ok for user)
// and not older than 4 years old (if its age is 4 - it is ok for user)
// so we need to filter all cars that are older or more expensive
// and also you should return cars as string
// '#model - #age: #price $'
// for example
// {
//   "age": 14,
//   "model": "Oldsmobile",
//   "price": 32966
// }

//less than 22000 and not older than 4 years. 22000 - its ok and 4 years - its ok
//need return - '#model - #age: #price $'(as string)

let cars = [
    {age:4, model: 'Renault', price: 22000},
    {age:4, model: 'Suzuki', price: 23000},
    {age:6, model: 'Audi', price: 28000},
    {age:3, model: 'BMW', price: 16000},
    {age:10, model: 'Opel', price: 13000},
    {age:2, model: 'Tesla', price: 19999}
]
const cars$ = from(cars);

// this car you should return as 'Oldsmobile - 14: 32966 $'

const filteredCars$ = cars$.pipe(
    filter(e => e.age <= 4 && e.price <= 22000),
    map(e => `${e.model} - ${e.age}: ${e.price} $`),
)
filteredCars$.subscribe((car) => console.log(car))

/* Task 4 **/
// Last one will be easy

// const valueAEl = document.getElementById('valueA');
// const valueBEl = document.getElementById('valueB');
// fromEvent(valueAEl, 'input')
// fromEvent(valueBEl, 'input')

// you need to calculate sum of values from both inputs
// only if they are both numbers and both are present

// const sum$ = ...

// Tip: look for operators that somehow merge or combine streams

const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const output = document.getElementById('output');

const stream1$ = fromEvent(input1, 'input').pipe(
    map(input => input.target.value),
    filter(value => {
        if(!input1.value.length <= 0) {
            if(isNumber(value) === true){
                return value
            }else {
                onFailVerification(input1)
            }
        }
    }),
)

const stream2$ = fromEvent(input2, 'input').pipe(
    map(input => input.target.value),
    filter(value => {
        if(!input2.value.length <= 0) {
            if(isNumber(value) === true){
                return value
            }else {
                onFailVerification(input2)
            }
        }
    }),
)

const sum$ = stream1$.pipe(
    combineLatestWith(stream2$),
    tap(e => console.log('before',e)),
    map(([val1,val2]) => +val1 + +val2),
    tap(e => console.log('after',e)),
    debounceTime(500)
)

sum$.subscribe(e => output.textContent = e)

//check on number, space etc
function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n) }

//send some msg in console when: ' ' or 'a-Z'
function onFailVerification(input) {
    console.log('type number')
    input.value = ''
    output.textContent = '0'
}



