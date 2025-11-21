"use client";

import { useEffect, useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Activity } from "@/app/entities/activity.entity";
import { getAllActivities } from "../../manage/service";
import { label } from "framer-motion/client";

export const ActivityTemplate = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllActivities();
        data.map((a:Activity)=>({
            label: a.tags,
            value: a.id,
        }));
        setActivities(data);
      } catch (err) {
        console.error("Failed to load activities", err);
      }
    };
    load();
  }, []); // <-- important: run once

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedActivity}
        onChange={(e: DropdownChangeEvent) => setSelectedActivity(e.value)}
        options={activities}
        optionLabel="name"
        placeholder="Select an activity"
        className="w-full md:w-14rem"
      />
    </div>
  );
};
