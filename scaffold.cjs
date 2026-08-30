const fs = require('fs');
const path = require('path');

const screens = [
  'Home', 'Journey', 'Profile', 'StartSession', 'SetIntention',
  'ServiceMode', 'EndService', 'SermonInput', 'AIProcessing',
  'PersonalReflection', 'SermonReport', 'RevelationMap',
  'PersonalConnection', 'ActionCommitment', 'FinalReport',
  'SessionDetails'
];

const dir = path.join(__dirname, 'src', 'screens');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

screens.forEach(screen => {
  const content = `import React from 'react';

const ${screen} = () => {
  return (
    <div>
      <h1>${screen}</h1>
    </div>
  );
};

export default ${screen};
`;
  fs.writeFileSync(path.join(dir, `${screen}.tsx`), content);
});

console.log('Screens created successfully.');
