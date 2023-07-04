![logo](tasktrail/public/media/images/imagotype.png)

A quick and easy-to-use note taking app.

## Installation
```sh
$ git clone https://github.com/icutum/tasktrail.git
$ cd tasktrail/tasktrail
$ npm install
```
Before running the application, make sure you create a `.env` file in the root folder of the project, and set it up according to the variables provided in the `.env.example` file.

You will need to set up the database accordingly, in case you're using MariaDB, it goes as follows:

```sql
CREATE DATABASE <database>;
CREATE USER '<user>'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON *.* TO '<user>'@'localhost' WITH GRANT OPTION;
```

Make sure to grant privileges to every database (`*.*`), otherwise, the ORM won't work. To allow it to function properly, generate the Prisma client, then make the migrations:

```sh
$ npx prisma generate
$ npx prisma migrate dev
```

In case you don't see a message in the terminal saying `The seed command has been executed.`, run the following command:
```sh
$ npx prisma db seed
```

Running the `deleteExpriedTokens.sql` script under `tasktrail/prisma/events` is not necessary, but recommended so that the tokens table doesn't flood with expired tokens.

To run the development server, run the following command:
```sh
$ npm run build:dev
```

## People
This project was developed by [byeejasonn](https://github.com/byeejasonn), [LDanielCG](https://github.com/LDanielCG) and [icutum](https://github.com/icutum), three spanish students of the vocational course of Web Application Development for our final degree work.