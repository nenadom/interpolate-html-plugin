/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This Webpack plugin lets us interpolate custom variables into `index.html`.
// Usage: `new InterpolateHtmlPlugin({ 'MY_VARIABLE': 42 })`
// Then, you can use %MY_VARIABLE% in your `index.html`.

// It works in tandem with HtmlWebpackPlugin.
// Learn more about creating plugins like this:
// https://github.com/ampedandwired/html-webpack-plugin#events

"use strict";
const escapeStringRegexp = require("escape-string-regexp");
let tapped = 0;
class InterpolateHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("InterpolateHtmlPlugin", compilation => {
      if (
        !tapped++ &&
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing !== undefined
      ) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
          "InterpolateHtmlPlugin",
          (data, callback) => {
            // Run HTML through a series of user-specified string replacements.
            Object.keys(this.replacements).forEach(key => {
              const value = this.replacements[key];
              data.html = data.html.replace(
                new RegExp("%" + escapeStringRegexp(key) + "%", "g"),
                value
              );
            });
            if (typeof callback === "function") {
              callback(null, data);
            }
          }
        );
      }
    });
  }
}

module.exports = InterpolateHtmlPlugin;
