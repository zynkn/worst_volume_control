import React from 'react';
import {useSpring, animated, interpolate} from 'react-spring'
import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import IconVolume from './IconVolume'

const velocity = 20;
const gravity = 9.8;
const time = 1;

function App() {
  const [count, setCount] = useState(0);
  const [shoot, setShoot] = useState(false);
  const [result, setResult] = useState(0);
  const {onMouseDown, onMouseUp, onMouseLeave} = useLongPress(()=>{
    setCount((prev:number)=>{
      return prev < 300 ? prev+1 : prev;
    })
  },10);

  const rotate = useSpring({ display: 'inline-block', cursor: 'pointer', transform: `rotate(-${count*15/100}deg)`});
  const fill = useSpring({fill: `rgba(0,208,132,${count/200})` });
  const translate = useSpring({ transform: `translateX(${result}px)`, visibility: 'visible'});
  const hidden = useSpring({ visibility: 'hidden'});
  let T = count/100;
  let seta = 45 * Math.PI /180;
  let x = velocity*Math.cos(seta)*T;
  let y = velocity*Math.sin(seta)*T - (gravity*T*T*0.5);
  let top = velocity*Math.sin(seta)/gravity;
  console.log(seta,T, x.toFixed(2),y.toFixed(2),top);
  function handleMouseDown(){
    onMouseDown();
    
    setShoot(false);
    setResult(0);

    setCount(0);
  }
  function handleMouseUp(){
    onMouseUp();

    console.log(Math.cos(count*15/100));
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
      <br/>
      <div>

      </div>

    </>
    
  )
}

export default App;

function useMeasure() {
  const ref = useRef<any>()
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [ro] = useState(() => new ResizeObserver(([entry]:any) => set(entry.contentRect)))
  useEffect(() => (ro.observe(ref.current), ro.disconnect), [])
  return [{ ref }, bounds]
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