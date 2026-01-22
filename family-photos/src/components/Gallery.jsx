import React from 'react';
import Masonry from 'react-masonry-css';
import './Gallery.css'; // We will create this

const Gallery = ({ photos }) => {
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {photos.map((photo) => (
                <div key={photo.id} className="photo-item">
                    <img
                        src={`${photo.baseUrl}=w400`} // Requesting width 400
                        alt={photo.filename}
                        loading="lazy"
                        style={{ width: '100%', borderRadius: '8px', display: 'block' }}
                    />
                </div>
            ))}
        </Masonry>
    );
};

export default Gallery;
