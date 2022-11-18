const HTMLTokenType = {
  Elems: {
    O_ELEM: "HTML_OPENING_ELEM",
    C_ELEM: "HTML_CLOSING_ELEM",
    SC_ELEM: "HTML_SELF_CLOSING_ELEM",
  },
  Syntax: {
    CLOSING: ">",
    OPENING: "<",
    ENDING: "/",
    ATTR_EQ: "=",
    STRING: "STRING",
    JS_O: "{",
    JS_C: "}",
    MODF_O: "(",
    MODF_C: ")",
    MODF_ARG: ":",
  },
  Attribute: {
    ID: "ID",
    CLASS: "CLASS",
    "ON:CLICK": "ON:CLICK",
    "ON:HOVER": "ON:HOVER",
    JS: "JS_EXP",
    CUSTOM_AT: "CUSTOM_AT",
  },
  Modifiers: {
    MODF_ARG: "MODF_ARG",
    EACH_EXP: "EACH",
    IF_EXP: "IF",
  },
  Special: {
    CodeBlockSplit: "###",
  },
};

class HTMLToken {
  constructor(type, value = null) {
    this.type = type;
    this.value = value;
  }
}

module.exports.HTMLToken = HTMLToken;
module.exports.HTMLTokenType = HTMLTokenType;
