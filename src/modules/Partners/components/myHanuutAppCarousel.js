import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Styled Components
const CarouselContainer = styled.div`
  width: 100%;
  margin: auto;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;w
  object-fit: cover;
`;

const PartnersImageContainer = styled.img`
  width: 90%;
  max-height: 50vh;
  @media (max-width: 768px) {
    width: ${(props) => (props.hide ? "0" : "100%")};
  }
`;

const MyHanuutAppCarousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false
  };

  return (
    <CarouselContainer>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <SlideImage src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default MyHanuutAppCarousel;