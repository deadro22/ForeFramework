const { JSExpressionAttribute } = require("../Parser/Attributes");
const { ForeElement, JSScript, StringLiteral } = require("../Parser/Nodes");

class Interpreter {
  visit = (element = ForeElement) => {
    if (element.constructor.name === StringLiteral.name)
      return `'${element.value.replace(/\r\n/g, "")}'`;

    if (element.constructor.name === JSScript.name) {
      this.traverseRef(element.source);
      return `{'${element.source}':${element.source}}`;
    }

    const isCustomComponent =
      element.opening.name[0] === element.opening.name[0].toUpperCase();

    const elemName = !isCustomComponent
      ? `'${element.opening.name}'`
      : element.opening.name;

    const tempElemAttrs =
      element.opening.attributes.length === 0
        ? null
        : element.opening.attributes;

    let finalElAttr = [];

    if (tempElemAttrs) {
      const arrLength = tempElemAttrs.length;

      for (let i = 0; i < arrLength; i++) {
        const attr = tempElemAttrs[i];
        const attrEl = Object.keys(attr)[0];

        finalElAttr.push({
          [attrEl]:
            Object.values(attr)[0].constructor.name ===
            JSExpressionAttribute.name
              ? Object.values(attr)[0].source
              : `'${Object.values(attr)[0].value}'`,
        });
      }
    }

    const elemChildren = element.opening.children.map(this.visit);

    let attrObjFlat = "{";
    finalElAttr.forEach((a) => {
      const l = `'${Object.keys(a)[0]}': ${Object.values(a)[0]},`;
      attrObjFlat += l;
    });

    return `Fore.createElement(${elemName},${
      finalElAttr.length > 0 ? attrObjFlat + "}" : "{}"
    },[${elemChildren.length === 0 ? "" : elemChildren}])`;
  };

  traverseRef(idName) {
    //console.log(idName);
  }

  _makeCallExp(arg, data) {
    /*const vars = Object.getOwnPropertyNames(data).map(
      (prop) => "const " + prop + "=" + JSON.stringify(data[prop]) + ";"
    );*/
    return new Function(arg);
  }
}

module.exports = Interpreter;
