
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  // Create worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  // Write and download
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
