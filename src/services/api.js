import Papa from 'papaparse';

/**
 * Fetches and parses CSV data from a Google Sheet URL
 * @param {string} url - The URL of the Google Sheet (CSV format)
 * @returns {Promise<Object>} - Object containing headers, student data, and subjects
 */
export const fetchClassData = async (url) => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
          return;
        }

        const data = results.data;
        if (data.length === 0) {
          reject(new Error("No data found in the sheet"));
          return;
        }

        // Extract headers from the first row keys
        const headers = Object.keys(data[0]);

        // Identify fixed columns (case-insensitive check)
        const fixedColumns = ['student_id', 'name', 'roll_no', 'session'];
        
        // Identify subjects (all headers that are NOT fixed columns)
        const subjects = headers.filter(header => 
          !fixedColumns.includes(header.toLowerCase())
        );

        resolve({
          headers,
          students: data,
          subjects
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
