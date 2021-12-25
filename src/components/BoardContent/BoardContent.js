import React, { useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from 'lodash';

import './BoardContent.scss';

import Column from 'components/Column/Column';
import { mapOder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

import { initialData } from 'actions/initialData';

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1',
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      //sort columns and set column

      setColumns(
        mapOder(boardFromDB.columns, boardFromDB.columnOder, 'id'),
      );
    }
  }, []);

  if (isEmpty(board)) {
    return (
      <div
        className='not-found'
        style={{ padding: '10px', color: 'white' }}
      >
        Board not found
      </div>
    );
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (
      dropResult.removedIndex !== null ||
      dropResult.addedIndex !== null
    ) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(
        currentColumn.cards,
        dropResult,
      );
      currentColumn.cardOder = currentColumn.cards.map((i) => i.id);

      setColumns(newColumns);
    }
  };
  return (
    <div className='board-content'>
      <Container
        orientation='horizontal'
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector='.column-drag-handle'
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview',
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className='add-new-column'>
        <i className='fa fa-plus icon'> Add another column</i>
      </div>
    </div>
  );
}

export default BoardContent;
