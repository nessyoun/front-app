import { Activity } from "@/app/entities/activity.entity";


export const ActivityTypeTemplate = (activity: Activity) => {
    const activityTypes = activity.activityType;
    return activityTypes?.name;
  };
  
        