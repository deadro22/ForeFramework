const { HTMLTokenType } = require("../Lexer/Tokens");
const { JSExpressionAttribute, RegularAttribute } = require("./Attributes");
const {
  ForeElement,
  StringLiteral,
  ForeOpeningElement,
  ForeClosingElement,
  JSScript,
  ForeElementModifier,
} = require("./Nodes");

module.exports = class Parser {
  constructor(tokens = []) {
    this.tokens = tokens[Symbol.iterator]();
    this.advance();
  }

  advance() {
    this.current_token = this.tokens.next().value;

    if (!this.current_token) {
      this.current_token = null;
    }
  }

  parse() {
    if (this.current_token === null) return null;

    const result = this._fromExpression();

    //if (this.current_token !== null) throw new Error("Invalid Syntax");

    return result;
  }

  _fromExpression() {
    let res = new ForeElement(
      new ForeOpeningElement(this.current_token.value),
      null
    );

    let openingElem = res.opening;

    this.advance();

    while (
      this.current_token !== null &&
      this.current_token.type !== HTMLTokenType.Elems.C_ELEM &&
      this.current_token.type !== HTMLTokenType.Elems.SC_ELEM
    ) {
      switch (true) {
        case this.current_token.type === HTMLTokenType.Elems.O_ELEM:
          openingElem.children.push(this._fromExpression());
          this.advance();
          break;

        case this.current_token.type === HTMLTokenType.Syntax.STRING:
          openingElem.children.push(
            new StringLiteral(this.current_token.value)
          );
          this.advance();
          break;

        case Object.keys(HTMLTokenType.Modifiers).includes(
          this.current_token.type
        ):
          const tok = this.current_token.value;
          this.advance();
          openingElem.props.push(
            new ForeElementModifier(
              tok,
              new JSExpressionAttribute(this.current_token.value)
            )
          );
          this.advance();
          break;

        case this.current_token.type === HTMLTokenType.Syntax.JS_O:
          this.advance();
          openingElem.children.push(new JSScript(this.current_token.value));
          this.advance();
          break;

        case this.current_token.type === HTMLTokenType.Syntax.JS_C:
          this.advance();
          break;

        case Object.keys(HTMLTokenType.Attribute).includes(
          this.current_token.type.toUpperCase()
        ):
          this._pushAttribute(openingElem);
          break;

        default:
          const details = this.current_token.value
            ? this.current_token.value
            : this.current_token.type;
          throw new Error("Unexpected token " + details);
      }
    }

    if (this.current_token) {
      if (this.current_token.type === HTMLTokenType.Elems.SC_ELEM) {
        openingElem.selfClosing = true;
      } else {
        if (res.opening.name === this.current_token.value.substring(1)) {
          res.closing = new ForeClosingElement(
            this.current_token.value.substring(1)
          );
        } else {
          res.closing = null;
          res.opening.selfClosing = false;
        }
      }
    }

    if (res.closing === null && res.opening.selfClosing === false)
      throw new Error("No closing tag found for: " + res.opening.name);

    return res;
  }

  _pushAttribute(oe) {
    let attr = this.current_token.value;

    this.advance();

    if (this.current_token.type === HTMLTokenType.Syntax.ATTR_EQ) {
      this.advance();

      if (this.current_token.type === HTMLTokenType.Attribute.CUSTOM_AT)
        throw new Error("Unexpected token: " + this.current_token.value);

      if (this.current_token.type === HTMLTokenType.Syntax.JS_O) {
        this.advance();

        if (this.current_token.value === null)
          throw new Error("Emtpy Js attribute found: " + attr);
      }

      if (this.current_token.type === HTMLTokenType.Syntax.JS_C)
        throw new Error("Empty attribute found: " + attr);

      const n_atts = oe.attributes.push({
        [attr]:
          this.current_token.type === HTMLTokenType.Attribute.JS
            ? new JSExpressionAttribute(this.current_token.value)
            : new RegularAttribute(this.current_token.value),
      });

      this.advance();

      return n_atts;
    } else {
      throw new Error(
        "Unexpected token: " +
          attr +
          ", every attribute has to be set using an equal sign"
      );
    }
  }
};
