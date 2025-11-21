import { Tag } from "primereact/tag";
import { TreeNode } from "primereact/treenode";

const getSeverity = (user: TreeNode) => {
    return user?.data?.retired ? "danger" : "success"
};
export const retiredTemplate = (user: TreeNode) => {
    return <Tag value={user?.data?.retired ? "Retraité": "Active"} severity={getSeverity(user)}></Tag>;
};
        