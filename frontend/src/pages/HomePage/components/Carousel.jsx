import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../../../components/ui/Card';

const Carousel = ({ title, items, type }) => {
  return (
    <section className="carousel">
      <div className="carousel__header">
        <h2 className="carousel__title">{title}</h2>
      </div>
      <div className="carousel__items">
        {items.map((item) => (
          <Card key={item._id} item={item} type={type} />
        ))}
      </div>
    </section>
); };

Carousel.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['artist', 'album', 'playlist', 'song']).isRequired,
};

export default Carousel;