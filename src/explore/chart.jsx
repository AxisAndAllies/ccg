//@ts-check
import { camelize, RAW_CARDS } from '../main/data';
import {
  XYPlot,
  MarkSeries,
  VerticalGridLines,
  HorizontalGridLines,
  Hint,
  XAxis,
  YAxis,
} from 'react-vis';
import React, { useState } from 'react';
const data = RAW_CARDS.map((e) => ({
  x: e.health + (Math.random() - 0.5) / 5,
  y: e.attack + (Math.random() - 0.5) / 5,
  size: e.wait,
  name: e.name,
}));
const MainChart = () => {
  const [info, setInfo] = useState({});

  return (
    <div style={{ display: 'flex' }}>
      <XYPlot height={1200} width={1600}>
        <MarkSeries
          data={data}
          // onValueMouseOver={(e) => {
          //   setInfo(e);
          // }}
          style={{ border: '1px solid black' }}
          opacity={0.5}
          animation={true}
          sizeRange={[5, 15]}
          onNearestXY={(val) =>
            setInfo(RAW_CARDS.find((e) => e.name == val.name))
          }
        />
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title="Health" />
        <YAxis title="Attack" />
        {/* <Hint value={info}>
          <div>
            <pre>{JSON.stringify(info, null, 2)}</pre>
          </div>
        </Hint> */}
      </XYPlot>
      <div style={{ padding: 40 }}>
        <div style={{ fontSize: 24 }}>{camelize(info?.name || '')}</div>
        <pre style={{ fontSize: 16 }}>
          {JSON.stringify(
            { ...info, name: undefined, pow: undefined },
            null,
            2,
          )}
        </pre>
        <pre style={{ fontSize: 16 }}>
          {info?.pow?.map((e) => {
            return (
              <div>
                {e[0]} <strong>{e[1]}</strong>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
export default MainChart;
