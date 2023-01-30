# 📈 ucits-ma
![image](https://user-images.githubusercontent.com/8378660/215513010-d6a14b59-3091-4300-be82-692143574ee0.png)

## About
`ucits-ma` is a small tool that allows potential investors (and curious souls like myself) to display information about Moroccan OPCVM funds (Basic information, 7-day performance, and fee structure).

➡️ **What's a UCITS?** Check AMMC's (Morocco's Securities and Exchange Commission) [document](https://www.ammc.ma/sites/default/files/AMMC_Educational%20Guide%20related%20to%20UCITS-OPCVM.pdf) to learn more.


## Project Structure
- `app`: Next.js + TRPC + Prisma project
- `db`: SQL file for tables creation
- `ucits-bot`: a collection of lambda functions that are used to scrap and update data

## Run locally
If you'd like to run `ucits-ma` locally, you have two options:

- **Docker**

If you have docker installed, simply run:
```sh
npm run dev:docker
```

If you'd like to populate the database with seed data, make sure to run the following command within the container:
```sh
npx prisma db seed
```

If you only need an instance of the ready-to-use Postgres DB, run:
```sh
npm run dev:db
```

The app will be available on `localhost:3000`, and you can access the Postgres instance for debugging purposes through `localhost:5200`.

- **Manual installation**

You will need to have a `DATABASE_URL` environment variable set for your DB connection string.

Install dependencies
```sh
cd app && npm i
```
Run the app
```sh
npm run dev
```

## Project Architecture
![archi](https://user-images.githubusercontent.com/8378660/210359350-8d40bd1f-1e96-41bc-b2c6-42f20ac28dda.png)

### Data Layer
The data layer refers to the resources dedicated to retrieve and populate data on the database instance. 

- **initDb**: A lambda function to initiate the DB instance (Creation + Seed)
- **updateFunds**: A lambda function to retrieve funds from the ASFIM website and populating them on the database. This is run daily thanks to a Cloudwatch cron event.
- **updatePerformance**: A lambda function to retrieve performance records from the ASFIM website and populating them on the database according to the available funds. This is run daily thanks to a Cloudwatch cron event.

All interactions are done securely by retrieving DB secrets from AWS Secrets Manager.

### App Layer
An EC2 instance (with PM2 & NGINX) to run the app.
_Why not AWS Amplify ?_: The app has to be in the same VPC as the RDS instance + Accessing AWS Secrets Manager is a hassle on Amplify. 

## Roadmap
WIP
