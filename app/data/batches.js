const batches = [
  {
    id: "B0",
    name: "MCA 2021",
    slug: "mca21",
    course: "C0",
    completed: {
      sem1: {
        minor1: true,
        minor2: true,
        major: false,
      },
    },
  },
  {
    id: "B1",
    name: "MCA 2022",
    slug: "mca22",
    course: "C0",
    completed: {
      sem1: {
        minor1: true,
        minor2: false,
        major: false,
      },
    },
  },
  {
    id: "B2",
    name: "MCA 2020",
    slug: "mca20",
    course: "C0",
    completed: {
      sem1: {
        minor1: true,
        minor2: true,
        major: true,
      },
      sem2: {
        minor1: true,
        minor2: true,
        major: true,
      },
      sem3: {
        minor1: true,
        minor2: true,
        major: true,
      },
      sem4: {
        minor1: false,
        minor2: false,
        major: false,
      },
    },
  },
  {
    id: "B3",
    name: "MTECH 2021",
    slug: "mtech21",
    course: "C1",
    completed: {
      sem1: {
        minor1: true,
        minor2: true,
        major: false,
      },
    },
  },
  {
    id: "B4",
    name: "MTECH 2022",
    slug: "mtech22",
    course: "C1",
    completed: {
      sem1: {
        minor1: true,
        minor2: false,
        major: false,
      },
    },
  },
];

export default batches;
