import DashboardComponent from "../component";

const BatchProps = {
  id: "",
  name: "",
  slug: "",
  course: "",
};

const BatchesPage = () => (
  <DashboardComponent
    format={{
      name: BatchProps.name,
      course: BatchProps.course,
    }}
    stateFormat={BatchProps}
    api="/api/batches"
    name="Batch"
    obj="batches"
  />
);

export default BatchesPage;
