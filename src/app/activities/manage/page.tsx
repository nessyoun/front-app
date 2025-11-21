"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { actionTemplate } from "./components/actionTemplate";
import { DeleteDialog } from "./components/DeleteDialog";
import AddActivityForm from "./components/EditDialog";
import { Header } from "./components/header";
import { Activity } from "@/app/entities/activity.entity";
import { getAllActivities, saveActivity } from "./service";
import { CollaboratorsTypeTemplate } from "./components/ColaboratorTypeTemplate";
import { imageBodyTemplate } from "./components/ImagesTemplate";
import endDateDateTemplate from "./components/endAtDateTemplate";
import createdAtDateTemplate from "./components/createdAtDateTemplate";
import updatedAtDateTemplate from "./components/updatedAtDateTemplate";
import { statusBodyTemplate } from "./components/statusTemplate";
import { ActivityTypeTemplate } from "./components/activityTypeTemplate";

export default function RoleManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedNode, setSelectedNode] = useState<Activity>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    getAllActivities().then(setActivities);
  }, []);


  const handleSubmit = async (activity:Activity)=>{
      if(!activity) return
      try{
        await saveActivity(activity);
        setActivities(await getAllActivities())
      }catch(error)
      {
      console.error(error);
    } finally {
      setShowEditDialog(false);
    }
  }
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

  const header = (
    <Header
      globalFilterValue=""
      onGlobalFilterChange={() => {}}
      onAddRole={() => {
        return setShowEditDialog(true);
      }}
    />
  );
  return (
    <div className="card">
      <DataTable
        value={activities}
        tableStyle={{ minWidth: "50rem" }}
        header={header}
      >
        <Column field="title" header="Titre"></Column>
        <Column field="content" header="Contenue"></Column>
        <Column field="views" header="Vues"></Column>
        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
        <Column field="price" header="Prix"></Column>
        <Column field="endDate" header="Date de fin" body={endDateDateTemplate}></Column>
        <Column field="collabortorsType" header="Type de collaborateurs" body={CollaboratorsTypeTemplate}></Column>
        <Column field="images" header="Images" body={imageBodyTemplate}></Column>
        <Column field="createdAt" header="Date de création" body={createdAtDateTemplate}></Column>
        <Column field="updatedAt" header="Date de modification" body={updatedAtDateTemplate}></Column>
        <Column field="activityType" header="Type" body={ActivityTypeTemplate}></Column>
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
      <DeleteDialog
        onConfirm={() => handleDelete(selectedNode)}
        onHide={() => {
          setShowDeleteDialog(false);
        }}
        visible={showDeleteDialog}
      />
      <AddActivityForm
        handleSubmit={handleSubmit}
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        activity={selectedNode}
      />
    </div>
  );
}
