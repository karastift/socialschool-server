import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entities/User";
import { Grade } from "../entities/Grade";
import { GradeResponse } from "../ObjectTypes/GradeResponse";
import { GradeInput } from "../ObjectTypes/GradeInput";
import { validateGrade } from "../utils/validateGrade"
import { getConnection } from "typeorm";

@Resolver(Grade)
export class GradeResolver {

   @FieldResolver(() => User)
    creator(
        @Root() grade: Grade,
        @Ctx() { userLoader }: MyContext
    ) {
        return userLoader.load(grade.creatorId);
    }

    @Query(() => [Grade], { nullable: true })
    @UseMiddleware(isAuth)
    async allGrades(
        @Ctx() { req }: MyContext
    ): Promise<Grade[] | undefined> {

        const userId = req.session.userId;

        const grades = await Grade.find(
            {
                where: {
                    creatorId: userId,
                },
                order: {
                    createdAt: "ASC",
                }
            }
        )

        return grades;
    }

    @Query(() => [Grade], { nullable: true })
    @UseMiddleware(isAuth)
    async subjectGrades(
        @Arg('subject') subject: String,
        @Ctx() { req }: MyContext
    ): Promise<Grade[] | undefined> {

        const userId = req.session.userId;

        const grades = await Grade.find(
            {
                where: {
                    creatorId: userId,
                    subject: subject,
                },
                order: {
                    createdAt: "ASC",
                }
            }
        )

        return grades;
    }

    @Query(() => [String], { nullable: true })
    @UseMiddleware(isAuth)
    async allSubjects(
        @Ctx() { req }: MyContext
    ): Promise<string[] | undefined> {

        const userId = req.session.userId;

        const grades = await Grade.find(
            {
                where: {
                    creatorId: userId,
                },
                order: {
                    createdAt: "ASC",
                }
            }
        );
        let subjects: string[] = []
        grades.map((grade) => {
            if (!subjects.includes(grade.subject)) {
                subjects.push(grade.subject)
            }
        });

        return subjects;
    }

    @Query(() => Grade, { nullable: true })
    @UseMiddleware(isAuth)
    async grade(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<Grade | undefined> {
        return await Grade.findOne({ where: { id: id, creatorId: req.session.userId } });
    }

    @Mutation(() => GradeResponse)
    @UseMiddleware(isAuth)
    async createGrade(
        @Arg('input', () => GradeInput) input: GradeInput,
        @Ctx() { req }: MyContext
    ): Promise<GradeResponse> {
        const errors = validateGrade(input);

        if (errors) {
            return { errors };
        }

        const grade = await Grade.create({
            ...input,
            creatorId: req.session.userId,
        }).save();

        return { grade };
    }

    @Mutation(() => GradeResponse)
    @UseMiddleware(isAuth)
    async updateGrade(
        @Arg('id', () => Int) id: number,
        @Arg('input', () => GradeInput) input: GradeInput,
        @Ctx() { req }: MyContext
    ): Promise<GradeResponse> {
        const errors = validateGrade(input);

        if (errors) {
            return { errors };
        }

        const userId = req.session.userId;
        const result = await getConnection()
        .createQueryBuilder()
        .update(Grade)
        .set({ grade: input.grade, subject: input.subject, thoughts: input.thoughts })
        .where('id = :id and "creatorId" = :creatorId', {
            id,
            creatorId: userId,
        })
        .returning("*")
        .execute();
        
        return { grade: result.raw[0] };
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteGrade(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        console.log(await Grade.delete({ id: id, creatorId: req.session.userId }));
        return true;
    }
}