import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const DeleteDialog = ({ visible, onHide, onConfirm }) => {
  return (
    <Dialog
      header={"Confirmer la suppression"}
      visible={visible}
      style={{ width: "25vw" }}
      onHide={onHide}
      footer={
        <div>
          <Button label="Non" icon="pi pi-times" onClick={onHide} text />
          <Button label="Oui" icon="pi pi-check" onClick={onConfirm} severity="danger" />
        </div>
      }
    >
      Vous voulez vraiment supprimer cet utilisateur?
    </Dialog>
  );
};