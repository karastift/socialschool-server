import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class School extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    schoolName!: string;

    @OneToMany(() => User, user => user.school)
    students: User[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
}