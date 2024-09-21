import React from 'react';

const events = [
  {
    id: 1,
    name: 'Save the Rainforest',
    description: 'Help preserve the Amazon rainforest.',
    image: 'rainforest.jpg',
    amountRaised: '3.5 ETH',
  },
  {
    id: 2,
    name: 'Build Clean Water Wells',
    description: 'Fund the building of clean water wells in Africa.',
    image: 'water_wells.jpg',
    amountRaised: '5 ETH',
  },
];

const Events = () => {
  return (
    <div style={styles.eventList}>
      {events.map(event => (
        <div key={event.id} style={styles.eventCard}>
          <img src={event.image} alt={event.name} style={styles.eventImage} />
          <h2>{event.name}</h2>
          <p>{event.description}</p>
          <p>Raised: {event.amountRaised}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  eventList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    padding: '20px',
  },
  eventCard: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '10px',
  },
  eventImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
  },
};

export default Events;
