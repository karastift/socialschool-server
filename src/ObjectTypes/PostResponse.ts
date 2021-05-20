import { Post } from "../entities/Post";
import { Field, ObjectType } from "type-graphql";
import { PostFieldError } from "./PostFieldError";


@ObjectType()
export class PostResponse {
    @Field(() => [PostFieldError], { nullable: true })
    errors?: PostFieldError[];

    @Field(() => Post, { nullable: true })
    post?: Post;
}
