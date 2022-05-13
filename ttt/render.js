
const path = require('path')
const { JSDOM } = require('jsdom')

const render = async file => {
  const filePath = path.join(process.cwd(), file)
  const dom = await JSDOM.fromFile(filePath, {
    runScripts: 'dangerously',
    resources: 'usable'
  })
  
  return new Promise((resolve, reject) => {
    dom.window.document.addEventListener('DOMContentLoaded', () => {
      resolve(dom)
    })
  })
}

module.exports = render