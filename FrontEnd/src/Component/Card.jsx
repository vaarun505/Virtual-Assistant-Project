import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
  const {serverURL, userData, setUserData, backendImage, setbackendImage, frontendImage, setfrontendImage, selectedImage, setselectedImage} = useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl shadow-[0_0_25px_#00fff7]
 cursor-pointer hover:border-2 hover:border-white ${selectedImage==image?"border-2 border-white shadow-2xl shadow-blue-950" : null}`} onClick={()=>{setselectedImage(image)
      setbackendImage(null)
      setfrontendImage(null)
    }}>
      <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card
