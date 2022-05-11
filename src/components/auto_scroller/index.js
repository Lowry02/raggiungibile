import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import $ from "jquery"
import "./style.css"

function AutoScroller(props) {
  let children = props.children
  let onChange = props.onChange
  let isActive = props.isActive == undefined ? true : props.isActive
  let externalElement = props.listenerOn // external element to assign to scrollManager()
  let activeSection = props.activeSection // used to set section from the outside

  const currentSection = useRef(undefined)
  const containerRef = useRef()
  const last_time_stamp = useRef(0) // stores scroll event timestamp
  const observer = useRef(new IntersectionObserver(() => {})) // used to change currentSection state when is not active

  // used to scroll to a specific section
  // n is the array child position
  function scrollTo(sectionIndex) {
    let container = containerRef.current
    let containerChildren = [...container.children]

    // checking if sectionIndex is a valid index
    if(sectionIndex >= 0 && sectionIndex < containerChildren.length) {
      let section = containerChildren[sectionIndex]
      if(section != currentSection.current) {
        let scrollPosition = $(section).offset()?.top
        $("html,body").animate({ scrollTop: scrollPosition }, 'fast');
        currentSection.current = section
      }
    }
  } 

  // function used to manage the scroll using children position
  function scrollManager(e) {
    if(isActive) {
      let container = containerRef.current
      let containerChildren = [...container.children]
      
      // on the first laod currentSection is undefined
      if(currentSection.current == undefined)
        currentSection.current = containerChildren[0]
  
      if(e.timeStamp - last_time_stamp.current > 100) {
        let currentSectionIndex = containerChildren.indexOf(currentSection.current)
        let nextSectionIndex = currentSectionIndex
  
        // deltaY represent the direction of the scroll
        if(e.deltaY > 0 && currentSectionIndex < children.length - 1) nextSectionIndex = currentSectionIndex + 1
        else if(e.deltaY < 0 && currentSectionIndex > 0) nextSectionIndex = currentSectionIndex - 1

        if(nextSectionIndex != currentSectionIndex) {
          let nextSection = containerChildren[nextSectionIndex]
          let scrollPosition = $(nextSection).offset()?.top
  
          // starting animation
          $("html,body").animate({ scrollTop: scrollPosition }, 'fast');
  
          // saving new current section
          currentSection.current = nextSection
        }
  
        // execute external function
        // passes current section as parameter
        if(onChange != undefined) onChange(nextSectionIndex)
      } 
      
      last_time_stamp.current = e.timeStamp
    }
  }

  useEffect(() => {
    // add wheel listener to an external element (if necessary)
    if(externalElement) externalElement.addEventListener("wheel", scrollManager)

    // removing listener
    return () => {
      if(externalElement) externalElement.removeEventListener("wheel", scrollManager)
    }
  }, [externalElement])

  useEffect(() => {
    // manage body overflow in base of isActive
    if(isActive) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""

    // updates currentState when isActive = false
    // disconnect observer on isActive change
    if(isActive) {
      // remove observer
      observer.current.disconnect()
    } else {
      // implement observer

      let containerChildren = [...containerRef.current.children]
      
      observer.current = new IntersectionObserver((e) => {
        let containerChildren = [...containerRef.current.children]
        let element = e[0]

        if(element != undefined) {
          // if section is going out from the screen
          if(!element['isIntersecting']) {
            let notIntersectingElement = element['target']
            // understanding scroll direction
            let isScrollingUp = element['boundingClientRect']['top'] > 0
            // getting exited section index
            let currentSectionIndex = containerChildren.indexOf(notIntersectingElement)
            // finding next section index
            let nextSectionIndex
            if(isScrollingUp) nextSectionIndex = currentSectionIndex - 1
            else nextSectionIndex = currentSectionIndex + 1

            // updating states
            if(nextSectionIndex >= 0) currentSection.current = containerChildren[nextSectionIndex]
            if(onChange != undefined && nextSectionIndex >= 0) onChange(nextSectionIndex)
          }
        }
      }, {rootMargin: "-150px"})   // otherwise the last section wasn't considered

      for(let child of containerChildren) observer.current.observe(child)  
    }
  }, [isActive])

  // set section from the outside
  useEffect(() => {
    if(activeSection != undefined && activeSection != -1) {
      scrollTo(activeSection)
      if(onChange != undefined) onChange(activeSection)
    }
  }, [activeSection])  

  useEffect(() => {
    // restore body overflow
    return () => document.body.style.overflow = ""
  }, [])

  return (
    <>
      {
        isActive && externalElement == undefined ?
          <div onWheel={externalElement ? () => {} : scrollManager} id="auto_scroller_layer"></div>
          : "" 
      }
      <div ref={containerRef}>
        {children.map(child => child)}
      </div>
    </>
  )
}

AutoScroller.propTypes = {
  onChange: PropTypes.func,
  listenerOn: PropTypes.instanceOf(Element),
  isActive: PropTypes.bool,
  activeSection: PropTypes.number,
}

export default AutoScroller