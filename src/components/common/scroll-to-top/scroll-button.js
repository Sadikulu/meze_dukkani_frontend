import React, { useEffect, useState } from 'react';
import { FaChevronUp } from "react-icons/fa";
import './scroll-button.scss';

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollTop = () => {
    const scrollThreshold = window.innerHeight / 1.5;
    const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    setIsVisible(currentScrollTop > scrollThreshold);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, []);

  return (
    <button
      className={`scroll-button ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      <FaChevronUp/>
    </button>
  );
};

export default ScrollButton;