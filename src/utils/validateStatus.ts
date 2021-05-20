import { PostInput } from "../ObjectTypes/PostInput";
import schoolJson from "../assets/schools.json"

const schools = schoolJson.schools;

export const validateStatus = (input: PostInput) => {
    if (!input.status) {
        return [
            {
                field: "status",
                message: "Invalid status.",
            },
        ];
    }
    if (!( schools.includes(input.status)) && input.status !== 'public') {
        return [
            {
                field: "status",
                message: "Invalid status.",
            },
        ];
    }
    if (input.title.length < 5) {
        return [
            {
                field: "title",
                message: "Too short title.",
            },
        ];
    }
    if (input.text.length < 5) {
        return [
            {
                field: "text",
                message: "Too short text.",
            },
        ];
    }
    return null;
};