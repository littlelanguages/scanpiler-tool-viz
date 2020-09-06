# scanpiler Visualisation

This project creates the tool that allows a `scanpiler` scanner definition file to be loaded and then translated into an NFA and then into a DFA.  Both of the NFA and DFA automatons are then written out as [Graphviz](https://graphviz.org) dot files.

## Simple Scanner Definition

The following file shows off a scanner definition that tokenizes identifiers and literal positive integers.

```
tokens 
  Identifier = alpha {alpha};
  LiteralInt = digit {digit};

fragments
  alpha = 'a'-'z' + 'A'-'Z';
  digit = '0'-'9';
```

![bob](./.doc/simple-nfa.svg)<img src="./.doc/simple-nfa.svg">