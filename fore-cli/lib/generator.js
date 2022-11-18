const fs = require("fs");
const async = require("async");
const { log } = require("../../fore/utils");
const { isDefinedHtmlElement } = require("../../fore/core.def");
const { HTMLTokenType } = require("../../fore-compiler/Lexer/Tokens");

function errorExitProcess(props, err) {
  log(props, err);
  process.exit(0);
}

function verifyComponentName(compName) {
  if (/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/.test(compName) === false) {
    errorExitProcess(
      { color: "red", transform: "bright" },
      "Error: Invalid component name, every component must match the Pascal Case.\nExample: CompNameExample"
    );
  } else if (isDefinedHtmlElement(compName.toLowerCase())) {
    errorExitProcess(
      { color: "red", transform: "bright" },
      "Error: Invalid component name, " +
        compName.toLowerCase() +
        " is either a Fore predefined element or a native html element."
    );
  }
}

module.exports = function (componentLocation, componentName) {
  verifyComponentName(componentName);

  const componentPath = componentLocation + "/" + componentName;

  fs.mkdir(componentPath, (err) => {
    if (err) {
      errorExitProcess(
        { color: "red", transform: "bright" },
        "Error creating your file:\n=> " + err.message
      );
    }

    log(
      { color: "cyan", transform: "bright" },
      `Creating component ${componentName}...`
    );

    const generatorTemplate =
      "import Fore from '../fore/core.js' \n" +
      "import './" +
      componentName +
      ".css'\n\n" +
      HTMLTokenType.Special.CodeBlockSplit +
      "\n\n" +
      "<div></div>\n";

    async.parallel(
      [
        function (callback) {
          fs.writeFile(
            componentPath + "/" + componentName + ".fore",
            generatorTemplate,
            callback
          );
        },
        function (callback) {
          fs.writeFile(
            componentPath + "/" + componentName + ".css",
            "",
            callback
          );
        },
      ],
      function (err, results) {
        if (err) {
          errorExitProcess({ color: "red" }, err.message);
        }
        log(
          { color: "green", transform: "dim" },
          `Component ${componentName} template created`
        );
      }
    );
  });
};
