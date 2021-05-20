import DataLoader from "dataloader";
import { School } from "../entities/School";

export const createSchoolLoader = () => 
    new DataLoader<number, School | null>(
        async keys => {
            const schools = await School.findByIds(keys as any);
            const schoolIdsToSchool: Record<number, School> = {};

            schools.forEach(s => {
                schoolIdsToSchool[s.id] = s;
            });

            return keys.map(userId => schoolIdsToSchool[userId]);
});