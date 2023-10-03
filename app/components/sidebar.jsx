import Link from "next/link";

const Sidebar = ({ menu, baseURL, className }) => (
  <div
    className={`list-group text-center ${className} list-group-item-primary`}
  >
    {menu &&
      menu.map(({ id, name }) => (
        <Link
          key={id}
          href={`${baseURL}/${id}`}
          className="list-group-item list-group-item-action"
        >
          {name}
        </Link>
      ))}
  </div>
);

export default Sidebar;
