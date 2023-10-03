import DashboardComponent from "../component";

const SubjectProps = {
  id: "",
  name: "",
  subjectId: "",
  slug: "",
  credits: "",
};

const SubjectsPage = () => (
  <DashboardComponent
    format={{
      name: SubjectProps.name,
      subjectId: SubjectProps.subjectId,
      credits: SubjectProps.credits,
    }}
    stateFormat={SubjectProps}
    api="/api/subjects"
    name="Subject"
    obj="subjects"
  />
);

export default SubjectsPage;
