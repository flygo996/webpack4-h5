import './scss/index.scss'
import obj from './js/index.js'

const fn = () => {
  console.log('My name is laifeipeng!')
  obj.speak()
}
fn()

let arr = Array.from({ length: 10 }, () => 5)
console.log(arr)
