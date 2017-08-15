"use strict";
exports.__esModule = true;
exports.__esModule = true;
var fs = require("fs");
var warnings = {};
var LogWarning = function (path, state, message) {
    var msg = state.file.opts.filename + " line " + path.node.loc.start
        .line + " " + message;
    if (!warnings[msg]) {
        warnings[msg] = true;
        console.log(msg);
    }
};
var TraverseAndLogWarnings = function (path, state) {
    path.traverse({
        Identifier: function (path) {
            if (path.node.name === "arguments" && path.scope === path.scope) {
                LogWarning(path, state, "uses 'arguments'");
            }
        },
        ThisExpression: function (path) {
            LogWarning(path, state, "uses 'this'");
        }
    });
};
var GetReplacementExp = function (types, path) {
    var expression = types.arrowFunctionExpression(path.node.params, path.node.body);
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
var def = function (o) {
    return {
        visitor: {
            /*
             * function x () {} => const x = () => {}
             **/
            FunctionDeclaration: function (path, state) {
                TraverseAndLogWarnings(path, state);
                path.replaceWith(GetReplacementExp(o.types, path));
            },
            /*
             * .prototype.x = function () {} -> .prototype.x = () => {}
             * .prototype.x = function x() {} -> .prototype.x = () => {}
             */
            FunctionExpression: function (path, state) {
                TraverseAndLogWarnings(path, state);
                path.replaceWith(GetReplacementExp(o.types, path));
            },
            ArrowFunctionExpression: function (path, state) {
                TraverseAndLogWarnings(path, state);
            }
        }
    };
};
exports["default"] = def;
