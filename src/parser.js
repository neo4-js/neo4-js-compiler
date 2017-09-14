// @flow

import nearley from "nearley";
import grammar from "./grammar";

const g = nearley.Grammar.fromCompiled(grammar);

export function parse(str: string) {
  const parser = new nearley.Parser(g);
  parser.feed(str);
  return parser.results[0];
}
