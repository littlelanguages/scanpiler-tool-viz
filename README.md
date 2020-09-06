# scanpiler Visualisation

This project creates the tool that allows a `scanpiler` scanner definition file to be loaded and then translated into an NFA and then into a DFA.  Both of the NFA and DFA automatons are then written out as [Graphviz](https://graphviz.org) dot files.

The following examples are outputs produced using this library.

## Simple Scanner Definition

The following file show off a scanner definition that tokenizes identifiers and literal positive integers.

```
tokens 
  Identifier = alpha {alpha};
  LiteralInt = digit {digit};

fragments
  alpha = 'a'-'z' + 'A'-'Z';
  digit = '0'-'9';
```

### NFA (Nondeterministic Finite Automata)
![Simple NFA](./.doc/simple-nfa.svg)

### DFA (Deterministic Finite Automata)
![Simple DFA](./.doc/simple-dfa.svg)


## `scanpiler` Scanner Definition

The following file is the scanner definition of `scanpilers` input language

```
tokens
    Chr = "chr";
    Comments = "comments";
    Extend = "extend";
    Fragments = "fragments";
    Nested = "nested";
    To = "to";
    Tokens = "tokens";
    Whitespace = "whitespace";
    
    Backslash = "\";
    Bang = "!";
    Bar = "|";
    Equal = "=";
    LBracket = "[";
    LCurly = "{";
    LParen = "(";
    Minus = "-";
    Plus = "+";
    RBracket = "]";
    RCurly = "}";
    RParen = ")";
    Semicolon = ";";

    Identifier = alpha {alpha | digit};
    LiteralCharacter = chr(39) !chr(39) chr(39);
    LiteralInt = digit {digit};
    LiteralString = '"' {!'"'} '"';

comments
    "/*" to "*/" nested;
    "//" {!cr};

whitespace
    chr(0)-' ';

fragments
    digit = '0'-'9';
    alpha = 'a'-'z' + 'A'-'Z';
    cr = chr(10);
```

### NFA (Nondeterministic Finite Automata)
![scanpiler NFA](./.doc/scanpiler-nfa.svg)

### DFA (Deterministic Finite Automata)
![scanpiler DFA](./.doc/scanpiler-dfa.svg)

## See Also

It is tedious to have to write code to use this library.  A far simpler method is to use the [scanpiler-cli](https://github.com/littlelanguages/scanpiler-cli)

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/raw.githubusercontent.com/littlelanguages/scanpiler-tool-viz/main/mod.ts)
