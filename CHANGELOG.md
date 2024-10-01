# Changelog

## v1.0.1 (2024-10-01)

### Features

- enable sourcemap ([864923f](https://github.com/nlibjs/tsm/commit/864923f6eee9290e35d6d2eef90385663b655b00))


## v1.0.0 (2024-09-21)

### Breaking Changes

- change the main ([442093f](https://github.com/nlibjs/tsm/commit/442093f2e4171d01ebc1c743ff75b2a49c28b3f3))


## v0.1.4 (2024-09-21)

### Tests

- delete the --experimental-loader pattern ([febdfd1](https://github.com/nlibjs/tsm/commit/febdfd19024670c10d19d9a7e8860d2b3a42c396))
- fix test errors ([19d6e66](https://github.com/nlibjs/tsm/commit/19d6e6600626669e08f42aa37d187fcdcee090c8))

### Continuous Integration

- upgrade actions ([fe61761](https://github.com/nlibjs/tsm/commit/fe61761bd1856d2232e543ffb3fe9fa50e39970f))

### Dependency Upgrades

- micromatch:4.0.7→4.0.8 ([290d1cf](https://github.com/nlibjs/tsm/commit/290d1cf6802b4be02f1bc4952f7e3545ac43ddc3))
- esbuild:0.23.0→0.23.1 ([d100a4b](https://github.com/nlibjs/tsm/commit/d100a4b8921d8935de398870b96d361ab4bf7980))
- @types/node:20.14.10→22.5.5 ([85872fe](https://github.com/nlibjs/tsm/commit/85872fecc5d0ec3b9f73a3811a72c5d6bf5f87be))


## v0.1.3 (2024-07-07)

### Bug Fixes

- publish register.mjs ([cc6fce1](https://github.com/nlibjs/tsm/commit/cc6fce16abbba52452b43972e87cb644ac08cb67))


## v0.1.2 (2024-07-07)

### Features

- add register.mjs ([602de6a](https://github.com/nlibjs/tsm/commit/602de6a1b234bb11d0c441b450040e315d408714))

### Bug Fixes

- eslint errors ([d375cdb](https://github.com/nlibjs/tsm/commit/d375cdb8631a869ff7de078c8402e041d99d2a9b))

### Dependency Upgrades

- @nlib/eslint-config:3.20.3→3.20.5 ([44ba431](https://github.com/nlibjs/tsm/commit/44ba4312986f7f389cce69df350fe441f0505e83))
- @types/node:20.12.7→20.14.10 ([8b9711c](https://github.com/nlibjs/tsm/commit/8b9711c8ef6e9c92eab5a919c8308d2cfa3d3bbe))
- commander:11.1.0→12.1.0 ([0fe7fc7](https://github.com/nlibjs/tsm/commit/0fe7fc7b041563cc1f85839bece1df0e2eb97433))
- esbuild:0.20.2→0.23.0 ([a259f0b](https://github.com/nlibjs/tsm/commit/a259f0bf001a83ddbaccdba8884f186e3d5daf70))
- micromatch:4.0.5→4.0.7 ([3be43da](https://github.com/nlibjs/tsm/commit/3be43da98779607741da9b2852ae9f24a920515b))
- lint-staged:14.0.1→15.2.7 ([76effad](https://github.com/nlibjs/tsm/commit/76effadb9d6798e275197801d94a0c58d9577f42))


## v0.1.1 (2023-09-02)

### Features

- read fileURL without extension ([25218b9](https://github.com/nlibjs/tsm/commit/25218b9f50ad92803bdb8f201d498970cbf52060))


## v0.1.0 (2023-09-02)

### Breaking Changes

- rename from mts to tsm ([8e67aa8](https://github.com/nlibjs/tsm/commit/8e67aa8d375e0a458cc0c742c4e311093aef001d))

### Tests

- normalize path.sep ([9a6f1c4](https://github.com/nlibjs/tsm/commit/9a6f1c4e4e63ffae0fb32e0985879b64bf26af24))
- sourcemaps ([b5056ba](https://github.com/nlibjs/tsm/commit/b5056bae1014ab81b38a64bd3fe6f65cfbd9266b))
- importing .ts ([e947310](https://github.com/nlibjs/tsm/commit/e9473100a9862dd660f48652acb49e567ffa795e))
- remove @nlib/typing ([6006a79](https://github.com/nlibjs/tsm/commit/6006a79cb7eea5ceda40079ecb97a44790ef7c3e))

### Documentation

- add badges ([ed5e64b](https://github.com/nlibjs/tsm/commit/ed5e64b3fc317446a0f921c7e8fde3e708a889de))

### Continuous Integration

- run test with c8 ([dc0b07d](https://github.com/nlibjs/tsm/commit/dc0b07de946f09ad9b705909904c4e3c577a93c2))

### Dependency Upgrades

- @types/node:20.5.7→20.5.8 ([c5cd760](https://github.com/nlibjs/tsm/commit/c5cd760451225ddd25064f88aa89c9a8d6ac8d22))
- @nlib/eslint-config:3.20.1→3.20.2 ([addfc34](https://github.com/nlibjs/tsm/commit/addfc3423bddc35b6458552b5c4a964c89bf723d))


## v0.0.4 (2023-09-01)

### Features

- add the main field of package.json ([61a534a](https://github.com/nlibjs/tsm/commit/61a534a28c7c041c49306736d741d42d61ddb71d))
- the first commit ([8f339db](https://github.com/nlibjs/tsm/commit/8f339db587aab4c63a9c3fdba984e64b2905d848))

### Bug Fixes

- add missing hashbang ([8628617](https://github.com/nlibjs/tsm/commit/86286170dd55c6755b7c4429afdce7c06c55991a))
- ignore files in node_modules ([47c3b93](https://github.com/nlibjs/tsm/commit/47c3b9345f06747b7e6daa6185d2fb19138ce046))
- check .mjs and .mts and return succeeded ([ec2b1a9](https://github.com/nlibjs/tsm/commit/ec2b1a9cfeb346a035fbe726636c6dbc8f1cadde))
- pass file url to --experimental-loader ([aa2feef](https://github.com/nlibjs/tsm/commit/aa2feefb435777d4d5c133a12c58469081db75a1))

### Tests

- fix the quotes ([7c3913b](https://github.com/nlibjs/tsm/commit/7c3913bb6571ac9752963290190a7aeaacab613d))

### Continuous Integration

- test on multiple os ([c828a7e](https://github.com/nlibjs/tsm/commit/c828a7e8b8489224ea334b6584f71232b0440a32))

### Dependency Upgrades

- uninstall mocha ([b0f62fe](https://github.com/nlibjs/tsm/commit/b0f62fea4b8dd70cc2032b8635863cc7508489f8))


