// Generated by CoffeeScript 1.3.3

define(['underscore'], function(_) {
  var RA;
  return RA = {
    initialize: function() {
      return _.bindAll(this);
    },
    resolve: function(doc, data) {
      var conditionHolds, fillOut, parts, result;
      fillOut = this._fillOut;
      conditionHolds = this._conditionHolds;
      parts = this._splitDoc(doc);
      result = [];
      _.each(parts, function(part) {
        if (conditionHolds(part.condition, data)) {
          console.log(["RA --- true:", part.condition, part.content.split('\n')[0].slice(0, 31) + "..."]);
          return result.push(fillOut(part.content, data));
        } else {
          return console.log(["RA --- NOT true:", part.condition, part.content.split('\n')[0].slice(0, 31) + "..."]);
        }
      });
      return result.join("");
    },
    _splitDoc: function(doc) {
      var parts, rawparts;
      parts = [];
      rawparts = doc.split(/[^\S\n]*\[\[\s*/);
      _.each(rawparts, function(part) {
        var bits;
        bits = part.split(/\s*\]\][^\S\n]*/);
        if (bits.length > 1) {
          return parts.push({
            condition: bits[0],
            content: bits.slice(1).join(" ]] ")
          });
        } else {
          return parts.push({
            condition: "always",
            content: bits[0]
          });
        }
      });
      return parts;
    },
    _conditionHolds: function(condition, data) {
      var conditions, evaluator, match_result, pattern, regex, resolveTerm;
      resolveTerm = RA._resolveTerm;
      conditions = {
        "never": function() {
          return false;
        },
        "always": function() {
          return true;
        },
        "(\\S+)\\s*(<|>|==?|!==?|<>)\\s*(\\S+)": function(matches) {
          var left, right;
          left = resolveTerm(matches[1], data);
          right = resolveTerm(matches[3], data);
          switch (matches[2]) {
            case '<':
              return left < right;
            case '>':
              return left > right;
            case '=':
            case '==':
              return left === right;
            case '!=':
            case '!==':
            case '<>':
              return left !== right;
          }
        }
      };
      for (pattern in conditions) {
        evaluator = conditions[pattern];
        regex = new RegExp(pattern);
        match_result = regex.exec(condition);
        if (match_result != null) {
          return evaluator(match_result);
        }
      }
      console.warn("Bad condition: " + condition);
      return false;
    },
    _fillOut: function(content, data) {
      var filledOut, value, varname;
      filledOut = content;
      for (varname in data) {
        value = data[varname];
        filledOut = filledOut.split("\$\$" + varname).join(value);
      }
      return filledOut;
    },
    _resolveTerm: function(term, data) {
      if (isNaN(term)) {
        console.log(['term is:', term]);
        if (term.indexOf("$$") !== -1) {
          console.log(['term is:', term]);
          term = RA._fillOut(term, data);
          console.log(['filled out term is:', term]);
        }
        return data[term];
      } else {
        return parseInt(term);
      }
    }
  };
});