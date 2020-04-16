import refToDb from '../utilities/dbOpener';
import dbReader from '../utilities/dbReader';

async function errrorReporter(state: any) {
  const generalObj = await dbReader(refToDb, 'general', 1);

  const reportObj = {
    uid: generalObj.uid,
    ram: (navigator as any).deviceMemory,
    browserInfo: (navigator as any).userAgent,
    state
  };

  // if the sending fails, we won't even bother cause the problem is network related
  try {
    await fetch('http://localhost:3005/api/report', {
      method: 'POST',
      body: JSON.stringify(reportObj),
      headers: {
        'content-type': 'application/json'
      }
    });
  } catch (error) {}
}

export default errrorReporter;
