const { yamlParse, yamlDump } = require('yaml-cfn');
const fs = require('fs')

const baseTemplate = fs.readFileSync('base-template.yaml', 'utf8')
const base = yamlParse(baseTemplate)

console.log('Parsed:', base)

const resultTemplate = yamlDump(base)

fs.writeFileSync('template.yaml', resultTemplate, 'utf8')