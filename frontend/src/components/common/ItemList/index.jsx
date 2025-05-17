import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SingleItem from './SingleItem';
import PropTypes from 'prop-types';

const ItemList = ({ 
  title, 
  items, 
  itemsArray, 
  path, 
  idPath, 
  type,
  seeMorePlacement,
  rounded = false,
  showYear = false,
  showPlays = false
}) => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const displayedItems = isHome ? itemsArray.slice(0, items) : itemsArray;
  const showSeeMore = itemsArray.length > items && seeMorePlacement !== false;

  return (
    <section className={`item-list ${rounded ? 'item-list--rounded' : ''}`}>
      <div className="item-list__header">
        <h2 className="item-list__title">{title}</h2>
        {seeMorePlacement === 'top' && showSeeMore && (
          <Link to={path} className="item-list__see-more">See more {type}</Link>
        )}
      </div>

      <div className="item-list__grid">
        {displayedItems.map((item) => (
          <SingleItem
            key={`${type}-${item._id}`}
            {...item}
            idPath={idPath}
            type={type}
            showYear={showYear}
            showPlays={showPlays}
          />
        ))}
      </div>
      
      {seeMorePlacement === 'bottom' && showSeeMore && (
        <div className="item-list__footer">
          <Link to={path} className="item-list__see-more">See more {type}</Link>
        </div>
      )}
    </section>
  );
};

ItemList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.number,
  itemsArray: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  idPath: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['songs', 'artists', 'albums', 'playlists']).isRequired,
  seeMorePlacement: PropTypes.oneOf(['top', 'bottom', false]),
  rounded: PropTypes.bool,
  showYear: PropTypes.bool,
  showPlays: PropTypes.bool
};

ItemList.defaultProps = {
  items: 6,
  seeMorePlacement: 'false',
  rounded: false,
  showYear: false,
  showPlays: false
};

export default ItemList;