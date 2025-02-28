const fs = require('fs');
const path = require('path');

// Create functions directory if it doesn't exist
const functionsDir = path.join(__dirname, 'functions');
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir);
  console.log('Created functions directory');
}

// Copy API files to functions directory
const apiDir = path.join(__dirname, 'api');
const apiFiles = fs.readdirSync(apiDir);

apiFiles.forEach(file => {
  const sourcePath = path.join(apiDir, file);
  const destPath = path.join(functionsDir, file);
  
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied ${file} to functions directory`);
});

// Create data directory in functions if it doesn't exist
const dataFunctionsDir = path.join(functionsDir, 'data');
if (!fs.existsSync(dataFunctionsDir)) {
  fs.mkdirSync(dataFunctionsDir);
  console.log('Created data directory in functions');
}

// Copy data files to functions/data directory
const dataDir = path.join(__dirname, 'data');
const dataFiles = fs.readdirSync(dataDir);

dataFiles.forEach(file => {
  const sourcePath = path.join(dataDir, file);
  const destPath = path.join(dataFunctionsDir, file);
  
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied ${file} to functions/data directory`);
});

console.log('Build completed successfully!');
