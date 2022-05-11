import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home"

function Router() {
  // variables to pass to components
  const [mobileMode, setMobileMode] = useState(false)

  // manage window resize
  function handleResize(e = undefined) {
    // check mobile mode
    setMobileMode(window.innerWidth < 768)
  }

  useEffect(() => {
    // setting listeners
    window.addEventListener('resize', handleResize)
  
    // update mobileMode on first load
    handleResize()

    // remove listsners
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home mobileMode={mobileMode} />} />
      </Routes>
    </div>
  );
}

export default Router;
