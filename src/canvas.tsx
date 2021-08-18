import React, { ReactElement, useRef } from 'react'

interface Figure {
  x: number,
  y: number,
  fig: string,
}
const Canvas = (): ReactElement => {
  const radiusCircle = 25;
  const canvasRef = useRef(null);
  const arrFigures = [] as Figure[];

  const draw = (x: number, y: number, canvas: HTMLCanvasElement, figure = 'circle', border = false) => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    switch (figure) {
      case 'circle':
        context.beginPath();
        context.arc(x + radiusCircle, y + radiusCircle, 25, 0, 2 * Math.PI, true);
        context.fillStyle = 'blue';
        context.fill();
        if(border) context.stroke();
        break;
      case 'square':
        context.fillStyle = 'green';
        context.fillRect(x, y, 50, 50);
        if(border) context.strokeRect(x, y, 50, 50);
        break;
      default:
    }
  }

  function dropHandler(event: React.DragEvent<HTMLCanvasElement>) {
    const canvasCoordinates = event.target.getBoundingClientRect();
    const data = event.dataTransfer.getData("text/plain");
    const figure = data.slice(0, data.indexOf('X'));
    const coordCursorOnFigureX = Number(data.slice(data.indexOf('X') + 1, data.indexOf('Y')))
    const coordCursorOnFigureY = Number(data.slice(data.indexOf('Y') + 1))
    const figureX = event.clientX - canvasCoordinates.x - coordCursorOnFigureX;
    const figureY = event.clientY - canvasCoordinates.y - coordCursorOnFigureY;
    if (canvasRef) {
      const canvas = canvasRef.current;
      if(canvas) {
         draw(figureX, figureY, canvas, figure);
         arrFigures.push({x: figureX, y: figureY, fig: figure});
      }
    }
  }
  function checkMouseDown(e: any){
    const cursor = {
      x: e.clientX - e.target?.getBoundingClientRect().x,
      y: e.clientY - e.target?.getBoundingClientRect().y,
    }
    if (arrFigures.length) {
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, 700, 600);
      arrFigures.forEach(item => {
        draw(item.x , item.y, canvas, item.fig, false );
      })
        for (let i = arrFigures.length - 1; i >= 0; i -= 1) {
         const {x, y, fig}: Figure = arrFigures[i];
        if (fig === 'square' && cursor.x > x && cursor.x < (x + 50) && cursor.y > y && cursor.y < (y + 50))  {
          draw(x , y, canvas, fig, true );
          arrFigures.push(arrFigures[i]);
          arrFigures.splice(i, 1);
          break;
        } 
        if (fig === 'circle' && Math.sqrt((cursor.x - x - radiusCircle) ** 2 + (cursor.y - y - radiusCircle) ** 2) <= radiusCircle)  {
          draw(x , y, canvas, fig, true );
          arrFigures.push(arrFigures[i]);
          arrFigures.splice(i, 1);
          break;
        } 
      }
    }
  }
  function checkMouseUp() {
    console.log('checkMouseUp')
  }

  return (
    <canvas ref={canvasRef} width='700' height="600" 
      onDragOver={(event)=>event.preventDefault()}
      onDrop={(event)=>dropHandler(event)}
      onMouseDown={checkMouseDown}
      onMouseUp={checkMouseUp}>
      Your browser do not support Canvas...
    </canvas>
  )
}

export default Canvas