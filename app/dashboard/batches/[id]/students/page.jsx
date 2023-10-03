import DashboardComponent from "@/app/dashboard/component";
import Link from "next/link";

const StudentProps = {
  rollno: "",
  name: "",
  parentage: "",
  email: "",
  phone: "",
};

const StudentsPage = ({ params: { id } }) => (
  <>
    <Link href={`/dashboard/batches/${id}`}>
      <button className="btn btn-outline-primary my-3">
        <i className="fa-solid fa-arrow-left me-2"></i>
        Back
      </button>
    </Link>
    <DashboardComponent
      format={StudentProps}
      stateFormat={{
        id: "",
        ...StudentProps,
      }}
      api="/api/students"
      batchID={id}
      name="Student"
      obj="students"
      sort="rollno"
    />
  </>
);

export default StudentsPage;
