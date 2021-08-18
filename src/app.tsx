import React, { ReactElement } from 'react';
import Canvas from './canvas';

const App = (): ReactElement => {

  function dragStartHandler(e: React.DragEvent) {
    const data = `${e.target.id}X${e.clientX - e.target.getBoundingClientRect().x}Y${e.clientY - e.target.getBoundingClientRect().y}`;
    e.dataTransfer.setData("text/plain", data);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Figures</th>
          <th>Canvas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="section-figures">
              <div className="circle" 
                id="circle"
                draggable="true"
                onDragStart={(e)=>{dragStartHandler(e)}}
              >.</div>
              <div className="square" 
                id="square" 
                draggable="true"
                onDragStart={(e)=>{dragStartHandler(e)}}
              >.</div>
            </div>
          </td>
          <td>
            <Canvas />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default App;
