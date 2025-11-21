import { Activity } from "@/app/entities/activity.entity";
import { Tag } from "primereact/tag";

export const statusBodyTemplate = (activity:Activity) => {
    return <Tag value={activity.status} severity={getSeverity(activity)}></Tag>;
};

const getSeverity = (activity:Activity) => {
    switch (activity.status) {
        case 'PUBLISHED':
            return 'success';

        case 'DRAFT':
            return 'warning';

        case 'ARCHIVED':
            return 'danger';

        default:
            return null;
    }
};