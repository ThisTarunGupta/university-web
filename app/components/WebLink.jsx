const { default: Link } = require("next/link");

const WebLink = ({ children, href }) => (
  <Link className="text-light" href={href} style={{ textDecoration: "none" }}>
    {children}
  </Link>
);

export default WebLink;
