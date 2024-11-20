import { Fragment } from "react";
import Slider from "react-slick";
import { Card } from "@mui/material";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeedSliderPreview = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const slides = [
    {
      id: 1,
      image:
        "https://coding.load.vshare.net/preview?path=967368980-702/90426347_w2tpOTgifo5x0Ftjp2xtGjkOy.png",
      title: "Slide 1",
    },
    {
      id: 2,
      image:
        "https://coding.load.vshare.net/preview?path=967368980-702/74910881_w2tpOTgifo5x0Ftjp2xtGjkOy.png",
      title: "Slide 2",
    },
    {
      id: 3,
      image:
        "https://coding.load.vshare.net/preview?path=967368980-702/84999235_w2tpOTgifo5x0Ftjp2xtGjkOy.png",
      title: "Slide 3",
    },
    {
      id: 4,
      image:
        "https://coding.load.vshare.net/preview?path=967368980-702/17048292_w2tpOTgifo5x0Ftjp2xtGjkOy.png",
      title: "Slide 4",
    },
  ];

  return (
    <Fragment>
      <Card
        sx={{ backgroundColor: "#fff", px: 0, borderRadius: "6px", mt: 10 }}
      >
        <div className="slider-container" style={{ width: "100%" }}>
          <Slider {...settings}>
            {slides.map((item, index) => {
              return (
                <div key={index}>
                  <h2>{item.title}</h2>
                  {/* <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  /> */}
                </div>
              );
            })}
          </Slider>
        </div>
      </Card>
    </Fragment>
  );
};

export default FeedSliderPreview;
