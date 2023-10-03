const { createContext } = require("react");

const StateContext = createContext({
  batches: null,
  classes: null,
  courses: null,
  exams: null,
  subjects: null,
  students: null,
  teachers: null,
});

export default StateContext;
