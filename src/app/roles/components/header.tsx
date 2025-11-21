import OButton from "@/app/shared/o-button/o-button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { JSX } from "react";

type Props={
    globalFilterValue: string;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddRole: () => void;
};


export const Header = ({globalFilterValue,onGlobalFilterChange,onAddRole}:Props):JSX.Element => {
  return (
    <div className="flex items-center justify-between w-full gap-4 flex-nowrap">
      {/* Left: Search */}
      <div className="flex-1 max-w-[300px]">
        <IconField iconPosition="left" className="w-full">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="w-full"
          />
        </IconField>
      </div>


      {/* Right: Buttons */}
      <div className="flex justify-end flex-1 gap-2">
        <OButton label="Ajouter" icon="pi pi-plus" onClick={onAddRole} />
      </div>
    </div>
  );
};