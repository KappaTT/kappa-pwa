export default (eventId: string) =>
  eventId === '1'
    ? {
        attended: [
          {
            eventId,
            netid: 'jjt4'
          }
        ],
        excused: []
      }
    : eventId === '2'
    ? {
        attended: [],
        excused: [
          {
            eventId: '2',
            netid: 'jjt4',
            reason: 'I was sick',
            approved: 1
          }
        ]
      }
    : eventId === '4'
    ? {
        attended: [],
        excused: [
          {
            eventId: '4',
            netid: 'jjt4',
            reason: 'I was sick',
            approved: 0
          }
        ]
      }
    : {
        attended: [],
        excused: []
      };
