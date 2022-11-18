const Interpreter = require("./Interpreter/Interpreter");
const Lexer = require("./Lexer/Lexer");
const Parser = require("./Parser/Parser");
const { HTMLTokenType } = require("./Lexer/Tokens");

module.exports = class Compiler {
  ast = {};
  compile(source = "") {
    const $elm = source.match(/<element>[^]*<\/element>/g);
    if ($elm) {
      const element = $elm[0];

      const el = element.substring(9, element.indexOf("</element>"));

      const lexer = new Lexer(el);
      const htmlTokensGenerator = lexer.generateTokens();

      const parser = new Parser([...htmlTokensGenerator]);
      const parseOutput = parser.parse();
      this.ast = parseOutput;

      const interp = new Interpreter();
      const output = interp.visit(parseOutput);
      const cmp =
        source.substring(0, source.indexOf("<element>")) +
        `()=>${output}` +
        source.substring(source.indexOf("</element>") + 10);

      return { cmp, output, compiled: true };
    } else {
      return { compiled: false };
    }
  }
};
