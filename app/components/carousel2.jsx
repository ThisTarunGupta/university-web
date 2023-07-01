import Image from "next/image";

const Carousel = () => (
  <div
    id="carouselExampleInterval"
    className="carousel slide h-100"
    data-bs-ride="carousel"
  >
    <div className="carousel-inner">
      <div className="carousel-item active" data-bs-interval="10000">
        <Image
          src="https://unsplash.com/photos/0rCJ-y3wx6g"
          className="d-block w-100"
          fill="boolean"
          alt="..."
        />
      </div>
      <div className="carousel-item" data-bs-interval="2000">
        <Image
          src="https://unsplash.com/photos/lqntyywOQkA"
          className="d-block w-100"
          fill="boolean"
          alt="..."
        />
      </div>
      <div className="carousel-item">
        <Image
          src="https://unsplash.com/photos/Zega-znwiLQ"
          className="d-block"
          fill="boolean"
          alt="..."
        />
      </div>
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleInterval"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleInterval"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
);

export default Carousel;
