import Sidebar from "@/app/components/sidebar";

const fetchMenu = async () => {
  const teacherRes = await fetch("http://localhost:3000/api/teacher", {
    next: {
      revalidate: 1,
    },
  });
  const teacher = await teacherRes.json();
  console.log(teacher);
  const menu = teacher.classes.map((x) => {});
};

const menu = [
  {
    name: "MCA21/TOC",
    path: "/user/teacher/mca21toc",
  },
  {
    name: "MCA22/DS",
    path: "/user/teacher/mca22ds",
  },
  {
    name: "MTECH20/ADA",
    path: "/user/teacher/mtech20ada",
  },
];

const TeacherLayout = async ({ children }) => {
  const user = await fetchTeacher();
  return (
    <div className="row">
      <Sidebar menu={menu} className="col-2" />
      {user.name}
      <div className="container col">{children}</div>
    </div>
  );
};

export default TeacherLayout;
