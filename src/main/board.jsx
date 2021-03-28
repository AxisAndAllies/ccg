//@ts-check

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { useProxy } from 'valtio';
import { getIcon, POW, POW_DESCRIPT } from './data';
import {
  CURRENT,
  STATE,
  processCombat,
  processEndOfTurnActions,
  nextState,
} from './game';
import { newCard, getPower, healUnit, getBaseStat } from './helpers';

const stack1 = [
  { id: uuid(), content: newCard('sauropod') },
  { id: uuid(), content: newCard('midbot') },
  { id: uuid(), content: newCard('snake') },
  { id: uuid(), content: newCard('magma titan') },
  { id: uuid(), content: newCard('big cannon') },
  { id: uuid(), content: newCard('scavenger') },
  { id: uuid(), content: newCard('hydra') },
  { id: uuid(), content: newCard('spacemarine') },
];

const sauropod_Deck = [
  { id: uuid(), content: newCard('sauropod') },
  { id: uuid(), content: newCard('sauropod') },
  { id: uuid(), content: newCard('bigshark') },
  { id: uuid(), content: newCard('magma titan') },
  { id: uuid(), content: newCard('big cannon') },
  { id: uuid(), content: newCard('scavenger') },
  { id: uuid(), content: newCard('hydra') },
  { id: uuid(), content: newCard('sauropod') },
];

const titandeck = [
  { id: uuid(), content: newCard('magma titan') },
  { id: uuid(), content: newCard('magma titan') },
  { id: uuid(), content: newCard('hydra') },
  { id: uuid(), content: newCard('spacemarine') },
  { id: uuid(), content: newCard('tribal shield') },
  { id: uuid(), content: newCard('minibot') },
  { id: uuid(), content: newCard('tribal shield') },
  { id: uuid(), content: newCard('minotaur') },
];

const entdeck = [
  { id: uuid(), content: newCard('ent') },
  { id: uuid(), content: newCard('ent') },
  { id: uuid(), content: newCard('ent') },
  { id: uuid(), content: newCard('ent') },
  { id: uuid(), content: newCard('bigshark') },
  { id: uuid(), content: newCard('bigshark') },
  { id: uuid(), content: newCard('big cannon') },
  { id: uuid(), content: newCard('minibot') },
];

const stack2 = [
  { id: uuid(), content: newCard('minibot') },
  { id: uuid(), content: newCard('bigbot') },
  { id: uuid(), content: newCard('shark') },
  { id: uuid(), content: newCard('bigshark') },
  { id: uuid(), content: newCard('ent') },
  { id: uuid(), content: newCard('bigbot') },
  { id: uuid(), content: newCard('tribal shield') },
  { id: uuid(), content: newCard('minotaur') },
];

