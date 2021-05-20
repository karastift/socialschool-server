import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToOne
} from "typeorm";
import { Grade } from "./Grade";
import { Post } from "./Post";
import { School } from "./School";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Field()
    @Column()
    schoolId!: number;

    @ManyToOne(() => School, school => school.students)
    school: School;

    @OneToMany(() => Grade, grade => grade.creator)
    grades: Grade[];

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @OneToMany(() => Upvote, (upvote) => upvote.user)
    upvotes: Upvote[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}