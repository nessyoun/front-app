import { Activity } from "./activity.entity";
import { UserApp } from "./auth/user.entity";

export interface Reservation {
    id:number;
    activity:Activity;
    userApp: UserApp ;
    paiementStatus:string;
    stan:string;
    reservationDate:Date;
}