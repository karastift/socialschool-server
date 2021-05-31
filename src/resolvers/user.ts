import argon2 from "argon2";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { School } from "../entities/School";
import { User } from "../entities/User";
import { UsernamePasswordInput } from "../ObjectTypes/UsernamePasswordInput";
import { UserResponse } from "../ObjectTypes/UserResponse";
import { MyContext } from "../types";
import { sendEmail } from "../utils/sendEmail";
import { sleep } from "../utils/sleep";
import { validateRegister } from "../utils/validateRegister";
import { validateSchool } from "../utils/validateSchool";
import { validateSchoolLogin } from "../utils/validateSchoolLogin";

@Resolver(User)
export class UserResolver {

    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        if (req.session.userId === user.id) {
            return user.email;
        }
        return '';
    }

    @FieldResolver(() => School)
    school(
        @Root() user: User,
        @Ctx() { schoolLoader }: MyContext
    ) {
        return schoolLoader.load(user.schoolId);
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { redis, req }: MyContext        
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "The new password must be longer than 3.",
                    },
                ],
            };
        }

        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "The token expired.",
                    },
                ],
            };
        }

        const parsedUserId = parseInt(userId);

        const user = await User.findOne(parsedUserId);

        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "User does not exist.",
                    },
                ],
            };
        }

        await User.update(
            { id: parsedUserId },
            { password: await argon2.hash(newPassword) }
        );
        await redis.del(key);

        // log user in after changing the password
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            // sleep the time it would take to execute the code that would run if user would exist (security reasons)
            await sleep(733);
            // only return true (security reasons)
            return true;
        }

        const token = v4();

        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 24 // 1 day
        );


        await sendEmail(
            email.toLowerCase(),
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );
        return true;
    }

    @Query(() => User, { nullable: true })
    me(
        @Ctx() { req }: MyContext

    ) {
        if (!req.session.userId) {
            return null;
        }
        else {
            console.log(req.session.userSchool);
            return User.findOne(req.session.userId);
        }
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {

        const { school, errors: schoolErrors } = await validateSchool(options);
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }
        else if (schoolErrors) {
            return { errors: schoolErrors };
        }
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await User.create({
                username: options.username,
                email: options.email.toLowerCase(),
                schoolId: school!.id,
                password: hashedPassword,
            }).save();
            // const result = await getConnection()
            //     .createQueryBuilder()
            //     .insert()
            //     .into(User)
            //     .values(
            //         {
            //             username: options.username,
            //             email: options.email,
            //             password: hashedPassword,
            //         }
            //     )
            //     .returning("*")
            //     .execute();
            user = result;
        }
        catch (e) {
            if (e.code === '23505') {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'Username is already taken.',
                        },
                    ],
                };
            }
            else {
                return {
                    errors: [
                        {
                            field: 'undefined',
                            message: 'Some error.',
                        },
                    ],
                };
            }
        }
        
        req.session.userId = user?.id;
        req.session.userSchool = school?.schoolName;

        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Arg('school') enteredSchool: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const { school, errors } = await validateSchoolLogin(usernameOrEmail, enteredSchool);

        if (errors) {
            return { errors };
        }

        const user = await User.findOne(
            usernameOrEmail.includes('@')
            ? { where: { email: usernameOrEmail.toLowerCase() } }
            : { where: { username: usernameOrEmail } }
        );
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username or email is not registered on any school.'
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password is incorrect.'
                    },
                ],
            };
        }

        req.session!.userId = user.id;
        req.session!.userSchool = school?.schoolName;
        return { user };
    }
    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext   
    ) {
        return new Promise(resolve => req.session.destroy(err => {
            res.clearCookie(COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
}