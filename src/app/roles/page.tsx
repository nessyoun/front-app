"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Role } from "../entities/auth/role.entity";
import { getRoles } from "../utils/service";
import { actionTemplate } from "./components/actionTemplate";
import { DeleteDialog } from "./components/DeleteDialog";
import { deleteRole } from "./service";
import { EditDialog } from "./components/EditDialog";
import { PermissionTemplate } from "./components/PermissionTemplate";
import { Header } from "./components/header";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedNode,setSelectedNode] = useState<Role>();
  const [showDeleteDialog,setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);



  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  const handleDelete = async (role: Role | undefined) => {
    if (!role) return;
    try {
      await deleteRole(role);
      setRoles(await getRoles());
      console.log(roles);
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteDialog(false);
    }
  };


  const header = <Header globalFilterValue="" onGlobalFilterChange={()=>{}} onAddRole={()=>{return setShowEditDialog(true);}} />;
  return (
    <div className="card">
      <DataTable value={roles} tableStyle={{ minWidth: "50rem" }} header={header}>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Permissions" body={PermissionTemplate}></Column>
        <Column
          header="Actions"
          body={(rowData) =>
            actionTemplate(
              rowData,
              () => {
                setSelectedNode(rowData);
                setShowDeleteDialog(true);
              },
              () => {
                setSelectedNode(rowData);
                setShowEditDialog(true);
              }
            )
          }
        />
      </DataTable>
      <DeleteDialog onConfirm={() => handleDelete(selectedNode)} onHide={()=>{setShowDeleteDialog(false)}} visible={showDeleteDialog} />
      <EditDialog handleSubmit={()=>{}} visible={showEditDialog} onHide={()=>setShowEditDialog(false)} role={selectedNode}/>
    </div>
  );
}
