import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class PostComment extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    text: string;

    @Field()
    @PrimaryColumn()
    creatorId!: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.upvotes)
    creator: User;

    @Field()
    @PrimaryColumn()
    postId: number;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.upvotes, { onDelete: 'CASCADE' })
    post: Post;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}