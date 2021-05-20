import { PostComment } from "../entities/PostComment";
import { Field, ObjectType } from "type-graphql";
import { PostFieldError } from "./PostFieldError";


@ObjectType()
export class PostCommentResponse {
    @Field(() => [PostFieldError], { nullable: true })
    errors?: PostFieldError[];

    @Field(() => PostComment, { nullable: true })
    postComment?: PostComment;
}