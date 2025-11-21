"use client";
import React, { useState, useEffect, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import { MultiSelectChangeEvent } from "primereact/multiselect";
import { useRouter } from "next/navigation";

import { COLUMNS } from "./consts";
import { renderColumn } from "../utils/functions";
import { actionTemplate } from "./components/actionTemplate";
import { createUser, deleteUser, fetchUsers } from "../utils/service";
import { mapToUserApp } from "../utils/mapperUsersToTreeNode";
import TableHeader, { type ColumnMeta } from "./components/header/header";
import { DeleteDialog } from "./components/DeleteDialog";
import UserDialog, { Form } from "./components/userDialog";

export default function BasicDemo() {
  const router = useRouter();

  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>([]);
  const [selectedUser, setSelectedUser] = useState<TreeNode | null>(null);
  const [userData, setUserData] = useState<TreeNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const emptyForm: Form = {
    matricule: "",
    cin: "",
    firstName: "",
    lastName: "",
    activated: false,
    phone: "",
    retired: false,
    retirementYear: "",
    gender: false,
    birthDate: null,
    hiringDate: null,
    collaboratorType: "",
    collaboratorStatus: "",
    score: 0,
    children: [],
    email: "",
    roles: [],
  };

  const [form, setForm] = useState<Form>(emptyForm);

  const toForm = (node: TreeNode): Form => {
    const d: any = node?.data ?? {};
    return {
      matricule: d.matricule ?? "",
      cin: d.cin ?? "",
      firstName: d.firstName ?? "",
      lastName: d.lastName ?? "",
      activated: !!d.activated,
      phone: d.phone ?? "",
      retired: !!d.retired,
      retirementYear:
        typeof d.yearOfRetirement === "number"
          ? String(d.yearOfRetirement)
          : d.yearOfRetirement ?? "",
      gender: !!d.genre,
      birthDate: d.birthDate ? new Date(d.birthDate) : null,
      hiringDate: d.haringDate ? new Date(d.haringDate) : null,
      collaboratorType: d.collabortorType ?? "",
      collaboratorStatus: d.collaboratorsStatus ?? "",
      score: typeof d.score === "number" ? d.score : d.score ?? 0,
      email: d.email ?? "",
      children: Array.isArray(d.children) ? d.children : node.children ?? [],
      roles: Array.isArray(d.roles)
        ? d.roles
            .map((r: any) => (typeof r === "string" ? r : r?.id))
            .filter(Boolean)
        : [],
    };
  };

  const handleDelete = async (user: TreeNode | null) => {
    if (!user) return;
    try {
      await deleteUser(mapToUserApp(user));
      setNodes(await fetchUsers());
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const node: TreeNode = {
      key: userData?.key ?? undefined,
      data: {
        matricule: form.matricule,
        cin: form.cin,
        firstName: form.firstName,
        lastName: form.lastName,
        activated: form.activated,
        phone: form.phone,
        retired: form.retired,
        yearOfRetirement:
          form.retirementYear === "" ? 0 : Number(form.retirementYear),
        genre: form.gender,
        birthDate: form.birthDate,
        haringDate: form.hiringDate,
        collabortorType: form.collaboratorType,
        collaboratorsStatus: form.collaboratorStatus,
        score: form.score === "" ? 0 : Number(form.score),
        email: form.email,
        children: form.children,
        roles: form.roles,
      },
      children: form.children,
    };

    try {
      setSaving(true);
      await createUser(mapToUserApp(node));
      setNodes(await fetchUsers());
      setShowEditDialog(false);
    } catch (err) {
      console.error("Create user failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    const selectedColumns = event.value as ColumnMeta[];
    const orderedSelectedColumns = COLUMNS.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/not-allowed");
      return;
    }
    fetchUsers().then((res) => {
      setNodes(res);
      // initialize visibleColumns (optional – show all by default)
      setVisibleColumns(COLUMNS);
    });
  }, [router]);

  const openAddUser = () => {
    setUserData(null);
    setForm(emptyForm);
    setShowEditDialog(true);
  };

  const header = (
    <TableHeader
      visibleColumns={visibleColumns}
      COLUMNS={COLUMNS}
      onColumnToggle={onColumnToggle}
      users={nodes.map((u) => mapToUserApp(u))}
      onImport={() => fileInputRef.current?.click()}
      onAddUser={openAddUser}
      globalFilterValue={globalFilterValue}
      onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
    />
  );

  return (
    <div className="card">
      <input type="file" ref={fileInputRef} hidden />

      <TreeTable
        value={nodes}
        header={header}
        tableStyle={{ minWidth: "50rem" }}
        size="small"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        globalFilter={globalFilterValue}
        filterMode="lenient"
      >
        <Column field="matricule" header="Matricule" expander />
        <Column field="firstName" header="Prénom" sortable  />
        <Column field="lastName" header="Nom" sortable  />
        <Column field="score" header="Score" sortable/>
        {visibleColumns.map((col: ColumnMeta) =>
          renderColumn({ ...col, filter: true }) // ensure these are filterable too
        )}
        <Column
          header="Actions"
          body={(rowData) =>
            actionTemplate(
              rowData,
              () => {
                setSelectedUser(rowData);
                setShowDeleteDialog(true);
              },
              () => {
                setUserData(rowData);
                setForm(toForm(rowData));
                setShowEditDialog(true);
              }
            )
          }
        />
      </TreeTable>

      <DeleteDialog
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={() => handleDelete(selectedUser)}
      />

      <UserDialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        form={form}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  );
}
