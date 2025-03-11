import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Styled Components
const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  /* Left gradient (darkGreen to transparent) */
  background-image: 
    linear-gradient(to right, ${props => props.theme.darkGreen} 0%, transparent 100%),
    /* Right gradient (darkGreen to transparent) */
    linear-gradient(to left, ${props => props.theme.darkGreen} 0%, transparent 100%);
  
  background-size: 6% 100%, 2% 100%;
  
  /* Position at left and right edges */
  background-position: left center, right center;
  
  /* Prevent repeating */
  background-repeat: no-repeat;
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const MyHanuutAppCarousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1800,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2600,
    arrows: false
  };

  return (
    <CarouselContainer>
      <GradientOverlay />
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