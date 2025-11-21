"use client";
import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Image } from "primereact/image";
import "./SideMenu.css";
import BarTool from "../bar-tool/BarTool";
import { ActiveMenu } from "./activeMenu";
import Link from "next/link";



type Props = React.PropsWithChildren<{
  activeMenu?: ActiveMenu;
}>;





const SideMenu: React.FC<Props> = ({ children, activeMenu}) => {
  const [open, setOpen] = React.useState(true);
  const WIDTH = 300;
  const [name, setName] = useState<string>(""); // SSR-safe placeholder

useEffect(() => {
  const v = typeof window !== "undefined"
    ? localStorage.getItem("fullName") || ""
    : "";
  setName(v);
}, []);

  return (
    <div className="layout">
      <BarTool onToggleSidebar={() => setOpen(o => !o)} userName={name}/>
      <Sidebar
        visible={open}
        onHide={() => setOpen(false)}
        className="side-menu"
        modal={false}               // no grey overlay
        style={{ width: WIDTH }}
      >
        <div className="logo-container">
          <Image src="WHITE.png" width="120" alt="Logo" />
        </div>
        <ul>
        <li className={activeMenu === ActiveMenu.Acceuil ? "active" : ""}>
          <Link href="/dashboard">
            <span className="pi pi-home" /> Acceuil
          </Link>
        </li>
        <li className={activeMenu === ActiveMenu.Users ? "active" : ""}>
          <Link href="/users">
            <span className="pi pi-users" /> Users
          </Link>
        </li>
        <li className={activeMenu === ActiveMenu.Roles ? "active" : ""}>
          <Link href="/roles">
            <span className="pi pi-lock" /> Roles
          </Link>
        </li>
        <li className={activeMenu === ActiveMenu.Activities ? "active" : ""}>
          <Link href="/activities">
            <span className="pi pi-trophy" /> Gestion des activités
          </Link>
        </li>
      </ul>
      <ul>
        <li className={activeMenu === ActiveMenu.Settings ? "active" : ""}>
          <Link href="/settings">
            <span className="pi pi-cog" /> Paramettre
          </Link>
        </li>
      </ul>
      </Sidebar>

      <main className={open ? "ml-300" : ""}>{children}</main>
    </div>
  );
};

export default SideMenu;
