import React, { useEffect ,useState} from 'react'

const SyncIndicator = ({ Editorindicator }) => {
    const [indicator, setIndicator] = useState(true)
    

    useEffect = (() => {
        console.log('indicator', indicator)
        setIndicator(indicator)
    }, [Editorindicator.current])


  return (
    <div>{indicator?"sync":"not sync"}</div>
  )
}

export default SyncIndicator