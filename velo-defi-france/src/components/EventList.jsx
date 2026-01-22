import React from 'react';
import EventCard from './EventCard';

const EventList = ({ events }) => {
    return (
        <div className="events-list">
            <h3>Résultats ({events.length})</h3>
            {events.length > 0 ? (
                events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun événement ne correspond à vos critères.</p>
            )}
        </div>
    );
};

export default EventList;
