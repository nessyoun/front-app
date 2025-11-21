import { Role } from "@/app/entities/auth/role.entity";


export const PermissionTemplate = (role: Role) => {
    const permissions = role.permissions;
    return permissions?.map(p => p.name).join(', ');
  };
  
        