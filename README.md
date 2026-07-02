# htmx app in TypeScript with Hono + Playwright on bun

Reading through the book ["JavaScriptレスの動的UI開発 htmx入門" 太田智暉](https://www.amazon.co.jp/HTMX-%E5%A4%AA%E7%94%B0%E6%99%BA%E6%9A%89/dp/4863544693/ref=tmm_pap_swatch_0).

The sample codes in the book are written in Python. I will rewrite the sample in TypeScript on bun + Hono + JSX. I will add E2E test suite using Playwright.

## todo-app パッケージを作る手順

あなたのマシンに bun がインストール済みであると前提します。bunのインストールについては

- https://bun.com/docs/installation

を参照のこと。コマンドラインでバージョンが確認できることを前提します。

```
$ bun --version
1.3.14
```

GitHubレポジトリのルートとなるディレクトリがすでに作られいていることを前提します。そのディレクトリのことを以下で `$PROJECT` と表記します。私のMacではこんな具合。

```
$ PROJECT=`pwd`
$ echo $PROJECT
/Users/kazurayam/github/htmx-app-in-typescript-with-hono-playwright-on-bun
```

## モノレポにする

$PROJECTの直下には `package.json` ファイルがあります。そこにはこう書いてある。

```
{
  "name": "htmx-app-in-typescript-with-hono-playwright-on-bun",
  "module": "index.ts",
  "type": "module",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "@types/bun": "latest"
  },
  "peerDependencies": {
    "typescript": "^5"
  }
}
```

特に下記に注目してください。

```
  "workspace": [
    "packages/*"
  ]
```

$PROJECTディレクトリの下に `packages` ディレクトリを作り、その下にサブディレクトリを作れば、それらがNode.jsの用語である [`workspace`](https://docs.npmjs.com/cli/v7/using-npm/workspaces?v=true) と認識される。つまりこのレポジトリを[Monorepo「モノレポ」](https://zenn.dev/pesso/articles/2db90372827f5b)として構成しました。

`packages`ディレクトリを作った。

```
$ cd $PROJECT
$ mkdir packages
```

`packages` ディレクトリにcdして、そこで `bun init` コマンドを投入して `todo-app` パッケージを作った。

```
$ cd $PROJECT
$ cd packages
$ bun init todo-app
$ bun init todo-app

✓ Select a project template: Blank

 + .gitignore
 + CLAUDE.md
 + index.ts
 + tsconfig.json (for editor autocomplete)
 + README.md

To get started, run:

    bun run index.ts

bun install v1.3.14 (0d9b296a)

Done! Checked 26 packages (no changes) [245.00ms]

$ ls
$ bun init todo-app

✓ Select a project template: Blank

 + .gitignore
 + CLAUDE.md
 + index.ts
 + tsconfig.json (for editor autocomplete)
 + README.md

To get started, run:

    bun run index.ts

bun install v1.3.14 (0d9b296a)

Done! Checked 26 packages (no changes) [245.00ms]
```

`pacakges`ディレクトリの下に `todo-app` ディレクトリができた。

```
$ ls
my-app          todo-app
```

`todo-app` ディレクトリの初期状態はこんなふうになった。

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

`package.json`の初期状態はこんなふうだ。

```
{
  "name": "todo-app",
  "module": "index.ts",
  "type": "module",
  "private": true,
  "devDependencies": {
    "@types/bun": "latest"
  },
  "peerDependencies": {
    "typescript": "^5"
  }
}
```

`tsconfig.js`の初期状態はこんなふうだ。

```
{
  "compilerOptions": {
    // Environment setup & latest features
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "types": ["bun"],

    // Bundler mode
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    // Best practices
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Some stricter flags (disabled by default)
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

### dependenciesを追加する

#### Honoを追加する

```
$ cd $PROJECT/packages/todo-app
$ bun add hono
$ bun add @hono/node-server
```

#### LogTapeを追加する

```
$ cd $PROJECT/packages/toto-app
$ bun add @logtape/logtape
```

#### Playwrightを追加する

```
$ cd $PROJECT/packages/todo-app
$ bun add -d playwright-core
$ bun add -d @playwright/test
```

### tsconfig.jsonを編集する

```
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "types": [
        "bun-types"
    ]
  }
}
```

