import { exec } from 'child_process'

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'

import * as dotenv from 'dotenv'

dotenv.config()

const secretName = process.env.SECRET_NAME

const client = new SecretsManagerClient({
  region: 'eu-west-3',
})

let response

const getSecrets = async () => {
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      })
    )
    const secret = response.SecretString
    if (secret) {
      const parsedSecret = JSON.parse(secret)
      const password = encodeURIComponent(parsedSecret.password)
      const dbConnectionString = `DATABASE_URL=postgresql://${process.env.DB_USER}:${password}@${process.env.DB_URL}:5432/${process.env.DB_NAME}?schema=public`
      exec(`echo ${dbConnectionString} >> .env.production`, (error) => {
        if (error) {
          console.log(
            'An error occurred while setting production env variables.'
          )
          console.log(error)
        }
      })
    }
  } catch (error) {
    console.error('hmm?')
    throw error
  }
}

getSecrets()
