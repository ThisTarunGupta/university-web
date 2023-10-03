import DashboardComponent from "../component";

const CourseProps = {
  id: "",
  name: "",
  slug: "",
  duration: 0,
  subjects: {},
};

const CoursesPage = () => (
  <DashboardComponent
    format={{
      name: CourseProps.name,
      duration: CourseProps.duration,
    }}
    stateFormat={CourseProps}
    api="/api/courses"
    name="Course"
    obj="courses"
  />
);

export default CoursesPage;
