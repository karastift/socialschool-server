import { GradeInput } from "../ObjectTypes/GradeInput";

export const validateGrade = (options: GradeInput) => {
    if (options.grade > 6 || options.grade < 1) {
        return [
            {
                field: "grade",
                message: "Grade is invalid.",
            },
        ];
    }

    if (options.value > 1 || options.value < 0.01) {
        return [
            {
                field: "value",
                message: "Value is invalid.",
            },
        ];
    }

    if (options.subject.length < 2 || options.subject.length > 30) {
        return [
            {
                field: "subject",
                message: "Subject is invalid.",
            },
        ];
    }

    if (options.thoughts.length > 100) {
        return [
            {
                field: "thoughts",
                message: "Thoughts are invalid.",
            },
        ];
    }

    return null;
};