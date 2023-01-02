# 📈 ucits-ma
---

`ucits-ma` is a small tool that allows potential investors (and curious souls like myself) to display information about Moroccan OPCVM funds (Basic information, 7-day performance, and fee structure).

➡️ **What's a UCITS?** Check AMMC's (Morocco's Securities and Exchange Commission) document to learn more.

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
WIP

## Roadmap
WIP