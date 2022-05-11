import React, {useEffect, useState} from 'react'
import Scala from "../../media/img/scala.png"
import "./style.css"

function MouseDot(props) {
  // icon tag
  const ICONS_TAG = {
    default_icon : Scala,
  }

  // STATES
  const [left, setLeft] = useState(-50)
  const [top, setTop] = useState(-50)

  // mouse movement event listener handler
  useEffect(() => {
    function handleMouseMovement(e) {
      let clientX = e.clientX - 40
      let clientY = window.scrollY + e.clientY + 20
      setLeft(clientX)
      setTop(clientY)
    }

    document.addEventListener("mousemove", handleMouseMovement)

    return () => document.removeEventListener('mousemove', handleMouseMovement)
  }, []) 

  return (
    <div 
    id="mouse_dot"
    style={{top: top + "px", left: left + "px"}}>
      <img src={Scala} className="icon" />
    </div>
  )
}

export default MouseDot