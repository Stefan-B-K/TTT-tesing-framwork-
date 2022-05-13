
const fs = require('fs')
const path = require('path')
const render = require('./render')


const ignoreDirs = ['node_modules']

class Runner {
  constructor() {
    this.testFiles = []
  }

  async collectFiles(targetPath) {  // "Breadth First Search" algorithm
    const files = await fs.promises.readdir(targetPath)

    for (let file of files) {
      const filePath = path.join(targetPath, file)
      const stats = await fs.promises.lstat(filePath)

      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ name: filePath, shortPath: file })
      } else if (stats.isDirectory() && !ignoreDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filePath)
        files.push(...childFiles.map(childFie => path.join(file, childFie)))  // ... 
      }
    }
    return this.testFiles.map(file => file.name)
  }

  runTests() {
    for (let file of this.testFiles) {
      console.log(`\x1b[1;36m \n\t***** TESTING FILE: \x1b[0m\x1b[36m${file.shortPath}\x1b[0m\n`)
      
      global.render = render      // for HTML testing

      const beforeEaches = []
      global.beforeEach = (callback) => {
        beforeEaches.push(callback)
      }

      global.it = async (description, callback) => {
        beforeEaches.forEach(func => func())
        try {
          await callback()
          console.log(`\t\x1b[1;32m✓ PASSED : \x1b[0m\x1b[32m${description}\x1b[0m\n`)
        } catch (error) {
          console.log(`\t\x1b[1;31m✘ FAILED : \x1b[0m\x1b[31m${description}\x1b[0m`)
          const errorMeassage  = error.message.replace(/\n/g, '\n\t').replace(/^\s*[\r\n]/gm, "").trim()
          console.log(`\t\x1b[33m${errorMeassage}\x1b[0m\n`)
        }
      }

      try {
        require(file.name)
      } catch (error) {
        console.log(`\t\x1b[1;31m» ERROR IN TEST FILE : \x1b[0m\x1b[31m${file.shortPath}\x1b[0m`)
        const errorMeassage = error.message.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s*[\r\n]/gm, "").trim()
        console.log(`\t\x1b[33m${errorMeassage}\x1b[0m\n`)
      }
    }
  }
}

module.exports = Runner