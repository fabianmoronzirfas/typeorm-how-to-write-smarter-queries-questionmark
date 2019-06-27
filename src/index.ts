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
    const spot = await spotRepo.createQueryBuilder('spot').innerJoin('spot.user', 'user').where('user.id = :id', { id: 1 }).getOne();
    if (spot !== undefined) {
        console.log(spot);
        console.log('Got the spot');
        const spotWithThings = await spotRepo.createQueryBuilder('spot').leftJoinAndSelect('spot.things', 'things').where('spot.id = :id', { id: spot.id }).getOne();
        console.log(spotWithThings);
    } else {
        console.log(`No spot? with user id ${1}`);
    }
}).catch(error => console.log(error));
