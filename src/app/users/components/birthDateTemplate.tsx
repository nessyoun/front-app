import { TreeNode } from "primereact/treenode";
import React from "react";



const birthDate = (user:TreeNode) => {
  if (!user?.data?.birthDate) return <span>-</span>;

  const date = new Date(user?.data?.birthDate);
  // check if date is valid
  if (isNaN(date.getTime())) return <span>-</span>;

  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formattedDate}</span>;
};

export default birthDate;
