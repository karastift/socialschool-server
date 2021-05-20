import { UsernamePasswordInput } from "../ObjectTypes/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
    if (!options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "Email is invalid.",
            },
        ];
    }

    if (options.username.length <= 3) {
        return [
            {
                field: "username",
                message: "Username must have 4 characters.",
            },
        ];
    }

    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "Username cannot include an '@'.",
            },
        ];
    }

    if (options.password.length <= 3) {
        return [
            {
                field: "password",
                message: "Password must be longer than 3.",
            },
        ];
    }

    return null;
};