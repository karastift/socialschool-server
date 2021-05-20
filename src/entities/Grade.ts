import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Grade extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    grade!: number;

    @Field()
    @Column()
    subject!: string;

    @Field()
    @Column()
    thoughts!: string;

    @Field()
    @Column()
    creatorId!: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.grades)
    creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}