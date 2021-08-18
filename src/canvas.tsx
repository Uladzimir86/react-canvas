import React, { ReactElement, useRef } from 'react'

const Canvas = (): ReactElement => {
  const radiusCircle = 25;
  const canvasRef = useRef(null);

  const draw = (x: number, y: number, canvas: HTMLCanvasElement, figure: string) => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    switch (figure) {
      case 'circle': 
        context.beginPath();
        context.arc(x + radiusCircle, y + radiusCircle, 25, 0, 2 * Math.PI, true);
        context.fillStyle = 'blue';
        context.fill();
        context.stroke();
        break;
      case 'square':
        context.fillStyle = 'green';
        context.fillRect(x, y, 50, 50);
        context.strokeRect(x, y, 50, 50);
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
      const canvas = canvasRef.current as HTMLCanvasElement;
      if(canvas) {
         draw(figureX, figureY, canvas, figure);
      }
    }
  }
  return (
    <canvas ref={canvasRef} width='700' height="600" 
      onDragOver={(event)=>event.preventDefault()}
      onDrop={(event)=>dropHandler(event)}>
      Your browser do not support Canvas...
    </canvas>
  )
}

export default Canvas