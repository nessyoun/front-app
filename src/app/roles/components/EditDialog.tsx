import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";

export const EditDialog = ({ visible, onHide, role, handleSubmit }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const permissions = [
    { id: 1, name: "Read" },
    { id: 2, name: "Write" },
    { id: 3, name: "Execute" },
  ];

  useEffect(() => {
    setName(role?.name || "");
    setSelectedPermissions(role?.permissions || []);
  }, [role]);

  return (
    <Dialog
      header={"Modifier/Ajouter un rôle"}
      visible={visible}
      style={{ width: "30vw" }}
      onHide={onHide}
      className="edit-dialog"
    >
      <div className="form-container">
        <div className="p-field">
          <label htmlFor="name">Nom du rôle</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="p-field">
          <label htmlFor="permissions">Permissions</label>
          <MultiSelect
            id="permissions"
            value={selectedPermissions}
            options={permissions}
            onChange={(e) => setSelectedPermissions(e.value)}
            optionLabel="name"
            placeholder="Sélectionner les permissions"
            display="chip"
            className="multiselect-field"
          />
        </div>

        <Button
          label="Enregistrer"
          onClick={() => handleSubmit({ name, selectedPermissions })}
          className="submit-btn"
        />
      </div>
    </Dialog>
  );
};
