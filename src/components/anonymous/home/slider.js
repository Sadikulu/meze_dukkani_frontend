import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import slides from "./slider.json";
import "./slider.scss";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";

const Slider = () => {
  // const pagination = {
  //   clickable: true,
  // };

  return (
    <Swiper
      effect={"fade"}
      //  pagination={pagination}
      //  navigation={true}
      modules={[Navigation, Pagination, EffectFade, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      className="slider"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <img
            src={require(`../../../assets/img/slider/${slide.image}`)}
            alt={slide.id}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
