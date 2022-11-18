const PREDEF_ATTRIBUTES = ["if", "each"];

function isDefinedHtmlElement(elementName) {
  return ELEM_TYPES.includes(elementName) || PREDEF_ELEM.includes(elementName);
}

function isPredefinedAttribute() {
  return ELEM_TYPES.includes(PREDEF_ATTRIBUTES);
}

module.exports = {
  ELEM_TYPES,
  isDefinedHtmlElement,
  isPredefinedAttribute,
};
