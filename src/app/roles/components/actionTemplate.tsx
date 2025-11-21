import { Role } from "@/app/entities/auth/role.entity";
import { Button } from "primereact/button";

export const actionTemplate = (role: Role,onDelete:any,onEdit:any) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        icon="pi pi-pencil"
        severity="success"
        rounded
        outlined
        onClick={onEdit}
      ></Button>
      <Button
        type="button"
        icon="pi pi-trash"
        severity="danger"
        rounded
        onClick={onDelete}
        outlined
      ></Button>
    </div>
  );
};
