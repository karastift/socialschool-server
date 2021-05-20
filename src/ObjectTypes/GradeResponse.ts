import { Field, ObjectType } from "type-graphql";
import { PostFieldError } from "./PostFieldError";
import { Grade } from "../entities/Grade";


@ObjectType()
export class GradeResponse {
    @Field(() => [PostFieldError], { nullable: true })
    errors?: PostFieldError[];

    @Field(() => Grade, { nullable: true })
    grade?: Grade;
}
