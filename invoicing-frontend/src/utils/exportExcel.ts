import * as XLSX from "xlsx";

export function exportToExcel<T>(
  filename: string,
  rows: T[],
  columns: { field: keyof T; label: string }[]
) {
  const data = rows.map((row) => {
    const obj: Record<string, unknown> = {};

    columns.forEach((c) => {
      obj[c.label] = row[c.field];
    });

    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

  XLSX.writeFile(workbook, filename);
}
