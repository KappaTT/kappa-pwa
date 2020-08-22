const DEMO_TOKEN = 'DEMO';

const DEMO_USER = {
  _id: 'demo',
  email: 'thetataudemo@gmail.com',
  familyName: 'Jobs',
  givenName: 'Steve',
  firstYear: '2017',
  semester: 'Fall 2018',
  type: 'B',
  gradYear: 'Spring 2021',
  phone: '5555555555',

  sessionToken: DEMO_TOKEN
};

export default {
  users: [
    {
      _id: '5e77a2d370da5ae6e12bf99c',
      email: 'jjt4@illinois.edu',
      familyName: 'Taylor-Chang',
      givenName: 'Jeffrey',
      semester: 'Fall 2018',
      type: 'B',
      role: 'Web Chair',
      privileged: true,
      gradYear: 'Spring 2021',
      phone: '9784609599'
    },
    {
      _id: 'demo',
      email: 'thetataudemo@gmail.com',
      familyName: 'Jobs',
      givenName: 'Steve',
      semester: 'Fall 2018',
      type: 'B',
      gradYear: 'Spring 2021',
      phone: '5555555555'
    }
  ],
  user: DEMO_USER,
  sessionToken: DEMO_USER.sessionToken
};
