import React, { createContext, useEffect, useState } from 'react'
import axios from "axios"


export const userDataContext = createContext()
function UserContext({children}){
    
    const serverUrl = "http://localhost:8000"
    const [userData, setUserData] = useState(null)
    const [frontendImage, setfrontendImage] = useState(null)
    const [backendImage, setbackendImage] = useState(null)
    const [selectedImage, setselectedImage] = useState(null)

    const handleCurrentUser = async ()=>{
      try {
        let result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
        setUserData(result.data)
        console.log(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const getGeminiResponse = async (command)=>{
      try {
        const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, {command},{withCredentials:true})
        return result.data
      } catch (error) {
        console.log(error)        
      }
    }

    useEffect(()=>{
      handleCurrentUser()
    },[])

    const value = { serverUrl, userData, setUserData, backendImage, setbackendImage, frontendImage, setfrontendImage, selectedImage, setselectedImage, getGeminiResponse }
  return (
    <div>
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
