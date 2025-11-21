import { Column } from "primereact/column";
import haringDateTemplate from "../users/components/haringDateTemplate";
import birthDateTemplate from "../users/components/birthDateTemplate";
import { activatedTemplate } from "../users/components/activatedTemplate";
import { retiredTemplate } from "../users/components/retiredTemplate";
import { genreTemplate } from "../users/components/genreTemplate";
import * as XLSX from "xlsx";
import { UserApp } from "../entities/auth/user.entity";
import { Child } from "../entities/child.entity";
import { RolesCell } from "../users/components/rolesTemplate";




export const renderColumn =  (col: any) => {
  switch (col.field) {
    case "haringDate":
      return (
        <Column
          key={col.field}
          header={col.header}
          body={haringDateTemplate}
          sortable
        />
      );
    case "birthDate":
      return (
        <Column
          key={col.field}
          header={col.header}
          body={birthDateTemplate}
          sortable
        />
      );
    case "roles":
      return (
        <Column
          key={col.field}
          header={col.header}
          body={RolesCell}
          sortable
        />
        
      );
    case "activated":
      return (
        <Column key={col.field} header={col.header} body={activatedTemplate} />
      );
    case "retired":
      return (
        <Column key={col.field} header={col.header} body={retiredTemplate} />
      );
    case "genre":
      return (
        <Column key={col.field} header={col.header} body={genreTemplate} />
      );
    default:
      return <Column key={col.field} field={col.field} header={col.header} />;
  }
};

function formatDate(d?: Date | null): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function exportUsersFlat(users: UserApp[]) {
  const rows = users.map((u) => ({
    matricule: u.matricule,
    cin: u.cin,
    firstName: u.firstName,
    lastName: u.lastName,
    activated: u.activated ? "Yes" : "No",
    phone: u.phone,
    retired: u.retired ? "Yes" : "No",
    yearOfRetirement: u.yearOfRetirement ?? "",
    genre: u.genre ? "M" : "F",
    birthDate: formatDate(u.birthDate),
    hiringDate: formatDate(u.haringDate),
    collaboratorType: u.collabortorType ?? "",
    collaboratorsStatus: u.collaboratorsStatus ?? "",
    score: u.score ?? "",
    email: u.email,
    roles: (u.roles || []).map((r) => r.name).join(", "),
    childrenCount: u.children?.length ?? 0,
    childrenDetails: (u.children || [])
      .map((c) => {
        const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
        const b = c.birthDate
          ? new Date(c.birthDate).toISOString().slice(0, 10)
          : "";
        return b ? `${name} (${b})` : name;
      })
      .join(" | "),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  XLSX.writeFile(workbook, "users.xlsx");
}


export async function importUsersFlat(file: File): Promise<UserApp[]> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  const users: UserApp[] = rows.map((row) => {
    const parentMatricule = (row.matricule || "").toString().trim();

    // Parse childrenDetails: "Alice Smith (2012-03-05) | Bob Doe (2015-08-20)"
    const childTokens: string[] = (row.childrenDetails || "")
      .split("|")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const children: Child[] = childTokens.map((token, idx) => {
      // match "Name (YYYY-MM-DD)" or just "Name"
      const m = token.match(/^(.+?)\s*\(([\d-]+)\)$/);
      const fullName = (m ? m[1] : token).trim();
      const dateStr = m ? m[2] : "";

      const parts = fullName.split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ");

      const birthDate = dateStr ? new Date(dateStr) : new Date("1970-01-01");

      return {
        matricule: `${parentMatricule}-${idx + 1}`,
        firstName,
        lastName,
        birthDate,
        score: 0,        // not in flat export → default
        genre: false,    // not in flat export → default
      };
    });

    const roles = (row.roles || "")
      .split(",")
      .map((r: string) => r.trim())
      .filter(Boolean)
      .map((name: string) => ({ name }));

    return {
      matricule: parentMatricule,
      cin: row.cin || "",
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      activated: String(row.activated).toLowerCase() === "yes",
      phone: row.phone || "",
      retired: String(row.retired).toLowerCase() === "yes",
      yearOfRetirement:
        row.yearOfRetirement !== undefined && row.yearOfRetirement !== ""
          ? Number(row.yearOfRetirement)
          : null,
      genre: String(row.genre).toUpperCase() === "M", // M/F from export
      birthDate: row.birthDate ? new Date(row.birthDate) : null,
      haringDate: row.hiringDate ? new Date(row.hiringDate) : null,
      collabortorType: row.collaboratorType || null,
      collaboratorsStatus: row.collaboratorsStatus || null,
      score:
        row.score !== undefined && row.score !== "" ? Number(row.score) : null,
      children,
      email: row.email || "",
      roles,
    };
  });

  return users;
}

