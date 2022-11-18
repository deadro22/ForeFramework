const Compiler = require("../fore-compiler/compiler.base");

const source = `
import Fore from "../fore/core";

let profilef = "smth"
let doSmth = ()=>{
     return ff;
}

###

<div>
     <Dude test={tt ? "hey" : tt}/>
</div>
`;

try {
  const compiler = new Compiler();
  const output = compiler.compile(source);
  console.log(output);
} catch (err) {
  throw err;
}
