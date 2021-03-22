# API

## Prerequisites

- Node.js (min v12.x)
- Database (PostgreSQL only)

## Installation
```bash
npm install
```

Rename ".env.example" to ".env" and configure it.

## Some things to known

API will retrieve the identifiers for the database in the ".env" file.

**🔴 WARNING! sequelize-cli** does not use the ".env" file but sequelize.config.json located here: [/src/Database/Configs/sequelize.config.json](/src/Database/Configs/sequelize.config.json)

If sequelize.config.json doesn't exist, run:
```sh
npx sequelize init
```

## Initialize database

Drop your database if exist:
```sh
npx sequelize db:drop
```

Create your database:
```sh
npx sequelize db:create
```

Migrate all:
```sh
npx sequelize db:migrate
```

## Development

Open your favorite Terminal and run these commands.

First tab:
```sh
npm run webpack
``` 
Second tab:
```sh
npm start
```

## Building for production
Coming soon...
