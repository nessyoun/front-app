import { Activity } from "@/app/entities/activity.entity";
import React from "react";



const updatedAtDateTemplate = (activity:Activity) => {
  if (!activity?.updatedAt) return <span>-</span>;

  const date = new Date(activity?.updatedAt);
  // check if date is valid
  if (isNaN(date.getTime())) return <span>-</span>;

  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formattedDate}</span>;
};

export default updatedAtDateTemplate;
