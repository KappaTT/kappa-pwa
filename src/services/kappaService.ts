import { TAttendance, TExcuse, TAttendanceUserDict, TExcuseUserDict, TRecords } from '@backend/kappa';

export const netidToEmail = (netid: string) => `${netid}@illinois.edu`;

export const mergeRecords = (
  records: TRecords,
  newRecords: {
    attended: Array<TAttendance>;
    excused: Array<TExcuse>;
  }
) => {
  let mergedRecords = {
    ...records
  };

  for (const attend of newRecords.attended) {
    const email = netidToEmail(attend.netid);
    const event_id = attend.event_id;

    if (!mergedRecords.attended.hasOwnProperty(email)) {
      mergedRecords.attended[email] = {};
    }

    mergedRecords.attended[email][event_id] = attend;
  }

  for (const excuse of newRecords.excused) {
    const email = netidToEmail(excuse.netid);
    const event_id = excuse.event_id;

    if (!mergedRecords.excused.hasOwnProperty(email)) {
      mergedRecords.excused[email] = {};
    }

    mergedRecords.excused[email][event_id] = excuse;
  }

  return mergedRecords;
};

export const getAttendance = (records: TRecords, email: string, event_id: string) => {
  if (!records.attended.hasOwnProperty(email)) {
    return undefined;
  }

  return records.attended[email][event_id];
};

export const getExcuse = (records: TRecords, email: string, event_id: string) => {
  if (!records.excused.hasOwnProperty(email)) {
    return undefined;
  }

  return records.excused[email][event_id];
};

export const hasValidCheckIn = (records: TRecords, email: string, event_id: string) => {
  const attend = getAttendance(records, email, event_id);

  if (attend) return true;

  const excuse = getExcuse(records, email, event_id);

  return excuse !== undefined && excuse.approved === 1;
};
