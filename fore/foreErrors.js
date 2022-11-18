const { log } = require("./utils");
const os = require("os");
const cp = require("child_process");
const Compiler = require("../fore-compiler/compiler.base");

class ForeErrorsPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap("done", (stats) => {
      log({ color: "cyan", transform: "bright" }, "App compiling...");
    });
    compiler.hooks.done.tap("done", (stats) => {
      //console.clear();
      if (stats.compilation.errors.length > 0) {
        log(
          { color: "red", transform: "bright" },
          stats.compilation.errors[0].message
        );
      } else {
        let networkInterfaces = os.networkInterfaces();

        log(
          { color: "green", transform: "bright" },
          "App compiled and ready!\n"
        );
        log(
          { color: "white", transform: "bright" },
          `Fore app running on:\n\nLocal: http://localhost:8080\nNetwork: http://${networkInterfaces["Wi-Fi"][1].address}:8080\n`
        );
        log({ color: "green", transform: "bright" }, "Mode: Development");
      }
    });
  }
}

module.exports = ForeErrorsPlugin;
