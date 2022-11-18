const Compiler = require("../fore-compiler/compiler.base");
const path = require("path");

module.exports = async function (source) {
  try {
    const compiler = new Compiler();
    const output = compiler.compile(source);
    if (output.compiled) {
      return output.cmp.replace(
        "export default {",
        `export default{file:'${path.extname(
          this.resourcePath
        )}',\ncomp:function(props){return ${output.output}},\n`
      );
    } else {
      return source;
    }
  } catch (err) {
    throw err;
  }
};
