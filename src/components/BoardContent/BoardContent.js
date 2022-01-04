import React, { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import {
  Container as BootstrapCOntainer,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';
import { isEmpty, cloneDeep, isEqual } from 'lodash';
//scss
import './BoardContent.scss';
//
import Column from 'components/Column/Column';
import { mapOder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';
//data
import {
  fetchBoardDetails,
  createNewColumn,
  updateBoard,
  updateColumn,
  updateCard,
} from 'actions/ApiCall';

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
    let newColumns = cloneDeep(columns);
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = cloneDeep(board);
    newBoard.columnOder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    //If column position changes, call api
    if (!isEqual(board.columnOder, newBoard.columnOder)) {
      setColumns(newColumns);
      setBoard(newBoard);
      //call api update columOder in board details
      //if error, roll back to pre value
      updateBoard(newBoard._id, newBoard).catch(() => {
        setColumns(columns);
        setBoard(board);
      });
    }
  };

  const onCardDrop = (columnId, dropResult) => {
    if (
      dropResult.removedIndex !== null ||
      dropResult.addedIndex !== null
    ) {
      let newColumns = cloneDeep(columns);

      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(
        currentColumn.cards,
        dropResult,
      );
      currentColumn.cardOder = currentColumn.cards.map((i) => i._id);

      setColumns(newColumns);

      if (
        dropResult.removedIndex !== null &&
        dropResult.addedIndex !== null
      ) {
        /**
         * Action: move cards in the same column
         * Call api update cardOder in current column
         */
        updateColumn(currentColumn._id, currentColumn).catch(() =>
          setColumns(columns),
        );
      } else {
        /**
         * ACtion: move cards between 2 different columns
         * Call api update cardOder in destination column
         */
        updateColumn(currentColumn._id, currentColumn).catch(() =>
          setColumns(columns),
        );

        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload);
          currentCard.columnId = currentColumn._id;
          //* Call api update columnId in current card
          updateCard(currentCard._id, currentCard);
        }
      }
    }
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim(),
    };
    //call api post
    createNewColumn(newColumnToAdd).then((column) => {
      let newColumns = [...columns];
      newColumns.push(column);

      let newBoard = { ...board };
      newBoard.columnOder = newColumns.map((c) => c._id);
      newBoard.columns = newColumns;

      setColumns(newColumns);
      setBoard(newBoard);
      setNewColumnTitle('');
      toggleOpenNewColumnForm();
    });
  };

  const onUpdateColumnState = (newColumnToUpdate) => {
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
              onUpdateColumnState={onUpdateColumnState}
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
