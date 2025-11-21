// app/activities/page.tsx
"use client";

import { useRouter } from "next/navigation";
import SideMenu from "../shared/nav-menu/SideMenu";
import { ActiveMenu } from "../shared/nav-menu/activeMenu";
import { ActionTile } from "./ActionTitle";

export default function ActivitiesLandingPage() {
  const router = useRouter();

  return (
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-green-600 mb-12">Activités</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <ActionTile
            title="Gérer les activités"
            onClick={() => router.push("/activities/manage")}
          />
          <ActionTile
            title="Gérer les inscriptions"
            onClick={() => router.push("/activities/reservation")}
          />
        </div>
      </div>
  );
}

