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
