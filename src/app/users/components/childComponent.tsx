import React from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";

type Props = {
  child: any;         // keep your Child type if you have it
  parentMat: string;
  onChange: (next: any) => void;
  onRemove?: () => void;
};

export default function ChildForm({ child, parentMat, onChange, onRemove }: Props) {
  // read directly from top-level
  const data = child ?? {};

  // write to top-level (not child.data)
  const setData = (key: string, value: any) =>
    onChange({ ...(child ?? {}), [key]: value });

  // Calendar expects Date | null for display
  const birthDateValue: Date | null =
    data.birthDate
      ? data.birthDate instanceof Date
        ? data.birthDate
        : new Date(data.birthDate as string)
      : null;

  // store date as ISO yyyy-MM-dd
  const toISODate = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 border-1 surface-border border-round">
      <div className="flex items-center gap-2">
        <label htmlFor="matricule">Matricule:</label>
        <InputText
          id="matricule"
          value={data.matricule ?? ""}
          onChange={(e) => setData("matricule", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="firstName">First Name:</label>
        <InputText
          id="firstName"
          value={data.firstName ?? ""}
          onChange={(e) => setData("firstName", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="lastName">Last Name:</label>
        <InputText
          id="lastName"
          value={data.lastName ?? ""}
          onChange={(e) => setData("lastName", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="birthDate">Birth Date:</label>
        <Calendar
          id="birthDate"
          value={birthDateValue}
          onChange={(e) => setData("birthDate", toISODate(e.value as Date | null))}
          showIcon
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="score">Score:</label>
        <InputText
          id="score"
          value={data.score ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setData("score", v === "" ? null : Number(v));
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="gender">Gender:</label>
        <ToggleButton
          id="gender"
          onIcon="pi pi-mars"
          offIcon="pi pi-venus"
          offLabel="Female"
          onLabel="Male"
          checked={!!data.genre}                       
          onChange={(e) => setData("genre", e.value as boolean)}
          className="w-10rem"
        />
      </div>

      {onRemove && (
        <Button
          type="button"
          icon="pi pi-trash"
          label="Remove"
          severity="danger"
          onClick={onRemove}
        />
      )}
    </div>
  );
}
