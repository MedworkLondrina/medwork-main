import React, { useState, useEffect } from 'react';
import redFront from '../../../media/loading/front-red.png';

const LoadingScreen = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 250);

    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-black bg-opacity-5 backdrop-blur-[1px]"></div>
      <div className='flex justify-center items-center w-full h-full'>
        <img
          src={redFront}
          className={`h-32 ${animationComplete ? 'diagonal-fill' : 'hidden'}`}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
