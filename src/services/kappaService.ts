import moment from 'moment';

import {
  TAttendance,
  TExcuse,
  TRecords,
  TEvent,
  TEventDateDict,
  TDirectory,
  TEventDict,
  TAttendanceEventDict,
  TExcuseEventDict,
  TUserEventDict
} from '@backend/kappa';
import { TUser } from '@backend/auth';

export const netidToEmail = (netid: string) => `${netid}@illinois.edu`;

export const separateByEventId = (events: Array<TEvent>) => {
  let separated = {};

  for (const event of events) {
    separated[event.id] = event;
  }

  return separated;
};

export const separateByDate = (events: Array<TEvent>) => {
  let separated = {};

  for (const event of events) {
    const date = moment(event.start).format('YYYY-MM-DD');

    if (!separated.hasOwnProperty(date)) {
      separated[date] = [];
    }

    separated[date].push(event);
  }

  return separated;
};

export const separateByEmail = (users: Array<TUser>) => {
  let separated = {};

  for (const user of users) {
    separated[user.email] = user;
  }

  return separated;
};

export const getEventById = (events: TEventDict, eventId: string) => {
  if (events.hasOwnProperty(eventId)) {
    return events[eventId];
  }

  return null;
};

export const getUserByEmail = (directory: TDirectory, email: string) => {
  if (directory.hasOwnProperty(email)) {
    return directory[email];
  }

  return null;
};

export const mergeEvents = (events: TEventDict, newEvents: Array<TEvent>) => {
  let mergedEvents = events;

  for (const event of newEvents) {
    mergedEvents[event.id] = event;
  }

  return mergedEvents;
};

export const mergeEventDates = (eventDateDict: TEventDateDict, newEvents: Array<TEvent>) => {
  let separated = eventDateDict;

  for (const event of newEvents) {
    const date = moment(event.start).format('YYYY-MM-DD');

    if (!separated.hasOwnProperty(date)) {
      separated[date] = [];
    }

    separated[date].push(event);
  }

  return separated;
};

export const mergeRecords = (
  records: TRecords,
  newRecords: {
    attended: Array<TAttendance>;
    excused: Array<TExcuse>;
  }
) => {
  let mergedRecords = records;

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

export const getAttendedEvents = (records: TRecords, email: string) => {
  if (!records.attended.hasOwnProperty(email)) {
    return {};
  }

  return records.attended[email];
};

export const getExcusedEvents = (records: TRecords, email: string) => {
  if (!records.excused.hasOwnProperty(email)) {
    return {};
  }

  return records.excused[email];
};

export const getEventRecordCounts = (records: TRecords, event_id: string) => {
  let attended = 0;
  let excused = 0;
  let pending = 0;

  for (const record of Object.values(records.attended)) {
    if (record.hasOwnProperty(event_id)) {
      attended++;
    }
  }

  for (const record of Object.values(records.excused)) {
    if (record.hasOwnProperty(event_id)) {
      if (record[event_id].approved) {
        excused++;
      } else {
        pending++;
      }
    }
  }

  return {
    attended,
    excused,
    pending,
    sum: attended + excused + pending
  };
};

export const getUserRecordCounts = (records: TRecords, email: string) => {
  let attended = 0;
  let excused = 0;
  let pending = 0;

  const attendedEvents = getAttendedEvents(records, email);

  attended = Object.keys(attendedEvents).length;

  const excusedEvents = getExcusedEvents(records, email);

  for (const excuse of Object.values(excusedEvents)) {
    if (excuse.approved) {
      excused++;
    } else {
      pending++;
    }
  }

  return {
    attended,
    excused,
    pending,
    sum: attended + excused + pending
  };
};

export const getTypeCount = (events: TEventDict, type: string, allowFuture: boolean = false) => {
  let count = 0;

  const now = moment();

  for (const event of Object.values(events)) {
    if (event.event_type === type) {
      if (allowFuture || moment(event.start).isSameOrBefore(now)) {
        count++;
      }
    }
  }

  return count;
};

export const getTypeCounts = (
  events: TEventDict,
  attended: TAttendanceEventDict,
  excused: TExcuseEventDict,
  type: string,
  allowFuture: boolean = false
) => {
  let attendedCount = 0;
  let excusedCount = 0;
  let pendingCount = 0;
  let sum = 0;

  const now = moment();

  for (const event_id of Object.keys(attended)) {
    if (events[event_id].event_type === type) {
      if (allowFuture || moment(events[event_id].start).isSameOrBefore(now)) {
        attendedCount++;
      }
    }
  }

  for (const [event_id, excuse] of Object.entries(excused)) {
    if (events[event_id].event_type === type) {
      if (allowFuture || moment(events[event_id].start).isSameOrBefore(now)) {
        if (excuse.approved) {
          excusedCount++;
        } else {
          pendingCount++;
        }
      }
    }
  }

  return {
    attended: attendedCount,
    excused: excusedCount,
    pending: pendingCount,
    sum: attendedCount + excusedCount + pendingCount
  };
};

export const hasValidCheckIn = (records: TRecords, email: string, event_id: string, allowPending: boolean = false) => {
  const attend = getAttendance(records, email, event_id);

  if (attend) return true;

  const excuse = getExcuse(records, email, event_id);

  return excuse !== undefined && (allowPending || excuse.approved === 1);
};

export const getMandatoryEvents = (events: TEventDict) => {
  let mandatory = {};

  const now = moment();

  for (const event of Object.values(events)) {
    if (event.mandatory) {
      if (moment(event.start).isBefore(now) || true) {
        mandatory[event.id] = event;
      }
    }
  }

  return mandatory;
};

export const getMissedMandatoryByUser = (records: TRecords, mandatoryEvents: TEventDict, email: string) => {
  let missed = {};

  for (const event of Object.values(mandatoryEvents)) {
    if (!hasValidCheckIn(records, email, event.id, true)) {
      missed[event.id] = event;
    }
  }

  return missed;
};

export const getMissedMandatory = (records: TRecords, mandatoryEvents: TEventDict, directory: TDirectory) => {
  let missed = {};

  for (const user of Object.values(directory)) {
    missed[user.email] = getMissedMandatoryByUser(records, mandatoryEvents, user.email);
  }

  return missed;
};

export const getMissedMandatoryByEvent = (missedMandatory: TUserEventDict, directory: TDirectory, event_id: string) => {
  let missed = {};

  for (const [email, events] of Object.entries(missedMandatory)) {
    if (events.hasOwnProperty(event_id)) {
      missed[email] = directory[email];
    }
  }

  return missed;
};

export const prettyPhone = (phone: string) => {
  if (!phone || phone.length === 0) {
    return '';
  }

  if (phone.length !== 10) {
    return 'Invalid';
  }

  return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
};

export const sortEventByDate = (a: TEvent, b: TEvent) => (moment(a.start).isBefore(moment(b.start)) ? -1 : 1);

export const sortUserByName = (a: TUser, b: TUser) => {
  const nameA = `${a.familyName}, ${b.givenName}`;
  const nameB = `${b.familyName}, ${b.givenName}`;

  return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
};