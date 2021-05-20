import { UsernamePasswordInput } from "src/ObjectTypes/UsernamePasswordInput";
import { School } from "../entities/School";
import schoolsJson from "../assets/schools.json"; 

export const validateSchool = async (options: UsernamePasswordInput) => {

    const schools = schoolsJson.schools;
    const school = await School.findOne({ where: { schoolName: options.school } });
    if (!(schools.includes(options.school))) {
        return {
            errors: [
                {
                    field: "school",
                    message: "Invalid school.",
                },
            ],
            school: null,
        };
    }
    else if (!school) {
        const createdSchool = await School.create({
            schoolName: options.school,
        }).save();

        return {
            errors: null,
            school: createdSchool,
        };
    }
    else {
        return {
            errors: null,
            school: school,
        };
    }
};