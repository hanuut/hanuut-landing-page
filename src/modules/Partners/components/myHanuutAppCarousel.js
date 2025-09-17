import React from "react";
import styled from "styled-components";

// Swiper.js Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper.js CSS Imports
import "swiper/css";
import "swiper/css/autoplay";

// --- Styled Components ---

const CarouselWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

// --- Using your exact original GradientOverlay for the correct effect ---
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
  background-image: linear-gradient(
      to right,
      ${(props) => props.theme.darkGreen} 0%,
      transparent 100%
    ),
    linear-gradient(
      to left,
      ${(props) => props.theme.darkGreen} 0%,
      transparent 100%
    );
  background-size: 6% 100%, 2% 100%; /* Your original values */
  background-position: left center, right center;
  background-repeat: no-repeat;
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover; /* Your original value */
`;

const MyHanuutAppCarousel = ({ images }) => {
  return (
    <CarouselWrapper>
      <GradientOverlay />
      <CarouselContainer>
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 3600, // Your original speed
            disableOnInteraction: false,
          }}
          speed={1800} // Your original speed
          slidesPerView={2} // Your desired number of slides
          spaceBetween={0} // No gap between slides
          centeredSlides={false}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <SlideImage src={image} alt={`Slide ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CarouselContainer>
    </CarouselWrapper>
  );
};

export default MyHanuutAppCarousel;