// https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
export default function convertArrayOfObjectsToCSV(
  data,
  columnDelimiter = ',',
  lineDelimiter = '\n'
) {

  if (data == null || !data.length) {
    console.log('missing or malformed `data` argument in `convertArrayOfObjectsToCSV`');
    return null;
  }

  const keys = Object.keys(data[0]);

  let result = keys.join(columnDelimiter) + lineDelimiter;

  data.map(column => {
    keys.forEach((key, i) => {
      if (i > 0) result += columnDelimiter; // separate each column with a comma

      result += column[key];
    });
    result += lineDelimiter; // separate each line with a line break
  });

  return result;
}