@{%

const moo = require("moo")

let lexer = moo.compile({
    scalarType: ["String", "Number", "Boolean"],
    "{": "{",
    "}": "}",
    ",": ",",
    ":": ":",
    ";": ";",
    "!": "!",
    "=": "=",
    "relation": "relation",
    "from": "from",
    "to": "to",
    "via": "via",
    "has": "has",
    "many": "many",
    "one": "one",
    "direction": ["out","in"],
    "type": "type",
    "using": "using",
    "implements": "implements",
    "space": {match: /\s+/, lineBreaks: true},
    "number": /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    "string": /"[a-zA-Z]+"/,
    "boolean": ["true", "false"],
    "word": /[a-zA-Z]+/,
})

%}

@lexer lexer

main -> Schema:* {% d => d[0] %}
Schema -> (Relation|Model) {% d => d[0][0] %}

Relation -> _ RelationHeader _ Properties _ ";":? {% d => ({ "type": "Relation", ...d[1], properties: d[3] }) %}
RelationHeader -> "relation" _ Word _ "from" _ Word _ "to" _ Word _ "via" _ String {% d => ({ name: d[2], from: d[6], to: d[10], via: d[14] }) %}

Model -> _ ModelHeader _ Properties _ ";":? _ {% d => ({ type: "Model", ...d[1], properties: d[3] }) %}
ModelHeader -> "type" _ Word _ "implements" _ Word {% d => ({ name: d[2], implements: d[6] }) %}
    | "type" _ Word {% d => ({ name: d[2] }) %}
Properties -> "{" Property:* _ "}" {% d => d[1] ? d[1] : [] %}

Property -> _ Word _ ":" _ PropertyRelation _ [",",";"]:? {% d => ({ name: d[1], type: "Relation", ...d[5] }) %}
    | _ Word _ ":" _ ScalarType _ [",",";"]:? {% d => ({ name: d[1], ...d[5] }) %}
PropertyRelation -> "has" _ ["many","one"] _ Word _ "using" _ Word {% d => ({ relation: d[8], many: d[2].value === "many", to: d[4], direction: null }) %}
    | "has" _ ["many","one"] _ Word _ "using" _ Word _ %direction {% d => ({ relation: d[8], many: d[2].value === "many", to: d[4], direction: d[10].value }) %}

String -> %string {% d => JSON.parse(d[0].value) %}
Word -> %word {% d => d[0].value %}
ScalarType -> %scalarType DefaultValue:? {% d=> ({ type: d[0].value, scalar: true, defaultValue: d[1] }) %}
    | %scalarType _ "!" {% d => ({ type: d[0].value, scalar: true, required: !!d[2] }) %}
DefaultValue -> _ "=" _ %string {% d => ({ type: "String", value: JSON.parse(d[3].value) }) %}
    | _ "=" _ %number {% d => ({ type: "Number", value: JSON.parse(d[3].value) }) %}
    | _ "=" _ %boolean {% d => ({ type: "Boolean", value: d[3].value }) %}

_ -> null | %space {% () => null %}

