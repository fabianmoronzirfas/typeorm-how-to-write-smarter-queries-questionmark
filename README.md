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



This is [`index.ts`](src/index.ts). 



This is [`Spot.ts`](src/entity/Spot.ts).


This is [`Thing.ts`](src/entity/Thing.ts).


This is [`User.ts`](src/entity/User.ts).
