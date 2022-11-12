import React from 'react';
import './styles.css';
import notFound from '../../assets/img/error.png';

export const NotFound = () => {
  return (
    <>
      <div className="not-found">Page not found: Error 404</div>
      <div className="not-found-img">
        <img src={notFound} alt="404" />
      </div>
    </>
  );
};
