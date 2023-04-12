import React, { useEffect } from 'react'
import { css } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'






const ProjectEditor = () => {

  const dispatch = useDispatch()
  const { projectlist } = useSelector((state) => state.project)
    const getProjectList = () => {
        dispatch({
            type: "FETCH_Project_LIST",
            payload: {
                gqlMethod: "query",
                api: "projects",
                response: "_id name  documents {_id title content}",
            },
        });
    };
  console.log(projectlist)
  
  useEffect(() => {
    console.log("projectList",projectlist)
    // getProjectList()
  }, [projectlist])

  return (
    <div>ProjectEdeeeitor</div>
  )
}

export default ProjectEditor