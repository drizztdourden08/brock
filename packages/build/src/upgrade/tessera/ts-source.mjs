/* @layer tooling-scripts @kind logic */

const scriptKind = (ts, path) => {
  if (path.endsWith('.tsx')) return ts.ScriptKind.TSX;
  return /\.m?js$/.test(path) ? ts.ScriptKind.JS : ts.ScriptKind.TS;
};

const parse = (ts, path, source) => ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, scriptKind(ts, path));

const walk = (ts, node, visit) => {
  visit(node);
  ts.forEachChild(node, (child) => walk(ts, child, visit));
};

const nodesOf = (ts, file, test) => {
  const found = [];
  walk(ts, file, (node) => {
    if (test(node)) found.push(node);
  });
  return found;
};

const lineOf = (file, node) => file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;

const STRING_KINDS = ['StringLiteral', 'NoSubstitutionTemplateLiteral', 'TemplateHead', 'TemplateMiddle', 'TemplateTail'];

const isStringish = (ts, node) => STRING_KINDS.some((kind) => node.kind === ts.SyntaxKind[kind]);

const opensWithExpression = (ts, node) => node.kind === ts.SyntaxKind.TemplateMiddle || node.kind === ts.SyntaxKind.TemplateTail;

const closesWithExpression = (ts, node) => node.kind === ts.SyntaxKind.TemplateHead || node.kind === ts.SyntaxKind.TemplateMiddle;

/**
 * @returns {{ start: number, end: number, open: boolean, close: boolean }} between the quotes; open, close: cut by ${}
 */
const innerOf = (ts, file, node) => ({
  start: node.getStart(file) + 1,
  end: node.end - (closesWithExpression(ts, node) ? 2 : 1),
  open: opensWithExpression(ts, node),
  close: closesWithExpression(ts, node),
});

const byStartDescending = (a, b) => b.start - a.start || b.end - a.end;

const applyEdits = (source, edits) => {
  let out = source;
  let floor = Number.POSITIVE_INFINITY;
  for (const edit of [...edits].sort(byStartDescending)) {
    if (edit.end > floor) continue;
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
    floor = edit.start;
  }
  return out;
};

const tsSource = Object.freeze({ parse, walk, nodesOf, lineOf, isStringish, innerOf, applyEdits });

export { tsSource };
