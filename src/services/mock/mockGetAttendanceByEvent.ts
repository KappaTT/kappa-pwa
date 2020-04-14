export default (event_id: string) =>
  event_id === '1'
    ? {
        attended: [
          {
            event_id,
            netid: 'jjt4'
          }
        ],
        excused: []
      }
    : event_id === '2'
    ? {
        attended: [],
        excused: [
          {
            event_id: '2',
            netid: 'jjt4',
            reason: 'I was sick',
            approved: 1
          }
        ]
      }
    : event_id === '4'
    ? {
        attended: [],
        excused: [
          {
            event_id: '4',
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
