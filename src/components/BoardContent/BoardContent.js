import React, { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import {
  Container as BootstrapCOntainer,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';
import { isEmpty } from 'lodash';
//scss
import './BoardContent.scss';
//
import Column from 'components/Column/Column';
import { mapOder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';
//data
import { fetchBoardDetails } from 'actions/ApiCall';

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () =>
    setOpenNewColumnForm(!openNewColumnForm);

  const newColumnInputRef = useRef(null);

  const [newColumnTitle, setNewColumnTitle] = useState('');
  const onNewColumnTitleChange = (e) =>
    setNewColumnTitle(e.target.value);

  useEffect(() => {
    const boardId = '61ced6b52d11a3747c4751e2';
    fetchBoardDetails(boardId).then((board) => {
      console.log(board);
      setBoard(board);
      // sort columns and set column
      setColumns(mapOder(board.columns, board.columnOder, '_id'));
    });
  }, []);

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

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
    newBoard.columnOder = newColumns.map((c) => c._id);
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

      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(
        currentColumn.cards,
        dropResult,
      );
      currentColumn.cardOder = currentColumn.cards.map((i) => i._id);

      setColumns(newColumns);
    }
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board._id,
      title: newColumnTitle.trim(),
      cardOder: [],
      cards: [],
    };

    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle('');
    toggleOpenNewColumnForm();
  };

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id;

    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i._id === columnIdToUpdate,
    );

    if (newColumnToUpdate._destroy) {
      //remove column
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      //update column
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }

    let newBoard = { ...board };
    newBoard.columnOder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
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
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>
      <BootstrapCOntainer className='trello-container'>
        {!openNewColumnForm && (
          <Row>
            <Col
              className='add-new-column'
              onClick={toggleOpenNewColumnForm}
            >
              <i className='fa fa-plus icon'> Add another column</i>
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className='enter-new-column'>
              <Form.Control
                size='sm'
                type='text'
                placeholder='Enter column title... '
                className='input-enter-new-column'
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(event) =>
                  event.key === 'Enter' && addNewColumn()
                }
              />
              <Button
                variant='success'
                size='sm'
                onClick={addNewColumn}
              >
                Add column
              </Button>
              <span
                className='cancel-icon'
                onClick={toggleOpenNewColumnForm}
              >
                <i className='fa fa-trash icon' />
              </span>
            </Col>
          </Row>
        )}
      </BootstrapCOntainer>
    </div>
  );
}

export default BoardContent;
