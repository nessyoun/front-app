import { ActivityType } from "./activity-type.entity";
import { UserApp } from "./auth/user.entity";
import { Reservation } from "./reservation.entity";

export interface Activity
{
    id:number;//
    title:string;//
    images: string[] ;//
    content: string ;//
    author: UserApp ;
    createdAt:Date;//
    updatedAt:Date;//
    endDate:Date;//
    tags:string[];
    views:number;//
    status:string;//
    activityType:ActivityType;
    collabortorsType:string[];//
    price:number;//
    numberPax:number;//
    reservation:Reservation[];
}