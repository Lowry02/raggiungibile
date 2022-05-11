import React from 'react'
import PropTypes from 'prop-types';
import "./style.css"

function Navbar(props) {
  let ballsNumber = props.ballsNumber
  let ballSelected = props.ballSelected
  let scrollFunction = props.scrollFunction

  return (
    <div id="navbar" className="clickable">
      {
        Array.from(Array(ballsNumber)).map((_, i) => 
          <div onClick={(e) => scrollFunction(e, i)} key={i} className={(i + 1 == ballSelected ? "ball selected bounce" : "ball bounce")}></div>
        )
      }
    </div>
  )
}

Navbar.propTypes = {
  ballsNumber: PropTypes.number.isRequired,
  ballSelected: PropTypes.number.isRequired,
  scrollFunction: PropTypes.func.isRequired
}

export default Navbar