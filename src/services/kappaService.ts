import { TAttendance, TExcuse, TAttendanceUserDict, TExcuseUserDict } from '@backend/kappa';

export const separateByEvent = (attendance: { attended: Array<TAttendance>; excused: Array<TExcuse> }) => {};

export const separateByUser = (attendance: { attended: Array<TAttendance>; excused: Array<TExcuse> }) => {};

export const incorporateAttendance = (
  attendance: {
    attended: TAttendanceUserDict;
    excused: TExcuseUserDict;
  },
  newAttendance: {
    attended: Array<TAttendance>;
    excused: Array<TExcuse>;
  }
) => {};
