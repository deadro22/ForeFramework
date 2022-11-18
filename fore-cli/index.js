#!/usr/bin/env node

const generateComponent = require("./lib/generator");

const componentName = process.argv.splice(2)[0];
const componentLocation = process.cwd();

generateComponent(componentLocation, componentName);
