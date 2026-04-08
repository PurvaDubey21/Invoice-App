export function exportToCsv<T>(
  filename: string,
  rows: T[],
  columns: { field: keyof T; label: string }[]
) {
  const header = columns.map((c) => c.label).join(",");

  const csvRows = rows.map((row) =>
    columns
      .map((c) => {
        const value = row[c.field];
        return `"${value ?? ""}"`;
      })
      .join(",")
  );

  const csvContent = [header, ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}
