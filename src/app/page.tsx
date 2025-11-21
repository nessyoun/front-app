'use client';
import { useRouter } from "next/navigation";
import { ActiveMenu } from "./shared/nav-menu/activeMenu";
import SideMenu from "./shared/nav-menu/SideMenu";
import { useEffect } from "react";
export default function Page() {
  const router= useRouter();
  useEffect(() => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      router.push('/not-allowed');
    }
  }, [router]);
  return (
    // if the localStorage does not have user item, redirect to not-allowed page
    
    <SideMenu activeMenu={ActiveMenu.Acceuil}>

    </SideMenu>
  );
}
