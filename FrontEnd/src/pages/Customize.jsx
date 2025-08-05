import React, { useContext, useRef, useState} from 'react'
import c1 from "../assets/c1.jpeg"
import c2 from "../assets/c2.jpeg"
import c3 from "../assets/c3.jpeg"
import c4 from "../assets/c4.jpeg"
import c5 from "../assets/c5.jpeg"
import c6 from "../assets/c6.jpeg"
import c7 from "../assets/c7.jpeg"
import Card from "../Component/Card"
import { RiImageAddFill } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";


const Customize = () => {
  const {serverURL, userData, setUserData, backendImage, setbackendImage, frontendImage, setfrontendImage, selectedImage, setselectedImage} = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()
  const handleImage=(e)=>{
    const file = e.target.files[0]
    setbackendImage(file)
    setfrontendImage(URL.createObjectURL(file))
  }



  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#00fff7]
 flex justify-center items-center flex-col p-[20px] '>
       <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-black w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/") } />
       <h1 className='text-white mb-[40px] text-[30px] text-center '>Select your <span className='text-black'>Assistant Face</span></h1>
       <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px] '>
            <Card image={c6}/>
            <Card image={c2}/>
            <Card image={c7}/>
            <Card image={c3}/>
            <Card image={c5}/>
            <Card image={c1}/>
            <Card image={c4}/>
            <div className= { `w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl shadow-[0_0_15px_#00fff7] overflow-hidden cursor-pointer hover:border-2 hover:border-white flex items-center justify-center ${selectedImage==  "input"?"border-2 border-white shadow-2xl shadow-blue-950" : null}` } onClick={()=>{inputImage.current.click(); setselectedImage("input") }}>
              {!frontendImage && <RiImageAddFill className='text-white w-[25px] h-[25px]'/>}
              {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
            </div>
            <input type="file" accept = 'image/*' ref={inputImage} hidden onChange={handleImage}/>
       </div>
       {selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[18px] shadow-[0_0_15px_#00fff7]' onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  )
}

export default Customize
