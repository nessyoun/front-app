import { TreeNode } from "primereact/treenode";


export const RolesCell = (user: TreeNode) => {
    const roles = user?.data?.roles;
    return roles?.map(p => p.name).join(', ');
  };
  
