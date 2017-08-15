"use strict";
exports.__esModule = true;
import * as babel from "babel-core";
import * as trav from "babel-traverse";
var fs = require("fs");

const warnings = {};
const LogWarning = (path, state, message) => {
  let msg = `${state.file.opts.filename} line ${path.node.loc.start
    .line} ${message}`;
  if (!warnings[msg]) {
    warnings[msg] = true;
    console.log(msg);
  }
};

const TraverseAndLogWarnings = (path, state) => {
  path.traverse({
    Identifier: (path) => {
      if (path.node.name === "arguments" && path.scope === path.scope) {
        LogWarning(path, state, "uses 'arguments'");
      }
    },
    ThisExpression: (path) => {
      LogWarning(path, state, "uses 'this'");
    }
  });
};

const GetReplacementExp = (
  types: typeof babel.types,
  path: trav.NodePath<
    babel.types.FunctionDeclaration | babel.types.FunctionExpression
  >
) => {
  let expression:
    | babel.types.Expression
    | babel.types.VariableDeclaration = types.arrowFunctionExpression(
    path.node.params,
    path.node.body
  );

  if (path.node.id && path.node.id.name) {
    expression = types.variableDeclaration("const", [
      types.variableDeclarator(path.node.id, expression)
    ]);
  }

  return expression;
};

/** Note, performs in-order depth first traversal
 * 
 * A - B
 *   \ 
 *     C
 * 
 * D - E - F
 *   \
 *     G
 *
 * Traverses in order A B C D E F G
 */
const def = (o: { types: typeof babel.types; File }) => {
  return {
    visitor: <babel.Visitor>{
      /*
       * function x () {} => const x = () => {}
       **/
      FunctionDeclaration: (path, state) => {
        TraverseAndLogWarnings(path, state);
        path.replaceWith(GetReplacementExp(o.types, path));
      },
      /*
       * .prototype.x = function () {} -> .prototype.x = () => {}
       * .prototype.x = function x() {} -> .prototype.x = () => {}
       */
      FunctionExpression: (path, state) => {
        TraverseAndLogWarnings(path, state);
        path.replaceWith(GetReplacementExp(o.types, path));
      },
      ArrowFunctionExpression: (path, state) => {
        TraverseAndLogWarnings(path, state);
      }
    }
  };
};
exports["default"] = def;
