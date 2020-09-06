import {
  format,
  parse,
  ParsedPath,
} from "https://deno.land/std@0.63.0/path/mod.ts";

import { translate } from "https://raw.githubusercontent.com/littlelanguages/scanpiler/0.0.1/parser/dynamic.ts";
import { FA } from "https://raw.githubusercontent.com/littlelanguages/scanpiler/0.0.1/la/fa.ts";
import { Builder } from "https://raw.githubusercontent.com/littlelanguages/scanpiler/0.0.1/la/nfa.ts";
import { Definition } from "https://raw.githubusercontent.com/littlelanguages/scanpiler/0.0.1/la/definition.ts";
import { fromNFA } from "https://raw.githubusercontent.com/littlelanguages/scanpiler/0.0.1/la/dfa.ts";
import * as Set from "https://raw.githubusercontent.com/littlelanguages/deno-lib-data-set/0.0.1/mod.ts";
import * as PP from "https://raw.githubusercontent.com/littlelanguages/deno-lib-text-prettyprint/0.1.0/mod.ts";

export function vizCommand(
  fileName: string,
  options: { directory: string | undefined },
) {
  const path = parse(fileName);

  if (path.ext == undefined) {
    path.ext = ".ll";
  }

  const decoder = new TextDecoder("utf-8");
  const src = decoder.decode(Deno.readFileSync(format(path)));
  const parseResult = translate(src).map((d) => fromDefinition(d));

  parseResult.either((e) => {
    console.log(e);
  }, (fa) => {
    writeFA(fa, fromPath(path, options.directory, path.name + "-nfa", ".dot"));
    writeFA(
      fromNFA(fa),
      fromPath(path, options.directory, path.name + "-dfa", ".dot"),
    );
  });
}

function fromPath(
  path: ParsedPath,
  dir: string | undefined,
  name: string,
  ext: string,
): string {
  const result = Object.assign({}, path);

  result.dir = dir || path.dir;
  result.name = name;
  result.ext = ext;
  result.base = name + ext;

  return format(result);
}

function fromDefinition(definition: Definition): FA<number> {
  const builder = new Builder<number>();

  definition.tokens.forEach((v, i) => {
    builder.addItem(i, v[1]);
  });

  return builder.build();
}

export async function writeFA(fa: FA<number>, fileName: string): Promise<void> {
  const fid = await Deno.create(fileName);
  await writeOutFA(new FileWriter(fid), fa);
  return fid.close();
}

export function writeOutFA(
  writer: Deno.Writer,
  fa: FA<number>,
): Promise<void> {
  return PP.render(
    PP.vcat([
      "digraph finite_state_machine {",
      PP.nest(
        2,
        PP.vcat([
          "rankdir=LR;",
          'size="8,5"',
          "node [shape = doublecircle]; " + [...fa.endNodes].map((m) =>
            "n" + m[0]
          ).join(" ") + ";",
          "node [shape = circle];",
        ].concat(
          fa.nodes.flatMap((node) =>
            node.transitions.map((transition) =>
              `n${node.id} -> n${transition[1].id} [label = ${
                setToString(transition[0])
              }]`
            )
          ),
        )),
      ),
      "}",
    ]),
    writer,
  );
}

function writeCh(ch: number): string {
  if (ch < 32 || ch > 127 || ch == 34 || ch == 39) {
    return `chr(${ch})`;
  } else {
    return `'${String.fromCharCode(ch)}'`;
  }
}

function setToString(s: Set<number>): string {
  return (Set.isEmpty(s))
    ? "<&#949;>"
    : `"${
      Set.asRanges(s).map((r) =>
        (r instanceof Array) ? writeCh(r[0]) + "-" + writeCh(r[1]) : writeCh(r)
      ).join(" + ")
    }"`;
}

class FileWriter implements Deno.Writer {
  private fid: Deno.File;

  constructor(fid: Deno.File) {
    this.fid = fid;
  }

  write(p: Uint8Array): Promise<number> {
    return this.fid.write(p);
  }
}
