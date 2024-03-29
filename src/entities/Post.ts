import "reflect-metadata";
import { ObjectType, Field, Int } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    OneToMany
} from "typeorm";
import { PostComment } from "./PostComment";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    text!: string;

    @Field()
    @Column()
    status!: string;

    @Field()
    @Column({ type: 'int', default: 0 })
    points!: number;

    @Field(() => Int, { nullable: true })
    voteStatus: number | null; // 1 or -1 or null

    @Field()
    @Column()
    creatorId!: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.posts)
    creator: User;

    @OneToMany(() => PostComment, (postComment) => postComment.post)
    upvotes: Upvote[];

    @OneToMany(() => Upvote, (upvote) => upvote.post)
    comments: PostComment[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}