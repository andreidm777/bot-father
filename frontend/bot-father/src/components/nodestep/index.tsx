import { NodeProps } from 'reactflow';
import { useState } from 'react';
import React from 'react';

import './nodestep.css';

export type CounterData = {
  initialCount?: number;
};
 
export default function NodeStep(props: NodeProps<CounterData>) {
  const [count, setCount] = useState(props.data?.initialCount ?? 0);
 
  return (
    <div className="NodeStep">
      <p>Count: {count}</p>
      <button className="nodrag" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}