import { Activity } from "@/app/entities/activity.entity";
import React from "react";



const createdAtDateTemplate = (activity:Activity) => {
  if (!activity?.createdAt) return <span>-</span>;

  const date = new Date(activity?.createdAt);
  // check if date is valid
  if (isNaN(date.getTime())) return <span>-</span>;

  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formattedDate}</span>;
};

export default createdAtDateTemplate;
