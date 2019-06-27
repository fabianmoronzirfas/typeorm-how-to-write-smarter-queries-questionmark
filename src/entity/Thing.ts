import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
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
