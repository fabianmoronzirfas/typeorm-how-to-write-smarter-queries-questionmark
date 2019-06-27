# Writing Better Queries with Typeorm? 

How can I write a better query for selecting my things (see the [stackoverflow question](https://stackoverflow.com/questions/56790133/how-can-i-optimze-my-query-to-select-things-using-querybuilder-in-typeorm))?

I have 3 enitites User, Spot and Thing.
An User can have many spots and a spot can have many things.

Currently I'm writing two queries, one to validate that the spot exists on the user and then one to get the things from the spot. (See `index.js`).

How can I write one query using `createQueryBuilder` (not using the `repo.find` ) to select all things based on `user.id` and `spot.id`? I know there is some joining involved but I can't wrap my head around it.

Steps to run this project:

1. `git clone https://github.com/fabianmoronzirfas/typeorm-how-to-write-smarter-queries-questionmark.git ./test-repo && cd test-repo`
2. Run `npm i` command
3. Setup database settings inside `ormconfig.json` file
4. start database `docker-compose up`
5. Run `npm start` command



This is `index.ts`


```js
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Spot } from './entity/Spot';
import { Thing } from './entity/Thing';

createConnection().then(async connection => {
    {
        console.log("Inserting a new data into the database...");
        const user = new User();
        const spot = new Spot();
        // const things = [];
        for (let i = 0; i < 5; i++) {
            const thing = new Thing();
            if (spot.things === undefined) {
                spot.things = [thing];
            } else {
                spot.things.push(thing);
            }
            await connection.manager.save(thing);;
        }
        user.spots = [spot];
        await connection.manager.save(user);
        await connection.manager.save(spot);
        console.log('setup done');
    }
    const spotRepo = getRepository(Spot);
    const spot = await spotRepo.createQueryBuilder('spot')
    .innerJoin('spot.user', 'user')
    .where('user.id = :id', { id: 1 })
    .getOne();
    if (spot !== undefined) {
        console.log(spot);
        console.log('Got the spot');
        const spotWithThings = await spotRepo.createQueryBuilder('spot')
        .leftJoinAndSelect('spot.things', 'things')
        .where('spot.id = :id', { id: spot.id })
        .getOne();
        console.log(spotWithThings);
    } else {
        console.log(`No spot? with user id ${1}`);
    }
}).catch(error => console.log(error));
```



this is `Spot.ts`.
```js
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from './User';
import { Thing } from './Thing';
@Entity()
export class Spot {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne( _type => User, user => user.spots)
    public user: User;
    @OneToMany(_type => Thing, (thing) => thing.spot, {
        eager: true,
      })
      public things!: Thing[];
}
```

This is Thing.ts

```js
import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Spot } from './Spot';

@Entity()
export class Thing {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( _type => Spot, spot => spot.things , {
        cascade: true,
        // eager: true,
      })
      @JoinColumn()
      public spot!: Spot;
}

```

This is `User.ts`

```js
import {Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Spot } from './Spot';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    @OneToMany(_type => Spot, spot => spot.user, {
        cascade: true,
      })
      public spots: Spot[];
}

```


this is ormconfig.json

```json
{
   "type": "postgres",
   "host": "127.0.0.1",
   "port": 5432,
   "username": "postgres",
   "password": "postgres_password",
   "database": "postgres",
   "synchronize": true,
   "dropSchema": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
```

This is my docker-compose.yml


```yml
version: '3'
services:
  postgres:
    container_name: 'pgdb'
    image: 'mdillon/postgis:10'
    ports:
      - '5432:5432'
```

This is package.json

```json
{
   "name": "typeorm-smarter-req",
   "version": "1.0.0",
   "description": "",
   "main": "index.js",
   "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "ts-node src/index.ts"
   },
   "author": "",
   "license": "ISC",
   "dependencies": {
      "pg": "^7.11.0",
      "reflect-metadata": "^0.1.10",
      "typeorm": "0.2.18"
   },
   "devDependencies": {
      "ts-node": "3.3.0",
      "@types/node": "^8.0.29",
      "typescript": "3.3.3333"
   }
}

```


this is tsconfig.json

```json
{
   "compilerOptions": {
      "lib": [
         "es5",
         "es6",
         "dom"

      ],
      "target": "es5",
      "module": "commonjs",
      "moduleResolution": "node",
      "outDir": "./build",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "sourceMap": true
   }
}
```