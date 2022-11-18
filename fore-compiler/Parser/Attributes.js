class JSExpressionAttribute {
  constructor(source) {
    this.source = source;
  }
}

class RegularAttribute {
  constructor(value) {
    this.value = value;
  }
}

module.exports = { RegularAttribute, JSExpressionAttribute };