const columnsFromBackend = {
  p1Back: {
    name: 'p1 back (+)',
    items: entdeck,
  },
  p1Front: {
    name: 'p1 front',
    items: [],
  },
  p2Front: {
    name: 'p2 front',
    items: [],
  },
  p2Back: {
    name: 'p2 back (+)',
    items: sauropod_Deck,
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
  const snapshot = useProxy(CURRENT, { sync: true });

  const resolveTurnActions = () => {
    if (snapshot.state == STATE.p1.attack) {
      let newCols = { ...columns };

      let { attCards, defCards } = processCombat(
        newCols.p1Front.items,
        newCols.p2Front.items,
      );

      attCards.forEach((e, i) => {
        processEndOfTurnActions(e, true);
        const left = i > 0 ? getPower(attCards[i - 1], POW.heal) : 0;
        const right =
          i < attCards.length - 1 ? getPower(attCards[i + 1], POW.heal) : 0;
        healUnit(e, left + right);
      });
      newCols.p1Back.items.forEach((e) => processEndOfTurnActions(e));

      newCols.p1Front.items = attCards;
      newCols.p2Front.items = defCards;

      setColumns(newCols);
      // CURRENT.state = nextState(snapshot.state);
    } else if (snapshot.state === STATE.p2.attack) {
      let newCols = { ...columns };
      let { attCards, defCards } = processCombat(
        newCols.p2Front.items,
        newCols.p1Front.items,
      );
      attCards.forEach((e, i) => {
        processEndOfTurnActions(e, true);
        const left = i > 0 ? getPower(attCards[i - 1], POW.heal) : 0;
        const right =
          i < attCards.length - 1 ? getPower(attCards[i + 1], POW.heal) : 0;
        healUnit(e, left + right);
      });
      newCols.p2Back.items.forEach((e) => processEndOfTurnActions(e));

      newCols.p2Front.items = attCards;
      newCols.p1Front.items = defCards;

      setColumns(newCols);
      // CURRENT.state = nextState(snapshot.state);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ width: 600, padding: 50 }}>
        <pre style={{ margin: '32px', fontSize: '16px' }}>
          {JSON.stringify(
            {
              'current turn': snapshot.state,
              'p1 health': snapshot.p1.health,
              'p2 health': snapshot.p2.health,
            },
            null,
            2,
          )}
        </pre>
        <pre style={{ margin: '32px', fontSize: '16px', minHeight: '40px' }}>
          {snapshot.selectedCard?.pow?.map(([name, _]) => (
            <div>
              <strong>{name}</strong>: {POW_DESCRIPT[name]}
            </div>
          ))}
        </pre>
        <button
          onClick={() => {
            CURRENT.state = nextState(snapshot.state);
            resolveTurnActions();
          }}
        >
          next state
        </button>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', height: '100%' }}
      >
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination: dest } = result;
            const noMove =
              !dest ||
              (source.index == dest.index &&
                source.droppableId == dest.droppableId);

            if (noMove) {
              return;
            }
            onDragEnd(result, columns, setColumns);

            const invalidMove =
              (source.droppableId == 'p1Back' &&
                dest.droppableId == 'p1Back') ||
              (source.droppableId == 'p2Back' && dest.droppableId == 'p2Back');
            if (invalidMove) return;

            CURRENT.state = nextState(snapshot.state);
            resolveTurnActions();
            // if (snapshot.state) {
            //   CURRENT.state = nextState(snapshot.state);
            //   resolveTurnActions();
            // }
          }}
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
    </div>
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
            padding: 16,
            width: 250,
            minHeight: 500,
            overflowY: 'scroll',
            maxHeight: 1000,
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
  const snapshot = useProxy(CURRENT, { sync: true });

  const { name, attack, health, pow, wait } = item.content;
  const maxHealth = getBaseStat(name).health;
  const maxAttack = getBaseStat(name).attack;
  const numStyle = {
    fontSize: 24,
    padding: 8,
    border: '1px solid black',
    borderRadius: 8,
    margin: 4,
  };

  return (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
      // can't move cards in attack phase
      isDragDisabled={[STATE.p1.attack, STATE.p2.attack].includes(
        snapshot.state,
      )}
    >
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              padding: 16,
              margin: '0 0 8px 0', // if you just specify 8 all around margin you get an ugly pop effect on drop
              minHeight: '120px',
              backgroundColor: snapshot.isDragging
                ? '#263B4A'
                : wait > 0
                ? 'gray'
                : '#456C86',
              color: 'white',
              ...provided.draggableProps.style,
            }}
            onMouseEnter={() => {
              CURRENT.selectedCard = item.content;
            }}
            onMouseLeave={() => {
              CURRENT.selectedCard = null;
            }}
          >
            <strong>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{name}</div>
                <img
                  style={{
                    maxHeight: 60,
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                  src={getIcon(name)}
                />
                <div>{wait > 0 && ' * '.repeat(wait)}</div>
              </div>
            </strong>
            <br />

            {pow}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div
                style={{
                  ...numStyle,
                  color:
                    maxAttack > attack
                      ? 'tomato'
                      : maxAttack < attack
                      ? 'Chartreuse'
                      : 'white',
                }}
              >
                {attack}
              </div>
              <div
                style={{
                  ...numStyle,
                  color:
                    maxHealth > health
                      ? 'tomato'
                      : maxHealth < health
                      ? 'Chartreuse'
                      : 'white',
                }}
              >
                {health}
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Board;
