import { Child } from "../child.entity";
import { Role } from "./role.entity";

export interface UserApp {
    matricule: string;
    cin: string;
    firstName: string;
    lastName: string;
    activated: boolean;
    phone: string;
    retired: boolean;
    yearOfRetirement: number;
    genre: boolean;
    birthDate: Date | null; // ISO string preferred for transport
    haringDate: Date | null;
    collabortorType: string | null;
    collaboratorsStatus: string | null;
    score: number | null;
    children: Child[];
    email: string;
    roles: Role[];
    }