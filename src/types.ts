import { Request, Response } from "express";
import { Session, SessionData } from 'express-session';
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { createSchoolLoader } from "./utils/createSchoolLoader";

export type MyContext = {
    req: Request & { session: Session & Partial<SessionData> & { userId?: number, userSchool?: string } };
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    upvoteLoader: ReturnType<typeof createUpvoteLoader>;
    schoolLoader: ReturnType<typeof createSchoolLoader>;
};