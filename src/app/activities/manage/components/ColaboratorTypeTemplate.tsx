import { Activity } from "@/app/entities/activity.entity";


export const CollaboratorsTypeTemplate = (activity: Activity) => {
    const collabortorsTypes = activity.collabortorsType;
    return collabortorsTypes?.map(p => p).join(', ');
  };
  
        