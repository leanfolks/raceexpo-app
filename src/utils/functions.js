import * as XLSX from "xlsx";

export const setStringifiedLocalStorageData = (itemName, item) => {
  try {
    localStorage.setItem(itemName, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
};

export const getParsedLocalStorageData = (itemName) => {
  try {
    return JSON.parse(localStorage.getItem(itemName)) || {};
  } catch (error) {
    return {};
  }
};

export const readExcelData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      resolve(jsonData[0]); // Get the first row as headers
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

// export const createOptions = (data) => {
//   let options = {}
//   data.forEach((ele) => {

//   })

// }
