import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    type: "postgresql",
    dbName: "discussmyschool",
    user: "postgres",
    password: "postgres",
    debug: __prod__,
    entities: [Post, User]

} as Parameters<typeof MikroORM.init>[0];