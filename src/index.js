import './assets/css/base.css'
import './assets/css/index.css'

function  xx(){
    return new Promise((resolve,reject)=>{
        resolve('xxx')
    })
}

let yy = await xx()
console.log(yy)
