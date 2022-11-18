const transforms = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
};

const colors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};
function logColored(props, message) {
  const logColor = props && props.color ? props.color : "";
  const logTransform = transforms[props.transform]
    ? transforms[props.transform]
    : "\x1b[0m";
  console.log(
    (colors[logColor] || colors.white) + logTransform + "%s",
    message,
    transforms.reset
  );
}

function readFromFile(file, cb) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      cb(data);
    });
}

function getLineContentFromNumber(source, lineNumber, count) {
  const lines = source.split("\n");
  let fnSource = "<b>" + lineNumber + "  | >" + "</b>  " + lines[lineNumber];
  for (let i = 1; i <= count; i++) {
    const incNum = lineNumber + i;
    fnSource += "<b>" + incNum + "  | " + "</b>  " + lines[incNum] + "\n";
  }
  return fnSource;
}

function guidGenerator() {
  let S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + "-" + S4() + "-" + S4();
}

module.exports = {
  log: logColored,
  readFromFile,
  getLineContentFromNumber,
  guidGenerator,
};
