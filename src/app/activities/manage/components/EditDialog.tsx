import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { Activity } from "./activity.entity"; // adjust path if needed
import { ActivityType } from "./activity-type.entity";

// We ignore: author, createdAt, updatedAt, views, reservation
// activityType -> MultiSelect, status -> Dropdown, collabortorsType -> MultiSelect

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

type Status = (typeof STATUS_OPTIONS)[number];

// Form payload (Activity minus ignored fields; allow multi-selects)
export type ActivityInput = Omit<
  Activity,
  "author" | "createdAt" | "updatedAt" | "views" | "reservation" | "activityType" | "collabortorsType"
> & {
  activityType: ActivityType[];
  collabortorsType: string[];
  status: Status;
  endDate: Date | null;
};

interface AddActivityFormProps {
  onSubmit: (data: ActivityInput) => void;
  activityTypeOptions?: ActivityType[];
  collaboratorTypeOptions?: string[];
  defaultValues?: Partial<ActivityInput>;
}

export const AddActivityForm: React.FC<AddActivityFormProps> = ({
  onSubmit,
  activityTypeOptions,
  collaboratorTypeOptions,
  defaultValues,
}) => {
  const [form, setForm] = useState<ActivityInput>({
    id: 0,
    title: "",
    images: [],
    content: "",
    endDate: null,
    tags: [],
    status: "DRAFT",
    activityType: [],
    collabortorsType: [],
    price: 0,
    numberPax: 1,
    ...(defaultValues as any),
  });

  const ato = activityTypeOptions ?? [];
  const cto = collaboratorTypeOptions ?? [];

  const patch = (p: Partial<ActivityInput>) => setForm((prev) => ({ ...prev, ...p }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="p-fluid grid gap-3">
      <div className="field col-12 md:col-6">
        <label htmlFor="title">Title</label>
        <InputText
          id="title"
          value={form.title}
          onChange={(e) => patch({ title: e.target.value })}
          required
        />
      </div>

      <div className="field col-12">
        <label htmlFor="content">Content</label>
        <InputTextarea
          id="content"
          value={form.content}
          onChange={(e) => patch({ content: e.target.value })}
          rows={4}
          autoResize
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="images">Images (URLs)</label>
        <Chips
          id="images"
          value={form.images}
          onChange={(e) => patch({ images: (e.value as string[]) ?? [] })}
          separator="," // allow comma-separated paste
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="tags">Tags</label>
        <Chips
          id="tags"
          value={form.tags}
          onChange={(e) => patch({ tags: (e.value as string[]) ?? [] })}
          separator="," 
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          value={form.status}
          options={STATUS_OPTIONS}
          onChange={(e) => patch({ status: e.value as Status })}
          placeholder="Select status"
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="endDate">End Date</label>
        <Calendar
          id="endDate"
          value={form.endDate}
          onChange={(e) => patch({ endDate: (e.value as Date) ?? null })}
          showIcon
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="price">Price</label>
        <InputNumber
          id="price"
          value={form.price}
          onValueChange={(e) => patch({ price: (e.value as number) ?? 0 })}
          min={0}
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="numberPax">Number of Pax</label>
        <InputNumber
          id="numberPax"
          value={form.numberPax}
          onValueChange={(e) => patch({ numberPax: (e.value as number) ?? 0 })}
          min={0}
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="activityType">Activity Type</label>
        <MultiSelect
          id="activityType"
          value={form.activityType}
          options={ato}
          optionLabel={(opt: any) => opt?.name ?? opt?.label ?? String(opt?.id ?? "")}
          onChange={(e) => patch({ activityType: (e.value as ActivityType[]) ?? [] })}
          display="chip"
          placeholder="Select types"
        />
      </div>

      <div className="field col-12 md:col-6">
        <label htmlFor="collabs">Collaborators Type</label>
        <MultiSelect
          id="collabs"
          value={form.collabortorsType}
          options={cto}
          onChange={(e) => patch({ collabortorsType: (e.value as string[]) ?? [] })}
          display="chip"
          placeholder="Select collaborators"
        />
      </div>

      <div className="col-12">
        <Button type="submit" label="Create Activity" />
      </div>
    </form>
  );
};

// =========================
// Dialog wrapper component
// =========================
export interface EditDialogProps {
  visible: boolean;
  onHide: () => void;
  handleSubmit: (data: ActivityInput) => void;
  activity?: Partial<ActivityInput> | null; // pre-filled values
  activityTypeOptions?: ActivityType[];
  collaboratorTypeOptions?: string[];
  title?: string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  visible,
  onHide,
  handleSubmit,
  activity,
  activityTypeOptions,
  collaboratorTypeOptions,
  title = "Add Activity",
}) => {
  return (
    <Dialog
      header={title}
      visible={visible}
      onHide={onHide}
      modal
      style={{ width: "50rem", maxWidth: "95vw" }}
    >
      <AddActivityForm
        onSubmit={(data) => {
          handleSubmit(data);
          onHide();
        }}
        activityTypeOptions={activityTypeOptions}
        collaboratorTypeOptions={collaboratorTypeOptions}
        defaultValues={activity ?? undefined}
      />
    </Dialog>
  );
};

export default EditDialog;
