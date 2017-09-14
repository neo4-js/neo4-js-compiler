// @flow

import { parse } from "./parser.js";
import prettier from "prettier";

/**
 * Validate if default values match the scalar type
 * Validate if used relations are defined
 */
function validateModel(model, relations) {
  model.properties.forEach(p => {
    // Validate if default values match the scalar type
    if (p.scalar && p.defaultValue && p.type !== p.defaultValue.type) {
      throw new Error(`Default value doesn't match type of property.

${model.name}.${p.name} is of type ${p.type} and your default value ${p
        .defaultValue.value} is of type ${p.defaultValue.type}.`);
    }

    // Validate if used relations are defined
    if (p.type === "Relation" && !relations.find(r => r.name === p.relation)) {
      throw new Error(
        `Relation ${p.relation} on ${model.name}.${p.name} not defined`
      );
    }
  });
}

/**
 * Validate if model is valid
 * Validate if model name is unique
 */
function validateModels(models, relations) {
  // Validate if model names are unique
  models.forEach(m => {
    if (models.filter(b => b.name === m.name).length !== 1)
      throw new Error(
        `Model names must be unqiue. ${m.name} is defined multiple times`
      );
  });

  models.forEach(m => validateModel(m, relations));
}

function printRelationHeader(r) {
  return `relation ${r.name} from ${r.from} to ${r.to} via "${r.via}"`;
}

// In a week I'll have no idea what I did here
function validateRelation(r, models) {
  // Check if connections use from/to models
  const usedModels = models.filter(m =>
    m.properties.find(p => p.type === "Relation" && p.relation === r.name)
  );
  const checkModel = m => {
    if (m.name !== r.from && m.name !== r.to) {
      throw new Error(
        `Relation ${r.name} can't be used within ${m.name} model because it's neither used as from or to model

${printRelationHeader(r)} {`
      );
    }
    const prop = m.properties.find(
      p => p.type === "Relation" && p.relation === r.name
    );

    /**
     * Check if the destination relations of a model property is either defined in relation.to or relation.from
     */
    if (prop.to !== r.from && prop.to !== r.to) {
      throw new Error(
        `${m.name}.${prop.name} needs to point ${r.from !== r.to
          ? `either to ${r.from} or ${r.to}`
          : `to ${r.from}`} as defined in

${printRelationHeader(r)} {

Change
${prop.name}: has ${prop.many ? "many" : "one"} ${prop.to} using ${r.name}
${r.from !== r.to
          ? `either to
${prop.name}: has ${prop.many ? "many" : "one"} ${r.from} using ${r.name}
or
${prop.name}: has ${prop.many ? "many" : "one"} ${r.to} using ${r.name}`
          : `to
${prop.name}: has ${prop.many ? "many" : "one"} ${r.from} using ${r.name}`}`
      );
    }
  };
  usedModels.forEach(checkModel);

  // Check if used models are defined
  const checkDefined = dir => {
    if (!models.find(m => m.name === r[dir])) {
      throw new Error(
        `Model ${r[dir]} not defined

${printRelationHeader(r)}`
      );
    }
  };
  checkDefined("to");
  checkDefined("from");
}

function validateRelations(models, relations) {
  // Validate if relation names are unique
  relations.forEach(a => {
    if (relations.filter(b => a.name === b.name).length !== 1)
      throw new Error(
        `Relation names must be unqiue. ${a.name} is defined multiple times`
      );
  });

  relations.forEach(r => validateRelation(r, models));
}

function compileRelation(r) {
  return [
    `const ${r.name} = relation`,
    `  .from(() => ${r.from})`,
    `  .to(() => ${r.to})`,
    `  .via("${r.via}");`,
  ].join("\n");
}

function compileRelationProperty(model, prop, relations) {
  return [
    `@${prop.many
      ? "hasMany"
      : "hasOne"}(() => ${prop.to}, ${prop.relation}${prop.direction
      ? `, "${prop.direction}"`
      : ""})`,
    `// prettier-ignore`,
    `${prop.name}/*: Has${prop.many
      ? "Many"
      : "One"}Actions<${prop.to}Props, ${prop.to}Instance> */;`,
  ].join("\n");
}

function compileProperty(prop) {
  let type = prop.type.toLowerCase();
  return `  ${prop.name}: ${type},`;
}

function compileModel(model, relations) {
  const template = [
    "/*::",
    `export type ${model.name}Props = {|`,
    model.properties
      .filter(p => p.type !== "Relation")
      .map(compileProperty)
      .join("\n"),
    "|}",
    "*/",
    "",
    `class ${model.name}Model extends Model/*:: <${model.name}Props, ${model.name}Instance>*/ { }`,
    `export const ${model.name}/*: ${model.name}Model*/ = new ${model.name}Model("${model.name}");`,
    `@model(${model.name})`,
    `export class ${model.name}Instance extends ModelInstance/*:: <${model.name}Props>*/ {`,
    model.properties
      .filter(p => p.type === "Relation")
      .map(r => compileRelationProperty(model, r, relations))
      .join("\n"),
    "}",
  ].join("\n");

  return template;
}

export function compile(str: string) {
  const schema = parse(str);

  const models = schema.filter(m => m.type === "Model");
  const relations = schema.filter(r => r.type === "Relation");
  validateModels(models, relations);
  validateRelations(models, relations);
  const compiledRelations = relations.map(compileRelation).join("\n");
  const compiledModels = models.map(m => compileModel(m, relations)).join("\n");
  const compiled = [
    "/**",
    " * @flow",
    " */",
    `import { Model, ModelInstance, model, relation, hasMany, hasOne } from "neo4-js";`,
    `import type { StringProperty, NumberProperty, HasManyActions, HasOneActions } from "neo4-js";`,
    "",
    compiledRelations,
    "",
    compiledModels,
  ].join("\n");

  return prettier.format(compiled, { trailingComma: "es5" });
}
