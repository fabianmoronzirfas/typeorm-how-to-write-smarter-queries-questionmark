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
