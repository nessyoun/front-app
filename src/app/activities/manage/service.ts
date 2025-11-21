import { Activity } from "@/app/entities/activity.entity";
import { SERVER_URL } from "@/app/globals";


const backendCall = async (activity:Activity,sublink:string)=>{
    const res = await fetch(`${SERVER_URL+sublink}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user")}`,
        },
        body: JSON.stringify(activity),
      });
}




export const getAllActivities = async (): Promise<Activity[]> => {
    const res = await fetch(`${SERVER_URL}/findActivitie`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch activities");
  
    const json = (await res.json()) as any[];
  
    const activities = json.map((activity: any) => ({
      ...activity,
      createdAt: activity?.createdAt ? new Date(activity.createdAt) : undefined,
      updatedAt: activity?.updatedAt ? new Date(activity.updatedAt) : undefined,
      endDate:   activity?.endDate   ? new Date(activity.endDate)   : undefined,
    })) as Activity[];
  
    return activities;
  };
  

  export const saveActivity = async (activity:Activity)=>{
    const res= await backendCall(activity,"/createActivity");
    return res;
  }