import { Tag } from "primereact/tag";
import { TreeNode } from "primereact/treenode";


export const genreTemplate = (user: TreeNode) => {
    const genre = user?.data?.genre;
    return <p className={genre? "pi pi-mars":"pi pi-venus"}> {genre? "Male": "Female"}</p>;
};
        