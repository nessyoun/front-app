
export interface ActivityType {
    id:number;
    name:string;
    collaboratorsStatus:string[]; 
    score:number;
    isForChildren:boolean;
    maxAge:number; //only for children activities
}
