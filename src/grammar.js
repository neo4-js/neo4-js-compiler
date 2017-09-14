// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function() {
  function id(x) {
    return x[0];
  }

  const moo = require("moo");

  let lexer = moo.compile({
    scalarType: ["String", "Number", "Boolean"],
    "{": "{",
    "}": "}",
    ",": ",",
    ":": ":",
    ";": ";",
    "!": "!",
    "=": "=",
    relation: "relation",
    from: "from",
    to: "to",
    via: "via",
    has: "has",
    many: "many",
    one: "one",
    direction: ["out", "in"],
    type: "type",
    using: "using",
    implements: "implements",
    space: { match: /\s+/, lineBreaks: true },
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    string: /"[a-zA-Z]+"/,
    boolean: ["true", "false"],
    word: /[a-zA-Z]+/,
  });

  var grammar = {
    Lexer: lexer,
    ParserRules: [
      { name: "main$ebnf$1", symbols: [] },
      {
        name: "main$ebnf$1",
        symbols: ["main$ebnf$1", "Schema"],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]]);
        },
      },
      { name: "main", symbols: ["main$ebnf$1"], postprocess: d => d[0] },
      { name: "Schema$subexpression$1", symbols: ["Relation"] },
      { name: "Schema$subexpression$1", symbols: ["Model"] },
      {
        name: "Schema",
        symbols: ["Schema$subexpression$1"],
        postprocess: d => d[0][0],
      },
      { name: "Relation$ebnf$1", symbols: [{ literal: ";" }], postprocess: id },
      {
        name: "Relation$ebnf$1",
        symbols: [],
        postprocess: function(d) {
          return null;
        },
      },
      {
        name: "Relation",
        symbols: [
          "_",
          "RelationHeader",
          "_",
          "Properties",
          "_",
          "Relation$ebnf$1",
        ],
        postprocess: d => ({ type: "Relation", ...d[1], properties: d[3] }),
      },
      {
        name: "RelationHeader",
        symbols: [
          { literal: "relation" },
          "_",
          "Word",
          "_",
          { literal: "from" },
          "_",
          "Word",
          "_",
          { literal: "to" },
          "_",
          "Word",
          "_",
          { literal: "via" },
          "_",
          "String",
        ],
        postprocess: d => ({ name: d[2], from: d[6], to: d[10], via: d[14] }),
      },
      { name: "Model$ebnf$1", symbols: [{ literal: ";" }], postprocess: id },
      {
        name: "Model$ebnf$1",
        symbols: [],
        postprocess: function(d) {
          return null;
        },
      },
      {
        name: "Model",
        symbols: [
          "_",
          "ModelHeader",
          "_",
          "Properties",
          "_",
          "Model$ebnf$1",
          "_",
        ],
        postprocess: d => ({ type: "Model", ...d[1], properties: d[3] }),
      },
      {
        name: "ModelHeader",
        symbols: [
          { literal: "type" },
          "_",
          "Word",
          "_",
          { literal: "implements" },
          "_",
          "Word",
        ],
        postprocess: d => ({ name: d[2], implements: d[6] }),
      },
      {
        name: "ModelHeader",
        symbols: [{ literal: "type" }, "_", "Word"],
        postprocess: d => ({ name: d[2] }),
      },
      { name: "Properties$ebnf$1", symbols: [] },
      {
        name: "Properties$ebnf$1",
        symbols: ["Properties$ebnf$1", "Property"],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]]);
        },
      },
      {
        name: "Properties",
        symbols: [{ literal: "{" }, "Properties$ebnf$1", "_", { literal: "}" }],
        postprocess: d => (d[1] ? d[1] : []),
      },
      { name: "Property$ebnf$1", symbols: [/[",",";"]/], postprocess: id },
      {
        name: "Property$ebnf$1",
        symbols: [],
        postprocess: function(d) {
          return null;
        },
      },
      {
        name: "Property",
        symbols: [
          "_",
          "Word",
          "_",
          { literal: ":" },
          "_",
          "PropertyRelation",
          "_",
          "Property$ebnf$1",
        ],
        postprocess: d => ({ name: d[1], type: "Relation", ...d[5] }),
      },
      { name: "Property$ebnf$2", symbols: [/[",",";"]/], postprocess: id },
      {
        name: "Property$ebnf$2",
        symbols: [],
        postprocess: function(d) {
          return null;
        },
      },
      {
        name: "Property",
        symbols: [
          "_",
          "Word",
          "_",
          { literal: ":" },
          "_",
          "ScalarType",
          "_",
          "Property$ebnf$2",
        ],
        postprocess: d => ({ name: d[1], ...d[5] }),
      },
      {
        name: "PropertyRelation",
        symbols: [
          { literal: "has" },
          "_",
          /["many","one"]/,
          "_",
          "Word",
          "_",
          { literal: "using" },
          "_",
          "Word",
        ],
        postprocess: d => ({
          relation: d[8],
          many: d[2].value === "many",
          to: d[4],
          direction: null,
        }),
      },
      {
        name: "PropertyRelation",
        symbols: [
          { literal: "has" },
          "_",
          /["many","one"]/,
          "_",
          "Word",
          "_",
          { literal: "using" },
          "_",
          "Word",
          "_",
          lexer.has("direction") ? { type: "direction" } : direction,
        ],
        postprocess: d => ({
          relation: d[8],
          many: d[2].value === "many",
          to: d[4],
          direction: d[10].value,
        }),
      },
      {
        name: "String",
        symbols: [lexer.has("string") ? { type: "string" } : string],
        postprocess: d => JSON.parse(d[0].value),
      },
      {
        name: "Word",
        symbols: [lexer.has("word") ? { type: "word" } : word],
        postprocess: d => d[0].value,
      },
      { name: "ScalarType$ebnf$1", symbols: ["DefaultValue"], postprocess: id },
      {
        name: "ScalarType$ebnf$1",
        symbols: [],
        postprocess: function(d) {
          return null;
        },
      },
      {
        name: "ScalarType",
        symbols: [
          lexer.has("scalarType") ? { type: "scalarType" } : scalarType,
          "ScalarType$ebnf$1",
        ],
        postprocess: d => ({
          type: d[0].value,
          scalar: true,
          defaultValue: d[1],
        }),
      },
      {
        name: "ScalarType",
        symbols: [
          lexer.has("scalarType") ? { type: "scalarType" } : scalarType,
          "_",
          { literal: "!" },
        ],
        postprocess: d => ({
          type: d[0].value,
          scalar: true,
          required: !!d[2],
        }),
      },
      {
        name: "DefaultValue",
        symbols: [
          "_",
          { literal: "=" },
          "_",
          lexer.has("string") ? { type: "string" } : string,
        ],
        postprocess: d => ({ type: "String", value: JSON.parse(d[3].value) }),
      },
      {
        name: "DefaultValue",
        symbols: [
          "_",
          { literal: "=" },
          "_",
          lexer.has("number") ? { type: "number" } : number,
        ],
        postprocess: d => ({ type: "Number", value: JSON.parse(d[3].value) }),
      },
      {
        name: "DefaultValue",
        symbols: [
          "_",
          { literal: "=" },
          "_",
          lexer.has("boolean") ? { type: "boolean" } : boolean,
        ],
        postprocess: d => ({ type: "Boolean", value: d[3].value }),
      },
      { name: "_", symbols: [] },
      {
        name: "_",
        symbols: [lexer.has("space") ? { type: "space" } : space],
        postprocess: () => null,
      },
    ],
    ParserStart: "main",
  };
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = grammar;
  } else {
    window.grammar = grammar;
  }
})();
