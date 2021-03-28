//@ts-check

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { RAW_CARDS } from './data';

const newCard = (name) => ({ ...RAW_CARDS.filter((e) => e.name == name)[0] });
const hasPower = (card, power) =>
  card.pow.filter(([powName, _]) => powName == power).length > 0;

const stack1 = [
  { id: uuid(), content: newCard('bird') },
  { id: uuid(), content: newCard('minibot') },
  { id: uuid(), content: newCard('snake') },
  { id: uuid(), content: newCard('mage') },
  { id: uuid(), content: newCard('big cannon') },
];
const stack2 = [
  { id: uuid(), content: newCard('midbot') },
  { id: uuid(), content: newCard('bigbot') },
  { id: uuid(), content: newCard('shark') },
  { id: uuid(), content: newCard('bigshark') },
  { id: uuid(), content: newCard('ent') },
];

const columnsFromBackend = {
  [uuid()]: {
    name: 'back',
    items: stack1,
  },
  [uuid()]: {
    name: 'front',
    items: [],
  },
  [uuid()]: {
    name: 'front',
    items: [],
  },
  [uuid()]: {
    name: 'back',
    items: stack2,
  },
};

const STATE = {
  p1: {
    move: 'p1move',
    attack: 'p1attack',
  },
  p2: {
    move: 'p2move',
    attack: 'p2attack',
  },
  end: 'end',
};

const CURRENT = {
  state: STATE.p1.move,
  p1: {
    cards: stack1.map((e) => e.content),
    health: 20,
  },
  p2: {
    cards: stack2.map((e) => e.content),
    health: 20,
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function Board() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <>
      <div>{JSON.stringify(CURRENT)}</div>
      <div
        style={{ display: 'flex', justifyContent: 'center', height: '100%' }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Column columnId={columnId} column={column} />
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}

const Column = ({ columnId, column }) => (
  <Droppable droppableId={columnId} key={columnId}>
    {(provided, snapshot) => {
      return (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
            padding: 4,
            width: 250,
            minHeight: 500,
          }}
        >
          {column.items.map((item, index) => {
            return <Card item={item} index={index} />;
          })}
          {provided.placeholder}
        </div>
      );
    }}
  </Droppable>
);

const Card = ({ item, index }) => {
  const { name, att, hp, pow, wait } = item.content;
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              padding: 16,
              margin: '0 0 8px 0', // if you just specify 8 all around margin you get an ugly pop effect on drop
              minHeight: '100px',
              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
              color: 'white',
              ...provided.draggableProps.style,
            }}
          >
            <strong>{name}</strong>
            <br />
            <em>{att}</em> att,&nbsp;
            <em>{hp}</em> HP
            <br />
            {pow && (
              <div>
                POWERS: <em>{pow}</em>
              </div>
            )}
            <br />
            ready in <em>{wait}</em>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Board;
