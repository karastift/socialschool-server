import { Post } from "../entities/Post";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Upvote } from "../entities/Upvote";
import { User } from "../entities/User";
import { PostInput } from "../ObjectTypes/PostInput";
import { validateStatus } from "../utils/validateStatus";
import { PaginatedPosts } from "../ObjectTypes/PaginatedPosts";
import { PostResponse } from "../ObjectTypes/PostResponse";

@Resolver(Post)
export class PostResolver {

    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Post
    ) {
        return root.text.substring(0, 500);
    }

   @FieldResolver(() => User)
    creator(
        @Root() post: Post,
        @Ctx() { userLoader }: MyContext
    ) {
        return userLoader.load(post.creatorId);
    }

    @FieldResolver(() => Int, { nullable: true })
    async voteStatus(
        @Root() post: Post,
        @Ctx() { req, upvoteLoader }: MyContext
    ) {
        if (!req.session.userId) {
            return null;
        }
        const upvote = await upvoteLoader.load({
            postId: post.id,
            userId: req.session.userId
        });

        return upvote ? upvote.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const isUpvote = value !== -1;
        const insertValue = isUpvote ? 1 : -1;
        const { userId } = req.session;

        const upvote = await Upvote.findOne({ where: { postId, userId } });

        // has upvotes before and is changing vote
        if (upvote && upvote.value !== insertValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                update upvote 
                set value = $1
                where "postId" = $2 and "userId" = $3
                `, [insertValue, postId, userId]);

                await tm.query(`
                update post 
                set points = points + $1
                where id = $2
                `, [2 * insertValue, postId]);
            });
        }
        // never voted before
        else if (!upvote) {
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                insert into upvote ("userId", "postId", value)
                values ($1, $2, $3)
                `, [userId, postId, insertValue]);

                await tm.query(`
                update post 
                set points = points + $1
                where id = $2
                `, [insertValue, postId]);
            });
        }
        return true;
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> {

        const realLimit = Math.min(50, limit); // fix this
        const realLimitPlusOne = realLimit + 1;
        const userSchool = req.session.userSchool ? req.session.userSchool : "public";

        const replacements: any[] = [realLimitPlusOne, "public" , userSchool];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await getConnection().query(`
        select p.*
        from post p
        where
        ${cursor ? `p."createdAt" < $4 and` : ''}
        p.status = $2 or
        p.status = $3
        order by p."createdAt" DESC 
        limit $1
        `, replacements);

        // const qb = getConnection()
        //     .getRepository(Post)
        //     .createQueryBuilder('p')
        //     .innerJoinAndSelect(
        //         "p.creator",
        //         "u",
        //         'u.id = p."creatorId"'
        //     )
        //     .orderBy('p."createdAt"', "DESC")
        //     .take(realLimit);
        // if (cursor) {
        //     qb.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
        // }

        // const posts = await qb.getMany();   

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg('id', () => Int) id: number
    ): Promise<Post | undefined> {
        return await Post.findOne(id);
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('input', () => PostInput) input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<PostResponse> {
        const errors = validateStatus(input);

        if (errors) {
            return { errors };
        }

        const post = await Post.create({
            ...input,
            creatorId: req.session.userId,
        }).save();

        return { post };
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Arg('text') text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null > {
        const userId = req.session.userId;
        const result = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({ title, text })
            .where('id = :id and "creatorId" = :creatorId', {
            id,
            creatorId: userId,
            })
            .returning("*")
            .execute();
        return result.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        await Post.delete({ id: id, creatorId: req.session.userId });
        return true;
    }
}