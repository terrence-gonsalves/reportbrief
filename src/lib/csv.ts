import Papa from "papaparse";

export function parseCsv(csvText: string) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  return {
    rows: result.data,
    columns: result.meta.fields || []
  };
}
