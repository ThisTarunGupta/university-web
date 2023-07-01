import WebLink from "./WebLink";

const Footer = () => (
  <div className="bg-primary text-light">
    <div className="container py-3">
      <div className="row">
        <div className="col">
          Department of Computer Science & IT <br />
          University of Jammu
        </div>
        <div className="col">
          Tawi, Jammu, Jammu and Kashmir <br />
          <WebLink href="tel:+911912222222">+91 191 222 22 22</WebLink> <br />
          <WebLink href="mailto:cscit@jammuuniversity.com">
            cscit@jammuuniversity.com
          </WebLink>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
