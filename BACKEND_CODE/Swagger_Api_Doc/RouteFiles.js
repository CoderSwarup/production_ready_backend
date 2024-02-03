import fs from 'fs';
import path from 'path';

const getRouteFiles = (folderPath) => {
  const routeFiles = fs.readdirSync(path.resolve(path.join('./src/routes')));

  const fileList = routeFiles.map((file) => path.join(folderPath, file));
  return fileList;
};

// Function to dynamically load all route files

const routeFiles = getRouteFiles('./src/routes'); // Adjust the path based on your project structure
// console.log(routeFiles);
export default routeFiles;
