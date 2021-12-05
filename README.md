# Boardgames Summary API

This project contains an API for summarising boardgame play stats using AWS SAM

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
- [https://mh2mmqhf1e.execute-api.eu-west-2.amazonaws.com/Prod/status/](https://mh2mmqhf1e.execute-api.eu-west-2.amazonaws.com/Prod/status/)

## TODO

Remove the old stack:
- `https://32r96w1hxa.execute-api.eu-west-2.amazonaws.com/Prod/summary/`

