export default (event_id: number) =>
  event_id === 1
    ? {
        attended: [
          {
            event_id,
            netid: 'jjt4'
          }
        ],
        excused: []
      }
    : {
        attended: [],
        excused: []
      };
