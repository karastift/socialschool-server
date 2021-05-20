import { School } from "../entities/School";
import schoolsJson from "../assets/schools.json"; 
import { User } from "../entities/User";

export const validateSchoolLogin = async (username: string, schoolName: string) => {

    // return needed schoolInfo or errors and not null

    const schoolFromDatabase = await School.findOne({ schoolName: schoolName });

    const schools = schoolsJson.schools;
    if (!(schools.includes(schoolName)) || !schoolFromDatabase) {
        return {
            school: null,
            errors:[
                {
                    field: "school",
                    message: "Invalid school.",
                },
            ]
        }
    }
    const user = await User.findOne(
        username.includes('@')
        ? { where: { email: username, schoolId: schoolFromDatabase.id } }
        : { where: { username: username, schoolId: schoolFromDatabase.id } }
    );
    if (!user) {
        return {
            school: null,
            errors:[
                {
                    field: "school",
                    message: "Invalid school.",
                },
            ]
        }
    }

    return {
        school: schoolFromDatabase,
        errors: null,
    };
};