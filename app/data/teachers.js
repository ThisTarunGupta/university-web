const teachers = [
  {
    id: "T0",
    hod: true,
    name: "Parwanesh Abrol",
    email: "hod@example.com",
    password: "1234567890",
    phone: "+911234567890",
    classes: [
      {
        batch: "B0",
        subject: "S0",
      },
      {
        batch: "B1",
        subject: "S2",
      },
    ],
  },
  {
    id: "T1",
    name: "Jasbir Singh",
    email: "jasbir@example.com",
    password: "1234567890",
    phone: "+911234567890",
    classes: [
      {
        batch: "B0",
        subject: "S1",
      },
    ],
  },
  {
    id: "T2",
    name: "Lalit Sen",
    email: "lalit@example.com",
    password: "1234567890",
    phone: "+911234567890",
  },
  {
    id: "T3",
    supervisor: "T0",
    name: "Palak Mahajan",
    email: "palak@example.com",
    password: "1234567890",
    phone: "+911234567890",
  },
  {
    id: "T4",
    supervisor: "T0",
    name: "Sheela",
    email: "sheela@example.com",
    password: "1234567890",
    phone: "+911234567890",
  },
];

export default teachers;
