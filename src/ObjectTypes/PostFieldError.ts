import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class PostFieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}
