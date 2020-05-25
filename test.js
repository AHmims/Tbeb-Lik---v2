const _DB = require('./model/dbOperations');
// 
test();
// 
async function test() {
    let res = await _DB.consultationCheck('BH82901');
    console.log(res);
}