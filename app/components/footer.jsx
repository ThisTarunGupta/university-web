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
          <span className="d-flex align-items-center justify-content-start mb-1">
            <i className="fa-solid fa-location-pin me-2"></i>
            Baba Saheb Ambedkar Road, Jammu Tawi, Jammu and Kashmir 180006{" "}
            <br />
          </span>
          <span className="d-flex align-items-center justify-content-start mb-1">
            <i className="fa-solid fa-phone me-2"></i>
            <WebLink href="tel:+911912222222">+91 191 222 22 22</WebLink> <br />
          </span>
          <span className="d-flex align-items-center justify-content-start">
            <i className="fa-solid fa-envelope me-2"></i>
            <WebLink href="mailto:cscit@jammuuniversity.com">
              cscit@jammuuniversity.com
            </WebLink>
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
