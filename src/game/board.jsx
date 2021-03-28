//@ts-check

import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { proxy, useProxy } from 'valtio';
import { getIcon, POW, POW_DESCRIPT, RAW_CARDS } from './data';

const newCard = (name) => ({ ...RAW_CARDS.find((e) => e.name == name) });
const getBaseStat = (name) => RAW_CARDS.find((e) => e.name === name);
const getPower = ({ content }, power) => {
  const p = content.pow?.find(([powName, _]) => powName == power);
  return p ? p[1] : 0;
};

const stack1 = [
  { id: uuid(), content: newCard('sauropod') },
  { id: uuid(), content: newCard('midbot') },
  { id: uuid(), content: newCard('snake') },
  { id: uuid(), content: newCard('magma titan') },
  { id: uuid(), content: newCard('big cannon') },
  { id: uuid(), content: newCard('scavenger') },
];
const stack2 = [
  { id: uuid(), content: newCard('minibot') },
  { id: uuid(), content: newCard('bigbot') },
  { id: uuid(), content: newCard('shark') },
  { id: uuid(), content: newCard('bigshark') },
  { id: uuid(), content: newCard('ent') },
  { id: uuid(), content: newCard('wraith') },
];

const columnsFromBackend = {
  p1Back: {
    name: 'p1 back (+)',
    items: stack1,
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

const nextState = (curState) => {
  const { p1, p2 } = STATE;
  switch (curState) {
    case p1.move:
      return p1.attack;
    case p1.attack:
      return p2.move;
    case p2.move:
      return p2.attack;
    case p2.attack:
      return p1.move;
  }
};

const CURRENT = proxy({
  state: STATE.p1.move,
  selectedCard: null,
  p1: {
    health: 20,
  },
  p2: {
    health: 20,
  },
});

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

const processCombat = (attCards, defCards) => {
  //attack
  attCards.forEach((e, i) => {
    if (e.content.wait > 0) {
      return;
    }
    try {
      let pierce = getPower(e, POW.pierce);
      let totalDmg =
        Math.max(
          0,
          e.content.attack - getPower(defCards[i], POW.armor) - pierce,
        ) +
        // pierce goes right through armor
        pierce;
      defCards[i].content.health -= totalDmg;
      const killedEnemy = defCards[i].content.health <= 0;
      if (killedEnemy) {
        e.content.health += getPower(e, POW.rage);
        e.content.att += getPower(e, POW.absorb);
      }
      e.content.health -= getPower(defCards[i], POW.avenge);
    } catch (_) {
      // no adversary
      CURRENT.p2.health -= e.content.attack;
    }
  });
  // remove dead
  attCards = attCards.filter((e) => e.content.health > 0);
  defCards = defCards.filter((e) => e.content.health > 0);
  return {
    attCards,
    defCards,
  };
};
const processEndOfTurnActions = (e) => {
  // regen
  e.content.health = Math.min(
    e.content.health + getPower(e, POW.regen),
    getBaseStat(e.content.name).health,
  );
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

      attCards.forEach(processEndOfTurnActions);
      attCards.forEach((e) => {
        e.content.wait = Math.max(0, e.content.wait - 1);
      });
      newCols.p1Back.items.forEach(processEndOfTurnActions);
      newCols.p1Back.items.forEach((e) => {
        // backrow gains 1 health per turn
        e.content.health = Math.min(
          e.content.health + 1,
          getBaseStat(e.content.name).health,
        );
      });

      newCols.p1Front.items = attCards;
      newCols.p2Front.items = defCards;
      // all units in backrow heal 1, up to orig health
      // columns.p1Back.items.forEach((e) => {
      //   e.content.hp = Math.min(
      //     e.content.hp + 1,
      //     getBaseStat(e.content.name).hp,
      //   );
      // });
      // end of turn powers

      setColumns(newCols);
      // CURRENT.state = nextState(snapshot.state);
    } else if (snapshot.state === STATE.p2.attack) {
      let newCols = { ...columns };
      let { attCards, defCards } = processCombat(
        newCols.p2Front.items,
        newCols.p1Front.items,
      );

      attCards.forEach(processEndOfTurnActions);
      attCards.forEach((e) => {
        e.content.wait = Math.max(0, e.content.wait - 1);
      });
      newCols.p2Back.items.forEach(processEndOfTurnActions);
      newCols.p2Back.items.forEach((e) => {
        // backrow gains 1 health per turn
        e.content.health = Math.min(
          e.content.health + 1,
          getBaseStat(e.content.name).health,
        );
      });

      newCols.p2Front.items = attCards;
      newCols.p1Front.items = defCards;
      // all units in backrow heal 1, up to orig health
      // columns.p1Back.items.forEach((e) => {
      //   e.content.hp = Math.min(
      //     e.content.hp + 1,
      //     getBaseStat(e.content.name).hp,
      //   );
      // });
      setColumns(newCols);
      // CURRENT.state = nextState(snapshot.state);
    }
    console.log(snapshot.state, columns.p1Front.items, columns.p2Front.items);
  };

  return (
    <>
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
              console.log('No move');
              return;
            }
            onDragEnd(result, columns, setColumns);
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
                      ? 'green'
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
                      ? 'green'
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
