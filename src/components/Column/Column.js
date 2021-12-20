import React from 'react';
import './Column.scss';

import Task from 'components/Task/Task';

function Column() {
  return (
    <div className='column'>
      <header>Brainstorm</header>
      <ul className='task-list'>
        <Task />
        <li className='task-item'>add somthing</li>
        <li className='task-item'>add somthing</li>
        <li className='task-item'>add somthing</li>
        <li className='task-item'>add somthing</li>
      </ul>
      <footer className=''>another card</footer>
    </div>
  );
}

export default Column;
