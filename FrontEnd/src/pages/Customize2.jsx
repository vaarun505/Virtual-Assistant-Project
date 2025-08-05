import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from "axios"
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {userData, backendImage, selectedImage, serverUrl, setUserData}  = useContext(userDataContext) 
  const [assistantName, setAssistantName] = useState(userData ?. AssistantName || "")
  const [loading, setloading] = useState(false)
  const navigate= useNavigate()



  const handleUpdateAssistant = async()=>{
    setloading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if(backendImage){
        formData.append("assistantImage", backendImage)
      }
      else {
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials:true})
      setloading(false)
      console.log(result.data)
      setUserData(result.data)
      navigate("/")

    } catch (error) {
      setloading(false)
      console.log(error)     
    }
  }
  

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#00fff7]
 flex justify-center items-center flex-col p-[20px] relative'>
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-black w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/customize") } />
      <h1 className='text-white mb-[40px] text-[30px] text-center '>Enter Your <span className='text-black drop-shadow-[0_0_8px_#00fff7]'>Assistant Name</span></h1>

      <input type="text" placeholder='eg. Friday' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[20px]' required value={assistantName} onChange={(e) => setAssistantName(e.target.value)} />
      <button className='min-w-[250px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[20px] shadow-[0_0_15px_#00fff7]' disabled = {loading} onClick={()=>{handleUpdateAssistant()}}>{!loading?"Create Assistant":"Loading..."}</button>
    </div>
  )
}

export default Customize2
