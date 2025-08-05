import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";


const Home = () => {
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const synth =  window.speechSynthesis

  const handleLogOut = async ()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }
  const startRecognition = ()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if(error.name !== "InvalidStateError"){
          console.error("Start error : ", error);
        }
      }
    }
  };

  // const speak =(text)=>{
  //   const utterence = new SpeechSynthesisUtterance(text)
  //   utterence.lang = 'hi-IN';
  //   const voices = window.speechSynthesis.getVoices()
  //   const hindiVoice = voices.find(v => v.lang === 'hi-IN' );
  //   if(hindiVoice){
  //     utterence.voice = hindiVoice
  //   }
  //   isSpeakingRef.current = true
  //   utterence.onend=()=>{
  //     isSpeakingRef.current = false
  //     startRecognition()
  //   }
  //   synth.speak(utterence)
  // }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';

    const voices = window.speechSynthesis.getVoices();

    // Prefer Microsoft neerja voice if available
    const neerjaVoice = voices.find(v =>
      v.name.toLowerCase().includes("neerja") && v.lang === 'en-IN'
    );

    if (neerjaVoice) {
      utterance.voice = neerjaVoice;
      console.log("✅ Using voice:", neerjaVoice.name);
    } else {
      console.warn("⚠️ neerja voice not found, using default");
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      setTimeout(()=>{
        startRecognition();
      },800);
    };

    synth.cancel();

    synth.speak(utterance);
  };



  const handleCommand = (data)=>{
    const {type, userInput, response} = data
    speak(response);

    if(type === 'google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }
    if(type === 'youtube_search' || type === 'youtube_play'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
    }
    if(type === 'calculator_open'){
      window.open(`https://www.google.com/search?q=calculator`,'_blank');
    }
    if(type === 'instagram_open'){
      window.open(`https://www.instagram.com/`,'_blank');
    }
    if(type === 'facebook_open'){
      window.open(`https://www.facebook.com/`,'_blank');
    }
    if(type === 'chatgpt_open'){
      window.open(`https://chat.openai.com/`,'_blank');
    }
    if(type === 'leetcode_open'){
      window.open(`https://leetcode.com/problemset/`,'_blank');
    }
    if(type === 'weather_show'){
      window.open(`https://www.google.com/search?q=weather`,'_blank');
    }

  }

  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.continuous = true,
    recognition.lang = 'en-US'
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log("Recognition requested to start");
        }catch (error) {
          if(error.name !== "InvalidStateError"){
            console.error("Start error:" ,error);
          }
        }
      }
    },1000);


    recognition.onstart = () =>{
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () =>{
      isRecognizingRef.current = false;
      setListening(false);

      if(isMounted && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("recognition restarted");
            } catch (error) {
              if(error.name !== "InvalidStateError"){
                console.error("Start error:" ,error);
              }
            }
          }
        },1000);
      }
    };

    recognition.onerror = (event) =>{
      console.warn("Recognition error : ", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if(event.error !== "aborted" && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted after error")
            } catch (error) {
              if(error.name !== "InvalidStateError"){
                console.error("Start error:" ,error);
              }
            }
          }
        },1000);
      }
    };

    recognition.onresult = async (e)=>{
      const transcript = e.results[e.results.length-1][0].transcript.trim()
      console.log("heard : " + transcript)

      if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
        setAiText(" ")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        console.log(data)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }
    return ()=>{
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };


  },[]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black via-[#010101] via-28% to-[#00bcbc] flex justify-center items-center flex-col gap-[20px] overflow-hidden'>
      <IoMenu className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
      
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
        <RxCross2 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[18px] cursor-pointer' onClick={handleLogOut}>LogOut</button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[18px] px-[20px] py-[10px] cursor-pointer' onClick={()=>navigate("/customize")} >Customize Your Assistant</button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[19px]'>History  </h1>
        <div className='w-full h-[400px] gap-[15px] overflow-y-auto flex flex-col truncate'>
          {userData.history?.map((his)=>(
            <span className='text-white text-[18px] w-full h-[30px]'>{his}</span>
          ))}
        </div>
      
      
      </div>
      
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[20px] right-[20px] rounded-full text-[18px] cursor-pointer shadow-[0_0_15px_#00fff7]' onClick={handleLogOut}>LogOut</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full text-[18px] px-[20px] py-[10px] hidden lg:block cursor-pointer shadow-[0_0_15px_#00fff7]' onClick={()=>navigate("/customize")} >Customize Your Assistant</button>
      
      <div className='w-[300px] h-[420px] overflow-hidden rounded-4xl shadow-[0_0_15px_#00fff7]'>
        <img src={userData?.assistantImage} alt="" className='w-full h-full object-fill' />
      </div>

      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[160px]'/>}
      {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home






