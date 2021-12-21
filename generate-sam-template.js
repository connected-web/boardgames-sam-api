const { yamlParse, yamlDump } = require('yaml-cfn');
const fs = require('fs')
const app = require('./api-code/')

const baseTemplate = fs.readFileSync('base-template.yaml', 'utf8')
const template = yamlParse(baseTemplate)

function createResourceFunction(config) {
  const { name, codePath, runTime, handlerId, handlerPath, handlerMethod, handlerPolicies } = config
  const policies = [handlerPolicies || []].flat(2).filter(n => n)
  const sanitizedName = name.replace(/[^a-zA-Z]/g, '')
  const resourceBlock = {
    [`${sanitizedName}Function`]: {
      Type: 'AWS::Serverless::Function',
      Properties: {
        CodeUri: codePath,
        Handler: `app.${handlerId}`,
        Runtime: runTime,
        Policies: policies,
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

const endpoints = Object.entries(app).map(([key, entry]) => {
  const endpoint = {
    name: entry.routeName,
    codePath: 'api-code/',
    runTime: 'nodejs14.x',
    handlerId: key,
    handlerPath: entry.routePath,
    handlerMethod: entry.routeMethod,
    handlerPolicies: entry.routePolicies
  }
  return endpoint
}).filter(endpoint => endpoint.handlerId && endpoint.handlerPath && endpoint.handlerMethod)

if (endpoints.length !== Object.values(app).length) {
  console.warn('Warning: Mismatch between exposed method handlers from app; and filtered endpoints.')
  console.warn('Exposed method handlers:')
  console.warn('  ', Object.keys(app))
  console.warn('Filtered endpoints:')
  console.warn('  ', endpoints.map(n => n.name))
  console.warn('Please check that handlerId, handlerPath, and handlerMethod are correctly set on each exposed endpoint.')
}

endpoints.forEach(endpoint => {
  console.log('Creating resource template for', endpoint)
  addEndpoint(endpoint, template)
})

const templateYaml = yamlDump(template)
const templateFilepath = 'template.yaml'

console.log('Writing', templateFilepath, templateYaml.length, 'bytes', 'with', endpoints.length, 'endpoints', endpoints.map(n => n.name))
fs.writeFileSync(templateFilepath, templateYaml, 'utf8')