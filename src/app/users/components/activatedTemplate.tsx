import { Tag } from "primereact/tag";
import { TreeNode } from "primereact/treenode";

const getSeverity = (user: TreeNode) => {
    return user?.data?.activated ? "success" : "danger"
};
export const activatedTemplate = (user: TreeNode) => {
    return <Tag value={user?.data?.activated ? "Active": "Désactivé"} severity={getSeverity(user)}></Tag>;
};
        