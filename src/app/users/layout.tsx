import { ActiveMenu } from "../shared/nav-menu/activeMenu";
import SideMenu from "../shared/nav-menu/SideMenu";
import "primeflex/primeflex.css";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SideMenu activeMenu={ActiveMenu.Users}>
        {children}
    </SideMenu>
  );
}
