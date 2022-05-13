#!/usr/bin/env node

const Runner = require('./ttt/runner')

const runner = new Runner()

const test = async () => {
  await runner.collectFiles(process.cwd())
  runner.runTests()
}

test()