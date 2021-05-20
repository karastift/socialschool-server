import { User } from "../entities/User";
import { Field, ObjectType } from "type-graphql";
import { UserFieldError } from "./UserFieldError";


@ObjectType()
export class UserResponse {
    @Field(() => [UserFieldError], { nullable: true })
    errors?: UserFieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}
