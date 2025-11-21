import { TreeNode } from "primereact/treenode";
import React from "react";



const haringDate = (user:TreeNode) => {
  if (!user?.data?.haringDate) return <span>-</span>;

  const date = new Date(user?.data?.haringDate);
  // check if date is valid
  if (isNaN(date.getTime())) return <span>-</span>;

  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formattedDate}</span>;
};

export default haringDate;
