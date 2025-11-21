// components/header/header.tsx
import React from "react";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import OButton from "@/app/shared/o-button/o-button";
import { exportUsersFlat } from "@/app/utils/functions";
import { UserApp } from "@/app/entities/auth/user.entity";

export type ColumnMeta = { field: string; header: string };

type TableProps = {
  visibleColumns: ColumnMeta[];
  COLUMNS: ColumnMeta[];
  onColumnToggle: (e: { value: ColumnMeta[] }) => void;
  users: UserApp[];
  onImport: () => void;
  onAddUser?: () => void;                         // <-- rename prop
  globalFilterValue: string;                      // <-- required
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // <-- required
};

const TableHeader: React.FC<TableProps> = ({
  visibleColumns,
  COLUMNS,
  onColumnToggle,
  users,
  onImport,
  onAddUser,
  globalFilterValue,
  onGlobalFilterChange,
}) => {
  return (
    <div className="flex items-center justify-between w-full gap-4 flex-nowrap">
      <div className="flex-1 max-w-[300px]">
        <IconField iconPosition="left" className="w-full">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Rechercher ..."
            className="w-full"
          />
        </IconField>
      </div>

      <div className="flex justify-center flex-1">
        <MultiSelect
          value={visibleColumns}
          options={COLUMNS}
          onChange={onColumnToggle}
          optionLabel="header"
          display="chip"
          className="min-w-[14rem] max-w-[16rem] w-full"
        />
      </div>

      <div className="flex justify-end flex-1 gap-2">
        <OButton label="Ajouter" icon="pi pi-plus" onClick={onAddUser} />
        <OButton label="Import" icon="pi pi-upload" outlined onClick={onImport} />
        <OButton label="Export" icon="pi pi-download" onClick={() => exportUsersFlat(users)} />
      </div>
    </div>
  );
};

export default TableHeader;
