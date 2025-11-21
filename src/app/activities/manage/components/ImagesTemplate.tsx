import { Activity } from "@/app/entities/activity.entity";

export const imageBodyTemplate = (activity: Activity) => {
    return <img src={activity.images.at(0)} alt={activity.images.at(0)} className="w-6rem shadow-2 border-round" />;
};