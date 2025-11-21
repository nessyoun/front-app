// UserDialog.tsx
"use client";
import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ChildForm from "./childComponent";
import { Child } from "@/app/entities/child.entity";
import { getRoles } from "@/app/utils/service";

export type RoleOpt = { id: string; name: string };

export type Form = {
  matricule: string;
  cin: string;
  firstName: string;
  lastName: string;
  activated: boolean;
  phone: string;
  retired: boolean;
  retirementYear: number | "";
  gender: boolean;
  birthDate: Date | null;
  hiringDate: Date | null;
  collaboratorType: "HC" | "TAMCA" | "OEE" | "";
  collaboratorStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "";
  score: number | "";
  children: Child[];
  email: string;
  roles: string[]; // store role ids
};

type Props = {
  visible: boolean;
  onHide: () => void;
  header?: string;
  form: Form;
  onFormChange: (next: Form) => void;
  onSubmit: (e?: React.FormEvent) => void; // your handleSubmit
  saving?: boolean;
};

const STATUS_OPTS = ["SINGLE", "MARRIED", "DEVORCED"] as const;
const TYPE_OPTS = ["HC", "TAMCA", "OEE"] as const;

const emptyChild = (): Child =>
  ({
    matricule: "",
    firstName: "",
    lastName: "",
    birthDate: null,
    score: 0,
    genre: false,
  } as unknown as Child);

export default function UserDialog({
  visible,
  onHide,
  header = "Ajouter / Modifier l’utilisateur",
  form,
  onFormChange,
  onSubmit,
  saving = false,
}: Props) {
  const [roleOpts, setRoleOpts] = React.useState<RoleOpt[]>([]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    onFormChange({ ...form, [k]: v });

  useEffect(() => {
    (async () => {
      try {
        const data = await getRoles(); // [{id,name}]
        setRoleOpts(data ?? []);
      } catch (e) {
        console.error("Failed to load roles", e);
      }
    })();
  }, []);

  const addChild = () => set("children", [...(form.children ?? []), emptyChild()]);
  const removeChild = (idx: number) =>
    set("children", form.children.filter((_, i) => i !== idx));
  const updateChild = (idx: number, next: Child) =>
    set("children", form.children.map((c, i) => (i === idx ? next : c)));

  return (
    <Dialog
      header={header}
      visible={visible}
      maximizable
      className="w-[90vw] sm:w-[70vw] md:w-[50vw]"
      onHide={onHide}
    >
      <form className="p-fluid grid formgrid gap-3" onSubmit={onSubmit}>
        {/* text inputs */}
        <div className="col-12 md:col-6">
          <label htmlFor="matricule" className="block mb-2">Matricule</label>
          <InputText id="matricule" value={form.matricule} onChange={(e) => set("matricule", e.target.value)} />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="cin" className="block mb-2">CIN</label>
          <InputText id="cin" value={form.cin} onChange={(e) => set("cin", e.target.value)} />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="firstName" className="block mb-2">First Name</label>
          <InputText id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="lastName" className="block mb-2">Last Name</label>
          <InputText id="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="phone" className="block mb-2">Phone</label>
          <InputText id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="retirementYear" className="block mb-2">Year of Retirement</label>
          <InputText
            id="retirementYear"
            type="number"
            value={form.retirementYear === "" ? "" : Number(form.retirementYear)}
            onChange={(e) => set("retirementYear", e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        {/* collaborator type */}
        <div className="col-12 md:col-6">
          <label htmlFor="collaboratorType" className="block mb-2">Collaborator Type</label>
          <Dropdown
            id="collaboratorType"
            value={form.collaboratorType}
            options={TYPE_OPTS.map(v => ({ label: v, value: v }))}
            onChange={(e) => set("collaboratorType", e.value)}
            placeholder="Select type"
            className="w-full"
          />
        </div>

        {/* collaborator status */}
        <div className="col-12 md:col-6">
          <label htmlFor="collaboratorStatus" className="block mb-2">Collaborator Status</label>
          <Dropdown
            id="collaboratorStatus"
            value={form.collaboratorStatus}
            options={STATUS_OPTS.map(v => ({ label: v, value: v }))}
            onChange={(e) => set("collaboratorStatus", e.value)}
            placeholder="Select status"
            className="w-full"
          />
        </div>

        {/* score */}
        <div className="col-12 md:col-6">
          <label htmlFor="score" className="block mb-2">Score</label>
          <InputText
            id="score"
            type="number"
            value={form.score === "" ? 0 : Number(form.score)}
            onChange={(e) => set("score", e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="email" className="block mb-2">Email</label>
          <InputText id="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>

        {/* toggles */}
        <div className="col-12 md:col-6">
          <label className="block mb-2">Activated</label>
          <ToggleButton onIcon="pi pi-check" offIcon="pi pi-times" checked={form.activated} onChange={(e) => set("activated", e.value as boolean)} className="w-10rem" />
        </div>

        <div className="col-12 md:col-6">
          <label className="block mb-2">Retired</label>
          <ToggleButton onIcon="pi pi-check" offIcon="pi pi-times" checked={form.retired} onChange={(e) => set("retired", e.value as boolean)} className="w-10rem" />
        </div>

        {/* dates */}
        <div className="col-12 md:col-6">
          <label htmlFor="birthDate" className="block mb-2">Birth Date</label>
          <Calendar id="birthDate" value={form.birthDate} onChange={(e) => set("birthDate", e.value as Date | null)} showIcon />
        </div>

        <div className="col-12 md:col-6">
          <label htmlFor="hiringDate" className="block mb-2">Hiring Date</label>
          <Calendar id="hiringDate" value={form.hiringDate} onChange={(e) => set("hiringDate", e.value as Date | null)} showIcon />
        </div>

        {/* gender */}
        <div className="col-12 md:col-6">
          <label htmlFor="gender" className="block mb-2">Gender</label>
          <ToggleButton
            onIcon="pi pi-mars"
            offIcon="pi pi-venus"
            offLabel="Female"
            onLabel="Male"
            checked={form.gender}
            onChange={(e) => set("gender", e.value as boolean)}
            className="w-10rem"
          />
        </div>

        {/* roles */}
        <div className="col-12">
          <label htmlFor="roles" className="block mb-2">Roles</label>
          <MultiSelect
            id="roles"
            value={form.roles}
            options={roleOpts.map(r => ({ label: r.name, value: r.id }))}
            onChange={(e) => set("roles", e.value as string[])}
            placeholder="Select roles"
            display="chip"
            className="w-full"
          />
        </div>

        {/* children */}
        <fieldset className="col-12">
          <legend>Les informations des enfants :</legend>
          {(form.children ?? []).map((child, i) => (
            <div key={i} className="mb-3">
              <ChildForm
                child={child}
                parentMat={form.matricule}
                onChange={(next) => updateChild(i, next)}
                onRemove={() => removeChild(i)}
              />
            </div>
          ))}
          <Button label="Add child" severity="success" icon="pi pi-plus" type="button" onClick={addChild} />
        </fieldset>

        <div className="col-12 flex justify-content-end gap-2">
          <Button label="Cancel" type="button" icon="pi pi-times" onClick={onHide} />
          <Button label={saving ? "Saving..." : "Submit"} icon="pi pi-check" type="submit" disabled={saving} />
        </div>
      </form>
    </Dialog>
  );
}
