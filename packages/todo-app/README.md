# todo-app

To install dependencies:

```bash
$ cd $PROJECT/packages/
$ bun install
...
$ bun --version
1.3.14
```

I created the `todo-app` package.

```
$ cd $PROJECT/packages/
$ bun init todo-app
...
```

I got the following files:

```
$ tree .
.
├── CLAUDE.md
├── index.ts
├── node_modules
│   ├── @types
│   │   └── bun -> ../../../../node_modules/.bun/@types+bun@1.3.14/node_modules/@types/bun
│   └── typescript -> ../../../node_modules/.bun/typescript@5.9.3/node_modules/typescript
├── package.json
├── README.md
└── tsconfig.json
```

To run `index.ts`:

```bash
$ bun run index.ts
Hello via Bun!
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
