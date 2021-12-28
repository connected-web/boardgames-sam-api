# Boardgames Summary API

An API for summarising boardgame play stats using AWS SAM.

## Prerequisites

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 12](https://nodejs.org/en/), including the NPM package management tool.

## Getting Started

`cd api-code`

`npm install`

To run the tests

`npm test`

## Building and deploying

From the project root:

`sam build`

`sam deploy --guided`


## Accessing the API

To test the live endpoint, visit:
- [https://nn58gn0krl.execute-api.eu-west-2.amazonaws.com/Prod/status](https://nn58gn0krl.execute-api.eu-west-2.amazonaws.com/Prod/status)

To test the QA endpoint, visit:
- [https://2sgdfns2ng.execute-api.eu-west-2.amazonaws.com/Stage/status](https://2sgdfns2ng.execute-api.eu-west-2.amazonaws.com/Stage/status)

## Authorization

The API is protected by API Keys. In order to interact with endpoints other than the status endpoint, the following headers need to be provided:

```js
headers: {
  'calisaurus-user': 'User Name', /* e.g. j.bloggs, */ 
  'calisaurus-user-api-key': 'API KEY STRING' /* e.g XYZ-123-RTU-etc. */
}
```

To create new API keys please talk to a system administrator.

## TODO

- Create a stable Route 53 record for the API gateway URL

