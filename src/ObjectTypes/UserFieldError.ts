import { Field, ObjectType } from "type-graphql";

// import { getConnection } from "typeorm";
@ObjectType()
export class UserFieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}
