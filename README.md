# Arithmetic expression compiler

## dependencies

Node.js v20+

## build

```bash
npm i && npm run build
```

## test

```bash
npm test
```

## run demo

Evaluate expression from command line arguments:

```bash

node --import=tsx src/index.mts -e "1 + 2 * 3"
# 7
```

or enter repl when no arguments are specified:

```bash
node --import=tsx src/index.mts
# > 1 + 2 * 3
# < 7
# > █
```

## dev

Watch file changes and trigger test during development:

```bash
npm run dev
# npx nodemon -w src --ext mts --exec "npm test"
```
