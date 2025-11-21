"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import { SERVER_URL } from "@/app/globals";

export interface ActivityType {
  id: number;
  name: string;
  collaboratorsStatus: string[];
  score: number;
  isForChildren: boolean;
  maxAge: number; // only for children activities
}

type ActivityTypeForm = Omit<ActivityType, "id"> & { id?: number };

const API = SERVER_URL;
const STATUS_VALUES = ["MARRIED", "SINGLE", "DIVORCED"];
const STATUS_OPTIONS = STATUS_VALUES.map((s) => ({ label: s, value: s }));

async function listTypes(): Promise<ActivityType[]> {
  const r = await fetch(API + "/findAllActivityType", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user")}`,
    },
  });
  if (!r.ok) throw new Error("Failed to load");
  return r.json();
}
async function saveType(payload: ActivityTypeForm): Promise<ActivityType> {
  const r = await fetch(API + "/createActivityType", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user")}`,
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Save failed");
  return r.json();
}
async function deleteTypeByName(name: string): Promise<void> {
  const r = await fetch(
    `${API}/deleteActivityType/${encodeURIComponent(name)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    }
  );
  if (!r.ok) throw new Error("Delete failed");
}

export default function ActivityTypesPage() {
  const [items, setItems] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [form, setForm] = useState<ActivityTypeForm>({
    id: undefined,
    name: "",
    collaboratorsStatus: [],
    score: 0,
    isForChildren: false,
    maxAge: 0,
  });
  const [toDelete, setToDelete] = useState<ActivityType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listTypes();
        setItems(data);
      } catch {
        // no-op for brevity
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.collaboratorsStatus.some((s) => s.toLowerCase().includes(q)) ||
        String(t.score).includes(q) ||
        (t.isForChildren ? "children" : "adult").includes(q)
    );
  }, [items, search]);

  const openAdd = () => {
    setForm({
      id: undefined,
      name: "",
      collaboratorsStatus: [],
      score: 0,
      isForChildren: false,
      maxAge: 0,
    });
    setEditVisible(true);
  };

  const openEdit = (row: ActivityType) => {
    setForm({ ...row });
    setEditVisible(true);
  };

  const confirmDelete = (row: ActivityType) => {
    setToDelete(row);
    setDeleteVisible(true);
  };

  const submitForm = async () => {
    // simple guard
    if (!form.name.trim()) return;
    if (form.isForChildren && (!form.maxAge || form.maxAge <= 0)) return;

    try {
      const saved = await saveType(form);
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id);
        if (idx >= 0) {
          const clone = prev.slice();
          clone[idx] = saved;
          return clone;
        }
        return [saved, ...prev];
      });
      setEditVisible(false);
    } catch {
      // no-op for brevity
    }
  };

  const doDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteTypeByName(toDelete.name);
      setItems((prev) => prev.filter((p) => p.name !== toDelete.name));
    } catch {
      // no-op for brevity
    } finally {
      setDeleteVisible(false);
      setToDelete(null);
    }
  };

  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        className="p-input-icon-left"
        style={{ width: 320, maxWidth: "100%" }}
      >
        <i className="pi pi-search" />
        <InputText
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{ width: "100%" }}
        />
      </span>
      <Button label="Add" severity="success" icon="pi pi-plus" onClick={openAdd} />
    </div>
  );

  const statusesBody = (row: ActivityType) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {row.collaboratorsStatus?.map((s) => (
        <Tag key={s} value={s} />
      ))}
    </div>
  );

  const childrenBody = (row: ActivityType) =>
    row.isForChildren ? (
      <Tag value="Yes" severity="success" />
    ) : (
      <Tag value="No" severity="secondary" />
    );

  const actionsBody = (row: ActivityType) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => openEdit(row)}
        title="Edit"
        text
      />
      <Button
        icon="pi pi-trash"
        onClick={() => confirmDelete(row)}
        title="Delete"
        severity="danger"
        text
      />
    </div>
  );

  const editFooter = (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <Button label="Cancel" text onClick={() => setEditVisible(false)} />
      <Button label="Save" icon="pi pi-check" onClick={submitForm} />
    </div>
  );

  const deleteFooter = (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <Button label="No" text onClick={() => setDeleteVisible(false)} />
      <Button
        label="Yes, delete"
        icon="pi pi-trash"
        severity="danger"
        onClick={doDelete}
      />
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={filtered}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        dataKey="id"
        header={header}
        emptyMessage="No activity types found."
        responsiveLayout="scroll"
      >
        <Column field="name" header="Name" sortable />
        <Column header="Statuses" body={statusesBody} />
        <Column field="score" header="Score" sortable />
        <Column header="Children" body={childrenBody} />
        <Column
          header="Max Age"
          body={(row: ActivityType) => (row.isForChildren ? row.maxAge : "-")}
          style={{ width: 120 }}
        />
        <Column
          header="Actions"
          body={actionsBody}
          style={{ width: 150, textAlign: "center" }}
        />
      </DataTable>

      <Dialog
        header={form.id ? "Edit Activity Type" : "Add Activity Type"}
        visible={editVisible}
        style={{ width: "34rem", maxWidth: "95vw" }}
        modal
        onHide={() => setEditVisible(false)}
        footer={editFooter}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="name" className="p-d-block">
              Name
            </label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Hiking"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="p-d-block">Collaborator Status</label>
            <MultiSelect
              value={form.collaboratorsStatus}
              options={STATUS_OPTIONS}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  collaboratorsStatus: (e.value as string[]) ?? [],
                }))
              }
              display="chip"
              filter
              placeholder="Select..."
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="p-d-block">Score</label>
            <InputNumber
              value={form.score}
              min={0}
              useGrouping={false}
              onValueChange={(e) =>
                setForm((f) => ({ ...f, score: Number(e.value ?? 0) }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Checkbox
              inputId="children"
              checked={form.isForChildren}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  isForChildren: !!e.checked,
                  maxAge: f.maxAge ?? 0,
                }))
              }
            />
            <label htmlFor="children">Is for children</label>
          </div>

          <div>
            <label className="p-d-block">Max Age (for children)</label>
            <InputNumber
              value={form.maxAge}
              min={0}
              useGrouping={false}
              disabled={!form.isForChildren}
              onValueChange={(e) =>
                setForm((f) => ({ ...f, maxAge: Number(e.value ?? 0) }))
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Confirm Delete"
        visible={deleteVisible}
        style={{ width: "28rem", maxWidth: "95vw" }}
        modal
        onHide={() => setDeleteVisible(false)}
        footer={deleteFooter}
      >
        <p>
          Delete <b>{toDelete?.name}</b>?
        </p>
      </Dialog>
    </div>
  );
}
