import fs from 'fs';

const fileName = `development.log.txt`;

export const logFunctionException = async <T>(fn: () => T, logName: string) => {
  try {
    console.log(`${logName} STARTING`);

    const result = await fn();

    console.log(`${logName} DONE`);

    return result;
  } catch (error) {
    console.log(logName, error);

    const readableError = ` 
    \n${'='.repeat(100)}\n\n${Date()}
    ${JSON.stringify(error, undefined, 3)}\n${'='.repeat(100)}\n\n
    `;

    fs.appendFileSync(fileName, readableError, 'utf8');

    return null;
  }
};
