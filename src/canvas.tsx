import React, { ReactElement, useRef, useEffect } from 'react'

interface Figure {
  x: number,
  y: number,
  fig: string,
  isBorder: boolean,
  isDrag: boolean,
}

const Canvas = (): ReactElement => {

  let arrFigures = [] as Figure[];
  const radiusCircle = 25;
  let startDrag: {
    x: number,
    y: number,
  };
  let coordCursorOnFigure: {
    dx: number,
    dy: number,
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Delete') {
        const index = arrFigures.findIndex(item => item.isBorder)
        if (index >= 0) {
          arrFigures.splice(index, 1);
          drawFigures();
        }
      }
    })
    if (sessionStorage.length) {
      arrFigures = [...JSON.parse(sessionStorage.getItem('arrFigures'))];
      deleteBorder();
    }
  }, [])

  const drawFigures = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, 700, 600);
    arrFigures.forEach(({x, y, fig}: Figure) => {
      draw(x, y, canvas, fig, false);
    })
  }

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
  function deleteBorder() {
    const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, 700, 600);
      for (let i = 0; i < arrFigures.length; i += 1) {
        const {x, y, fig}: Figure = arrFigures[i];
        draw(x , y, canvas, fig, false );
        arrFigures[i].isBorder = false;
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
       sessionStorage.setItem('arrFigures', JSON.stringify(arrFigures));
    }
  }

  function mouseDownHandler(e: any){
    e.preventDefault();
    const cursor = {
      x: e.clientX - e.target.getBoundingClientRect().x,
      y: e.clientY - e.target.getBoundingClientRect().y,
    };
    startDrag = {
      x: e.clientX,
      y: e.clientY,
    };

    if (arrFigures.length) {
      deleteBorder();
      const canvas = canvasRef.current;
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

  function mouseUpHandler(e: any) {
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
          sessionStorage.setItem('arrFigures', JSON.stringify(arrFigures));
        }
      }
    }
  }

  function mouseMoveHandler(e: any) {
    e.preventDefault();
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

  function mouseLeaveHandler() {
    if (arrFigures.length) {
      for (let i = 0; i < arrFigures.length; i += 1) {
        if (arrFigures[i].isDrag) {
          arrFigures.splice(i, 1);
          sessionStorage.setItem('arrFigures', JSON.stringify(arrFigures));
          drawFigures();
        }
      }
    }
  }

  function saveCanvas() {
    if (arrFigures.length) {
      const blob = new Blob([JSON.stringify(arrFigures)], {type : 'application/json'});
      const link = document.createElement('a');
      link.download = "canvas.json";
      link.href = URL.createObjectURL(blob);
      link.click();
    } else alert('Nothing to save...')
  }
  
  function importCanvas(e: any) {
    const file = e.target.files[0];
    if (file && file.name.slice(-5) === '.json') {
       const reader = new FileReader();
       reader.onload = function(evt) {
         const data = JSON.parse(evt.target.result);
         if ( Array.isArray(data)) {
           arrFigures = [...data];
           drawFigures();
         } else alert('You chose incorrect file! Please, try another one...');
       }
       reader.readAsText(file);
    } else alert('Please, choose JSON file...');
  }

  return (
    <>
    <canvas ref={canvasRef} width='700' height="600" className="canvas"
      onDragOver={(event)=>event.preventDefault()}
      onDrop={(event)=>dropHandler(event)}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      Your browser do not support Canvas...
    </canvas>
    <div className="button-container">
      <button type="button" className="button" onClick={saveCanvas}>save</button>
      <button className="button" type="button">import
        <input type="file" className="button-input" onChange={importCanvas} />
      </button> 
    </div>
    </>
  )
}

export default Canvas;
