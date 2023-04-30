import React, { useState, useEffect } from 'react';
import { Nav, Collapse } from "react-bootstrap";
import { useSelector } from 'react-redux';
import useRouter from '../../hooks/use-router';

const SystemItem = () => {
  const { sidebar } = useSelector(state => state.auth)
  const [open, setOpen] = useState({});
  const [prevOpen, setPrevOpen] = useState("");


  useEffect(() => {
    let func = {}
    sidebar && Object.keys(sidebar).map((val, i) => (func[val] = false))
    setOpen(func)
  }, [sidebar])

  const set_open = (func) => {
    (prevOpen !== func) ? setOpen((prev) => ({ ...prev, [func]: true, [prevOpen]: false })) :
      (open[func]) ? setOpen((prev) => ({ ...prev, [func]: false })) :
        setOpen((prev) => ({ ...prev, [func]: true }));
    setPrevOpen(func)
  }

  return (
    <>
      {sidebar && Object.keys(sidebar).map((val, i) =>
        <div key={i}>
          <Nav.Item className="main-item" >
            <Nav.Link
              onClick={() => set_open(val)}
              aria-controls={val}
              aria-expanded={open[val]}>
              <div className="sb-icon">{val}</div>
              <div className="sb-title">{sidebar[val].name}&emsp;<i className="fas fa-angle-down fa-sm"></i></div>
            </Nav.Link>
          </Nav.Item >
          <Collapse in={open[val]}>
            <div id={val}>
              {sidebar[val].system.map((val0, i) => (
                <Nav.Item className="sub-item" key={i}>
                  <Nav.Link href={val0.url} target="_blank">
                    <div className="sb-icon">{val0.code}</div>
                    <div className="sb-title">{val0.name}</div>
                  </Nav.Link>
                </Nav.Item >
              ))
              }
            </div>
          </Collapse >
        </div>
      )}
    </>
  )
}

export default SystemItem