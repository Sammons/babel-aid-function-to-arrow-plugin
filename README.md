Transforms JavaScript `function() {}` to `() => {}`

To get started 

 - node.js needs to be installed
 - `npm install -g babel-cli` first
 - Note: this program logs about arguments and this usages, but does not error when they are encountered! babel may hoist "this" and "arguments" and replace them with _this and _arguments, this hoisting is not done properly, so fix "this" and "arguments" usages before running this program.
 - usage `node run <in_directory> <out_directory>`