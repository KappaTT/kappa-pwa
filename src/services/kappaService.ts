import { TAttendance, TExcuse, TAttendanceUserDict, TExcuseUserDict } from '@backend/kappa';

export const netidToEmail = (netid: string) => `${netid}@illinois.edu`;

export const incorporateAttendance = (
  attendance: {
    attended: TAttendanceUserDict;
    excused: TExcuseUserDict;
  },
  newAttendance: {
    attended: Array<TAttendance>;
    excused: Array<TExcuse>;
  }
) => {
  let mergedAttendance = {
    ...attendance
  };

  for (const attend of newAttendance.attended) {
    const email = netidToEmail(attend.netid);
    const event_id = attend.event_id;

    if (!mergedAttendance.attended.hasOwnProperty(email)) {
      mergedAttendance.attended[email] = {};
    }

    mergedAttendance.attended[email][event_id] = attend;
  }

  for (const excuse of newAttendance.excused) {
    const email = netidToEmail(excuse.netid);
    const event_id = excuse.event_id;

    if (!mergedAttendance.excused.hasOwnProperty(email)) {
      mergedAttendance.excused[email] = {};
    }

    mergedAttendance.excused[email][event_id] = excuse;
  }

  return mergedAttendance;
};
