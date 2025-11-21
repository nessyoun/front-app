import Link from "next/link";


export default function ActivitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <header>
        <p style={{fontSize:"Bold"}}><Link href="/activities">Activités</Link> {">"} Gérer</p>
    </header>
    <main>
        {children}
    </main>
    <footer>

    </footer>
    </>
  );
}
