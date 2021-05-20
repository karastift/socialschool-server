import { PostComment } from "../entities/PostComment";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { PaginatedPostComments } from "../ObjectTypes/PaginatedPostComments";
import { PostCommentResponse } from "../ObjectTypes/PostCommentResponse";

@Resolver(PostComment)
export class PostCommentResolver {

   @FieldResolver(() => User)
    creator(
        @Root() postComment: PostComment,
        @Ctx() { userLoader }: MyContext
    ) {
        return userLoader.load(postComment.creatorId);
    }

    @Query(() => PaginatedPostComments)
    async postComments(
        @Arg('limit', () => Int) limit: number,
        @Arg('postId', () => Int, ) postId: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedPostComments> {

        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne, postId];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const postComments = await getConnection().query(`
        select p.*
        from post_comment p
        where
        ${cursor ? `p."createdAt" < $3 and` : ''}
        p."postId" = $2
        order by p."createdAt" DESC 
        limit $1
        `, replacements);

        return {
            postComments: postComments.slice(0, realLimit),
            hasMore: postComments.length === realLimitPlusOne,
        };
    }

    @Query(() => PostComment, { nullable: true })
    async postComment(
        @Arg('id', () => Int) id: number
    ): Promise<PostComment | undefined> {
        return await PostComment.findOne({id: id});
    }

    @Mutation(() => PostCommentResponse)
    @UseMiddleware(isAuth)
    async createPostComment(
        @Arg('postId', () => Int) postId: number,
        @Arg('text', () => String) text: string,
        @Ctx() { req }: MyContext
    ): Promise<PostCommentResponse> {

        // add validateComment method

        const { userId } = req.session;

        const postComment = await PostComment.create({
            creatorId: userId,
            postId: postId,
            text: text,
        }).save();

        return { postComment };
    }

    @Mutation(() => PostComment)
    @UseMiddleware(isAuth)
    async updatePostComment(
        @Arg('postCommentId', () => Int) postCommentId: number,
        @Arg('text', () => String) text: string,
        @Ctx() { req }: MyContext
    ): Promise<PostComment> {
        const { userId } = req.session;

        const result = await getConnection()
            .createQueryBuilder()
            .update(PostComment)
            .set({ text })
            .where('id = :id and "creatorId" = :creatorId', {
                id: postCommentId,
                creatorId: userId,
            })
            .returning("*")
            .execute();

        return result.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePostComment(
        @Arg('id', () => Int) postCommentId: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        await PostComment.delete({ id: postCommentId, creatorId: req.session.userId });
        return true;
    }
}