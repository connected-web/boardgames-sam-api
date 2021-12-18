const { yamlParse, yamlDump } = require('yaml-cfn');
const fs = require('fs')

const baseTemplate = fs.readFileSync('base-template.yaml', 'utf8')
const template = yamlParse(baseTemplate)

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
      Description: `${sanitizedName} Lambda Function ARN`,
      Value: {
        'Fn::GetAtt': [
          `${resourceName}`,
          'Arn'
        ]
      }
    },
    [`${resourceName}IamRole`]: {
      Description: `Implicit IAM Role created for ${sanitizedName} function`,
      Value: {
        'Fn::GetAtt': [
          `${resourceName}Role`,
          'Arn'
        ]
      }
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
}, template)

addEndpoint({
  name: 'Create Play Record',
  codePath: 'api-code/',
  runTime: 'nodejs14.x',
  handlerId: 'createPlayRecordHandler',
  handlerPath: '/createPlayRecord',
  handlerMethod: 'POST'
}, template)

console.log('Result:', template)
const templateYaml = yamlDump(template)

fs.writeFileSync('template.yaml', templateYaml, 'utf8')