import { Field, InputType } from "type-graphql";

@InputType()
export class GradeInput {
    @Field()
    grade!: number;

    @Field()
    subject!: string;

    @Field()
    thoughts: string;

    @Field()
    value: number;
}