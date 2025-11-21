import { Activity } from "@/app/entities/activity.entity";
import React from "react";



const endDateDateTemplate = (activity:Activity) => {
  if (!activity?.endDate) return <span>-</span>;

  const date = new Date(activity?.endDate);
  // check if date is valid
  if (isNaN(date.getTime())) return <span>-</span>;

  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formattedDate}</span>;
};

export default endDateDateTemplate;
