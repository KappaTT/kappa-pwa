export default (email: string) =>
  email === 'thetataudemo'
    ? {
        attended: [],
        excused: []
      }
    : {
        attended: [
          {
            event_id: 1,
            netid: 'jjt4'
          }
        ],
        excused: [
          {
            event_id: 2,
            netid: 'jjt4',
            reason: 'I was sick',
            approved: 1
          },
          {
            event_id: 4,
            netid: 'jjt4',
            reason: 'I was sick',
            approved: 0
          }
        ]
      };
