const { JSExpressionAttribute } = require("./Attributes");

class StringLiteral {
  constructor(value) {
    this.value = value;
  }
}

class ForeElement {
  constructor(opening = ForeOpeningElement, closing = ForeClosingElement) {
    this.opening = opening;
    this.closing = closing;
  }
}

class ForeClosingElement {
  constructor(name = "") {
    this.name = name;
  }
}

class JSScript {
  constructor(source = "") {
    this.source = source;
  }
}

class ForeElementModifier {
  constructor(type = "", expression = JSExpressionAttribute) {
    this.type = type;
    this.expression = expression;
  }
}

class ForeOpeningElement {
  constructor(
    name = "",
    selfClosing = false,
    attributes = [],
    props = [],
    children = []
  ) {
    this.name = name;
    this.children = children;
    this.selfClosing = selfClosing;
    this.attributes = attributes;
    this.props = props;
  }
}

module.exports = {
  ForeElement,
  StringLiteral,
  ForeClosingElement,
  ForeOpeningElement,
  JSScript,
  ForeElementModifier,
};
