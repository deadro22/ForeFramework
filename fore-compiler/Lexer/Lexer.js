"use strict";

const { HTMLToken, HTMLTokenType } = require("./Tokens.js");

const WHITESPACE = " \n\t\r";
const ALLOWED_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]";

class Lexer {
  constructor(source = "") {
    this.source = source[Symbol.iterator]();
    this.advance();

    /* This property is responsible for checking whether or not we are inside (making the content)
       of any html element, helpful when combining data and strings. Whitespaces don't count anymore
       if this is true 
    */
    this.isInElmConent = false;
  }

  advance() {
    this.current_char = this.source.next().value;

    if (!this.current_char) {
      this.current_char = null;
    }
  }

  *generateTokens() {
    let isMakingElem = true;
    while (this.current_char !== null) {
      switch (true) {
        case WHITESPACE.includes(this.current_char):
          if (this.isInElmConent) {
            yield new HTMLToken(HTMLTokenType.Syntax.STRING, " ");
            this.advance();
          } else {
            this.advance();
          }
          break;

        case this.current_char === HTMLTokenType.Syntax.OPENING:
          isMakingElem = true;
          this.advance();
          yield this._makeHtmlElement();
          break;

        case this.current_char === HTMLTokenType.Syntax.CLOSING:
          isMakingElem = false;
          this.advance();
          break;

        case this.current_char === HTMLTokenType.Syntax.MODF_O && isMakingElem:
          this.advance();
          yield this._makeModifierExpression();
          break;

        case this.current_char === HTMLTokenType.Syntax.MODF_C && isMakingElem:
          this.advance();
          break;

        case this.current_char === HTMLTokenType.Syntax.ENDING:
          if (isMakingElem) {
            yield new HTMLToken(HTMLTokenType.Elems.SC_ELEM, null);
          }
          this.advance();
          break;

        case ALLOWED_CHARACTERS.toLowerCase().includes(
          this.current_char.toLowerCase()
        ):
          if (isMakingElem) {
            yield this._makeHtmlAttribute();
          } else {
            yield this._makeHtmlChildString();
          }
          break;

        case this.current_char === HTMLTokenType.Syntax.ATTR_EQ:
          this.advance();
          yield new HTMLToken(HTMLTokenType.Syntax.ATTR_EQ, null);
          break;

        case this.current_char === HTMLTokenType.Syntax.JS_O:
          this.advance();
          yield new HTMLToken(HTMLTokenType.Syntax.JS_O, null);
          yield this._makeJsBlockCode();
          break;

        case this.current_char === HTMLTokenType.Syntax.JS_C:
          this.advance();
          yield new HTMLToken(HTMLTokenType.Syntax.JS_C, null);
          break;

        case this.current_char === HTMLTokenType.Syntax.MODF_ARG:
          this.advance();
          yield this._makeModifierArgs();
          break;

        case this.current_char === "'" || this.current_char === '"':
          this.advance();
          yield this._makeHtmlAttributeString();
          break;

        default:
          throw new Error(
            "Illegal Character " + JSON.stringify({ cause: this.current_char })
          );
      }
    }
  }

  _makeHtmlAttributeString() {
    let attr_str = this.current_char;
    this.advance();

    while (
      this.current_char !== null &&
      this.current_char !== "'" &&
      this.current_char !== '"'
    ) {
      attr_str += this.current_char;
      this.advance();
    }
    this.advance();
    return new HTMLToken(HTMLTokenType.Syntax.STRING, attr_str);
  }

  _makeJsBlockCode() {
    let jsCode = this.current_char;

    if (this.current_char === HTMLTokenType.Syntax.JS_C)
      return new HTMLToken(HTMLTokenType.Attribute.JS, null);

    this.advance();

    while (this.current_char !== null && this.current_char !== "}") {
      jsCode += this.current_char;
      this.advance();
    }

    return new HTMLToken(
      HTMLTokenType.Attribute.JS,
      jsCode.trim().replace(/\n/g, ";")
    );
  }

  _makeHtmlAttribute() {
    let elem_attr = this.current_char;
    this.advance();

    while (
      this.current_char !== null &&
      this.current_char !== HTMLTokenType.Syntax.CLOSING &&
      this.current_char !== HTMLTokenType.Syntax.ENDING &&
      !WHITESPACE.includes(this.current_char) &&
      this.current_char !== "="
    ) {
      elem_attr += this.current_char;
      this.advance();
    }

    return new HTMLToken(
      HTMLTokenType.Attribute[elem_attr.toUpperCase()] ||
        HTMLTokenType.Attribute.CUSTOM_AT,
      elem_attr
    );
  }

  _makeHtmlChildString() {
    let child_str = this.current_char;
    this.advance();

    while (
      this.current_char !== null &&
      this.current_char !== HTMLTokenType.Syntax.CLOSING &&
      this.current_char !== HTMLTokenType.Syntax.ENDING &&
      this.current_char !== HTMLTokenType.Syntax.OPENING &&
      this.current_char !== HTMLTokenType.Syntax.JS_O
    ) {
      child_str += this.current_char;
      this.advance();
    }
    return new HTMLToken(HTMLTokenType.Syntax.STRING, child_str);
  }

  _makeModifierExpression() {
    let each_modf_str = this.current_char;

    this.advance();

    while (
      this.current_char !== null &&
      HTMLTokenType.Modifiers[each_modf_str.toUpperCase() + "_EXP"] !== null &&
      this.current_char !== HTMLTokenType.Syntax.MODF_ARG
    ) {
      each_modf_str += this.current_char;

      this.advance();
    }

    const finalModfExp = each_modf_str.toUpperCase() + "_EXP";

    return new HTMLToken(finalModfExp, HTMLTokenType.Modifiers[finalModfExp]);
  }

  _makeHtmlElement() {
    let elem_str = this.current_char;

    if (this.current_char === HTMLTokenType.Syntax.OPENING) return;

    this.advance();

    while (
      this.current_char !== null &&
      this.current_char !== HTMLTokenType.Syntax.CLOSING &&
      this.current_char !== HTMLTokenType.Syntax.ENDING &&
      !WHITESPACE.includes(this.current_char)
    ) {
      elem_str += this.current_char;
      this.advance();
    }

    //this.advance();

    this.isInElmConent = !(elem_str[0] === "/");
    return new HTMLToken(
      elem_str[0] === "/"
        ? HTMLTokenType.Elems.C_ELEM
        : HTMLTokenType.Elems.O_ELEM,
      elem_str
    );
  }

  _makeModifierArgs() {
    let mod_arg = this.current_char;

    this.advance();

    while (
      this.current_char !== null &&
      this.current_char !== HTMLTokenType.Syntax.MODF_C
    ) {
      mod_arg += this.current_char;

      this.advance();
    }

    if (this.current_char !== HTMLTokenType.Syntax.MODF_C)
      throw new Error("Expected closing for modifer, got: " + mod_arg);

    return new HTMLToken(HTMLTokenType.Modifiers.MODF_ARG, mod_arg);
  }
}

module.exports = Lexer;
