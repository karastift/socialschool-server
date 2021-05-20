import { PostComment } from "../entities/PostComment";
import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class PaginatedPostComments {
    @Field(() => [PostComment])
    postComments: PostComment[];
    @Field()
    hasMore: boolean;
}
