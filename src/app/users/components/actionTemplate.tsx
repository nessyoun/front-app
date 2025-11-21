import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import UserDialog from "./userDialog";
import { TreeNode } from "primereact/treenode";
import { useState } from "react";
import { deleteUser } from "@/app/utils/service";
import { mapToUserApp } from "@/app/utils/mapperUsersToTreeNode";

export const actionTemplate = (user: TreeNode,onDelete:any,onEdit:any) => {
const keyStr = String(user.key ?? "");
const isParent = keyStr.length===1;
if (!isParent) return null;

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
