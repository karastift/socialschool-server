import "reflect-metadata";
import { __prod__, COOKIE_NAME } from "./constants";
import "dotenv-safe/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MyContext } from "./types";
import path from "path";
import { Upvote } from "./entities/Upvote";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { School } from "./entities/School";
import { createSchoolLoader } from "./utils/createSchoolLoader";
import { PostComment } from "./entities/PostComment";
import { PostCommentResolver } from "./resolvers/postComment";
import { Grade } from "./entities/Grade";
import { GradeResolver } from "./resolvers/grade";
import { fourNullFourPage } from "./assets/404Page";


const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [User, Post, Upvote, School, PostComment, Grade]
    });
    // await conn.runMigrations();

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set('trust proxy', 1);

    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax',
                secure: false, // cookie only works https
                // domain: __prod__ ? '.socialschool-server.com' : undefined,
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver, PostCommentResolver, GradeResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            upvoteLoader: createUpvoteLoader(),
            schoolLoader: createSchoolLoader(),
        })
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    
    app.get('/', (_, res) => res.send(fourNullFourPage));

    app.listen(parseInt(process.env.PORT), () => {
        console.log('\x1b[37m\nServer\x1b[32m started\x1b[37m on port: ' + '\x1b[33m' + `${process.env.PORT}`, '\x1b[0m\n');
    });

};

main()
.catch((e) => {
    console.log(e);
});