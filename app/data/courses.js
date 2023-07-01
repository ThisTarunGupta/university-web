const courses = [
  {
    id: "C0",
    name: "Master of Computer Applications",
    slug: "mca",
    duration: 2,
    subjects: {
      sem1: {
        core: ["S0", "S1"],
      },
      sem2: {
        core: ["S2"],
      },
    },
  },
  {
    id: "C1",
    name: "Master of Technology in Computer Applications",
    slug: "mtech",
    duration: 2,
    subjects: {
      sem1: {
        core: ["S2", "S3"],
        optional: ["S4"],
      },
    },
  },
];

export default courses;
