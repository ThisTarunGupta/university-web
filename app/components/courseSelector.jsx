const CourseSelector = ({ coursesData, state: { formData, setFormData } }) => {
  return (
    <select
      className="form-select"
      defaultValue={formData["course"]}
      onChange={({ target: { value } }) => setFormData({ course: value })}
    >
      <option>Select course</option>
      {coursesData &&
        coursesData.map((course, indx) => (
          <option key={indx} value={course.id}>
            {course.name}
          </option>
        ))}
    </select>
  );
};

export default CourseSelector;
