const { yamlParse, yamlDump } = require('yaml-cfn');
const fs = require('fs')

const baseTemplate = fs.readFileSync('base-template.yaml', 'utf8')
const base = yamlParse(baseTemplate)

function createResourceFunction(config) {
  const { name, codePath, runTime, handlerId, handlerPath, handlerMethod } = config
  const sanitizedName = name.replace(/[^a-zA-Z]/g, '')
  const resourceBlock = {
    [`${sanitizedName}Function`]: {
      Type: 'AWS::Serverless::Function',
      Properties: {
        CodeUri: codePath,
        Handler: `app.${handlerId}`,
        Runtime: runTime,
        Events: {
          Summary: {
            Type: 'Api',
            Properties: {
              Path: handlerPath,
              Method: handlerMethod
            }
          }
        }
      }
    }
  }
  return resourceBlock
}

function createOutputFunction(config) {
  const { name } = config
  const sanitizedName = name.replace(/[^a-zA-Z]/g, '')
  const resourceName = `${sanitizedName}Function`
  const outputBlock = {
    [resourceName]: {
      Description: 'Summary Lambda Function ARN',
      Value: `!GetAtt ${resourceName}.Arn`
    },
    [`${resourceName}IamRole`]: {
      Description: `Implicit IAM Role created for ${sanitizedName} function`,
      Value: `!GetAtt ${resourceName}Role.Arn`
    }
  }
  return outputBlock
}

function addEndpoint(config, base) {
  base.Resources = base.Resources || {}
  base.Outputs = base.Outputs || {}

  const resourceBlock = createResourceFunction(config)
  const outputBlock = createOutputFunction(config)

  Object.assign(base.Resources, resourceBlock)
  Object.assign(base.Outputs, outputBlock)
}

addEndpoint({
  name: 'Status',
  codePath: 'api-code/',
  runTime: 'nodejs14.x',
  handlerId: 'statusHandler',
  handlerPath: '/status',
  handlerMethod: 'GET'
}, base)

addEndpoint({
  name: 'Create Play Record',
  codePath: 'api-code/',
  runTime: 'nodejs14.x',
  handlerId: 'createPlayRecordHandler',
  handlerPath: '/createPlayRecord',
  handlerMethod: 'POST'
}, base)

console.log('Result:', base)
const resultTemplate = yamlDump(base)

fs.writeFileSync('template.yaml', resultTemplate, 'utf8')