import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card">
            <div className="event-header">
                <span className="event-name">{event.name}</span>
                <span className={`difficulty-badge badge-${event.level.toLowerCase().replace('é', 'e')}`}>
                    {event.level}
                </span>
            </div>
            <div className="event-details">
                <span>📍 {event.location}</span>
                <span>🚴 {event.distance}km</span>
                <span>⛰️ {event.elevation}m+</span>
            </div>
            <div className="event-tags" style={{ fontSize: '0.8rem', color: '#888' }}>
                {event.type} • {event.terrain}
            </div>
            <button className="register-btn">S'inscrire</button>
        </div>
    );
};

export default EventCard;
