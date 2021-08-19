import React, { ReactElement, useRef } from 'react'

interface Figure {
  x: number,
  y: number,
  fig: string,
  isBorder: boolean,
  isDrag: boolean,
}

const Canvas = (): ReactElement => {
  const radiusCircle = 25;
  const canvasRef = useRef(null);
  const arrFigures = [] as Figure[];
  let startDrag: {
    x: number,
    y: number,
  };
  let coordCursorOnFigure: {
    dx: number,
    dy: number,
  };

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
    const canvas = canvasRef.current;
    if(canvas) {
       draw(figureX, figureY, canvas, figure);
       arrFigures.push({x: figureX, y: figureY, fig: figure, isDrag: false, isBorder: false});
    }
  }

  function checkMouseDown(e: any){
    const cursor = {
      x: e.clientX - e.target.getBoundingClientRect().x,
      y: e.clientY - e.target.getBoundingClientRect().y,
    };
    startDrag = {
      x: e.clientX,
      y: e.clientY,
    };

    if (arrFigures.length) {
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, 700, 600);
      for (let i = 0; i < arrFigures.length; i += 1) {
        const {x, y, fig}: Figure = arrFigures[i];
        draw(x , y, canvas, fig, false );
        arrFigures[i].isBorder = false;
      }

      for (let i = arrFigures.length - 1; i >= 0; i -= 1) {
        const {x, y, fig}: Figure = arrFigures[i];
        if ((fig === 'square' && cursor.x > x && cursor.x < (x + 50) && cursor.y > y && cursor.y < (y + 50)) || 
        (fig === 'circle' && Math.sqrt((cursor.x - x - radiusCircle) ** 2 + (cursor.y - y - radiusCircle) ** 2) <= radiusCircle)) {
          draw(x , y, canvas, fig, true );
          arrFigures.push({...arrFigures[i], isDrag: true, isBorder: true});
          arrFigures.splice(i, 1);
          coordCursorOnFigure = {
            dx: cursor.x - x,
            dy: cursor.y - y,
          }
          break;
        } 
      }
    }
  }
  function checkMouseUp(e: any) {
    if (arrFigures.length) {
      for (let i = 0; i < arrFigures.length; i += 1) {
        if (arrFigures[i].isDrag) {
          arrFigures[i].isDrag = false;
          const cursor = {
            x: e.clientX - e.target.getBoundingClientRect().x,
            y: e.clientY - e.target.getBoundingClientRect().y,
          };
          arrFigures[i].x = cursor.x - coordCursorOnFigure.dx;
          arrFigures[i].y = cursor.y - coordCursorOnFigure.dy;
        }
      }
    }
  }
  function checkMouseMove(e: any) {
    if (arrFigures.length) {
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, 700, 600);
      for (let i = 0; i < arrFigures.length; i += 1) {
        const {x, y, fig, isBorder}: Figure = arrFigures[i];
        if (arrFigures[i].isDrag === true) {
          const cursorMove = {
            x: e.clientX - startDrag.x,
            y: e.clientY - startDrag.y,
          }
          draw(Math.min(x + cursorMove.x, 650) , Math.min(y + cursorMove.y, 550), canvas, fig, true );
        } else draw(x, y, canvas, fig, isBorder);
      }
    }
  }
  function checkMouseLeave(e) {
    if (arrFigures.length) {
      for (let i = 0; i < arrFigures.length; i += 1) {
        if (arrFigures[i].isDrag) {
          arrFigures[i].isDrag = false;
          const cursor = {
            x: e.clientX - e.target.getBoundingClientRect().x,
            y: e.clientY - e.target.getBoundingClientRect().y,
          };
          arrFigures[i].x = Math.min(cursor.x - coordCursorOnFigure.dx, 650);
          arrFigures[i].y = Math.min(cursor.y - coordCursorOnFigure.dy, 550);
        }
      }
    }
  }
  return (
    <canvas ref={canvasRef} width='700' height="600" className="canvas"
      onDragOver={(event)=>event.preventDefault()}
      onDrop={(event)=>dropHandler(event)}
      onMouseDown={checkMouseDown}
      onMouseUp={checkMouseUp}
      onMouseMove={checkMouseMove}
      onMouseLeave={checkMouseLeave}>
      Your browser do not support Canvas...
    </canvas>
  )
}

export default Canvas