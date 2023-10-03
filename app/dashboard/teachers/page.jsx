import DashboardComponent from "../component";

const TeacherProps = {
  id: "",
  hod: false,
  permanent: false,
  name: "",
  email: "",
  phone: "",
  classes: [],
};

const TeachersPage = () => (
  <DashboardComponent
    format={{
      name: TeacherProps.name,
      teacher: TeacherProps.permanent,
    }}
    stateFormat={TeacherProps}
    api="/api/teachers"
    name="Teacher"
    obj="teachers"
  />
);

export default TeachersPage;
