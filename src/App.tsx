import React from 'react';
import {useSpring, animated, interpolate} from 'react-spring'
import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import IconVolume from './IconVolume'

const velocity = 100;
const gravity = 9.8;
const time = 1;

function App() {
  const [value,setValue] = useState(50);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [count, setCount] = useState(0);
  const [shoot, setShoot] = useState(false);
  const [result, setResult] = useState(0);
  const {onMouseDown, onMouseUp, onMouseLeave} = useLongPress(()=>{
    setCount((prev:number)=>{
      return prev < 300 ? prev+1 : prev;
    })
  },10);
  useParabola(result*15/100, Number(value), (_x:any,_y:any)=>{
    setX(_x);
    setY(_y);
  });
  
  const rotate = useSpring({ display: 'inline-block', cursor: 'pointer', transform: `rotate(-${count*15/100}deg)`});
  const fill = useSpring({fill: `rgba(0,208,132,${count/200})` });
  const translate = useSpring({ transform: `translate(${x-50}px, ${(y)*-1}px)`, visibility: 'visible'});
  const hidden = useSpring({ visibility: 'hidden', transform: `translate(50px, 0px)`});


  function handleMouseDown(){
    onMouseDown();
    setShoot(false);
    setResult(0);
    setX(0);
    setY(0);
    setCount(0);
  }
  function handleMouseUp(){
    onMouseUp();

    setResult(count);
    setShoot(true);
    setCount(0);
  }
  function handleMouseLeave(){
    //setResult(count);

    onMouseLeave();
    setShoot(true);
  }
  return (
    <>
      <animated.div style={{...rotate, marginRight: '16px'}}  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
          <IconVolume style={fill} />
        </animated.div>
      <div  className="main">
        <animated.div className="content">{count}</animated.div>
        <animated.div style={{color: 'white'}}>{count*15}</animated.div>
        <animated.div className="dot" style={shoot ? translate : hidden} />
        <div className="bar" />
      </div>
      <input type="text" value={value} onChange={(e:any)=>setValue(e.target.value)} />


    </>
    
  )
}

export default App;



// let T = count/100;
// let seta = 45 * Math.PI /180;
// let x = velocity*Math.cos(seta)*T;
// let y = velocity*Math.sin(seta)*T - (gravity*T*T*0.5);
// let top = velocity*Math.sin(seta)/gravity;
// console.log(seta,T, x.toFixed(2),y.toFixed(2),top);

function useParabola(degree:number,velocity:number, callback:any){
  React.useEffect(()=>{
    let timerId:any = null;
    let ms = 0;
    if(degree !==0){
      const RADIAN = degree*Math.PI/180;
      let top = velocity*Math.sin(RADIAN)/gravity;
      console.log(`입력한 각도 : ${degree}, 최대 높이 도달 시간 : ${top}seconds, 속도: ${velocity}`);
      let x = velocity*Math.cos(RADIAN)*top;
      let y = velocity*Math.sin(RADIAN)*top - (gravity*top*top*0.5);
      console.log(`최대 도달 좌표 x: ${x}, y: ${y}`);
      let _x = velocity*Math.cos(RADIAN)*top*2;
      let _y = velocity*Math.sin(RADIAN)*top*2 - (gravity*top*4*top*0.5);
      console.log(`착지 예상 좌표 x: ${_x}, y: ${_y}`);

        timerId = setInterval(()=>{
          let s = ms/1000;
          let __x = velocity*Math.cos(RADIAN)*s;
          let __y = velocity*Math.sin(RADIAN)*s - (gravity*s*s*0.5);
          console.log(ms, __x,__y);
          callback(__x,__y);
          if(__y < 0){
            clearInterval(timerId);
          }else{
            ms+=100;
          }
        }, 10);
    }
  },[degree]);
  return {x:1,y:1};
}

function useLongPress(callback:any = ()=>{}, interval:number = 1000){
  const [pressing, setPressing] = React.useState(false);

  React.useEffect(()=>{
    let timerId:any = null;
    if(pressing){
      timerId = setTimeout(callback, interval);
    }else{
      clearTimeout(timerId);
    }
    return() => {
      clearTimeout(timerId);
    }
  },[callback, interval, setPressing]);

  return {
    onMouseDown: ()=>setPressing(true),
    onMouseUp: () => setPressing(false),
    onMouseLeave: () => setPressing(false),
    onTouchStart: () => setPressing(true),
    onTouchEnd: () => setPressing(false),
  };
}