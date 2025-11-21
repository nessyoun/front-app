import Link from "next/link";


export default function ActivitiesTypeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <header>
        <p style={{fontSize:"Bold"}}><Link href="/activities">Activités</Link> {">"} <Link href="/activities/manage">Gérer</Link> {">"} Types d'activités</p>
    </header>
    <main>
        {children}
    </main>
    <footer>

    </footer>
    </>
  );
}
