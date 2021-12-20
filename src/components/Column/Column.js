import React from 'react';

import './Column.scss';
import Card from 'components/Card/Card';
import { mapOder } from 'utilities/sorts';

function Column(props) {
  const { column } = props;
  const cards = mapOder(column.cards, column.cardOder, 'id');

  return (
    <div className='column'>
      <header>{column.title}</header>
      <ul className='card-list'>
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </ul>
      <footer className=''>another card</footer>
    </div>
  );
}

export default Column;
