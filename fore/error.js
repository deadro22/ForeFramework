const { readFromFile, getLineContentFromNumber } = require("./utils");

module.exports.makeForeError = function (msg, el, name) {
  const buildError = new Error(msg);
  buildError.details = {
    foreSource: el.parentNode
      ? el.parentNode.parentNode.innerHTML.replace(/\</g, "&lt")
      : el.replace(/\</g, "&lt"),
    foreSourceName: name,
  };
  return buildError;
};

class ForeErrorGlobalHandler {
  constructor() {
    window.onerror = (message, source, lineno, colno, error) => {
      const sourcePath = source
        .substring(source.indexOf(".") + 1)
        .replace(/\?/g, "");

      readFromFile(sourcePath, (data) => {
        const lineSource = getLineContentFromNumber(data, lineno, 10);

        const details = error.details;

        document.body.style.padding = "2em";

        const scr = document.createElement("script");
        const cssMod = document.createElement("style");
        cssMod.innerHTML = `
        pre.prettyprint {
          border: none !important;
      }
        `;

        scr.src =
          "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js";
        document.head.appendChild(scr);

        document.head.appendChild(cssMod);

        const ErrorTemplate = `<div style="font-family:Trebuchet MS;width:100%;display:flex;justify-content:center">
        <div style="width:100%;max-width:800px;margin:0em 100px">
         <h1 style="word-wrap: break-word;margin-bottom:0.5em;font-weight:700;font-size:25px;color:#ff0033">Error: ${
           error.message
         }</h1>
         ${
           details
             ? `<p style="margin-bottom:1em;font-size:15px;color:#666666">Source: ${details.foreSourceName}.fore</p>
           <pre class="prettyprint lang-html" style="margin-bottom:1em;font-weight:normal;font-size:15px;background-color:#fdf6e3;padding:1em">${details.foreSource}</pre> 
           `
             : ""
         }
         
         <p style="margin-bottom:1em;font-size:15px;color:#666666">Line ${lineno}:${colno} at source: ${sourcePath}</p>
         <p style="line-height:1.5em;padding:1em;background-color:#ffd6d6;margin-bottom:1em;font-size:15px;color:red">${
           error.stack
         }</p>
         <p style="margin-bottom:1em;font-size:15px;color:#666666">Caller: ${sourcePath}</p>
         <p style="line-height:1.5em;margin-top:2em;font-size:13px;color:#666666;opacity:0.8">
         This is just a development only error screen, it is Fore error debuger that only shows in development mode.<br/> details like this will not appear in production.</p>
         </div>
         </div>`;

        const dt = document.createElement("div");

        dt.style.fontFamily = "Helvetica";
        dt.style.fontWeight = "700";
        dt.style.fontSize = "20px";
        dt.innerHTML = ErrorTemplate;

        document.getElementById("root").appendChild(dt);
      });

      return true;
    };
  }
}

module.exports.ForeErrorGlobalHandler = ForeErrorGlobalHandler;
