import Link from "next/link";

const Sidebar = ({ menu, className }) => (
  <div
    className={`list-group text-center ${className} list-group-item-primary`}
  >
    {menu.map(({ id, name }) => (
      <Link
        key={id}
        href={`${id}`}
        className="list-group-item list-group-item-action"
      >
        {name}
      </Link>
    ))}
  </div>
);

export default Sidebar;
