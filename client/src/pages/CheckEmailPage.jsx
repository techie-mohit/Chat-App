import React , {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { LuUserCircle2 } from "react-icons/lu";


const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: ""
    
  })
  const navigate = useNavigate()

  const handleOnChange =(e)=>{
    const {name , value }= e.target

    setData ((prev)=>{
      return{
        ...prev,
      [name]: value
      }
      
    })
  }

  
  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
   

    const URL =  `${import.meta.env.VITE_BACKENED_URL}/api/email`;
    console.log("URL", URL);

    try{
      const response= await axios.post(URL, data);

      toast.success(response.data.message)

      if(response.data.success){
        setData({
          email: "",
        })
        navigate("/password",{
          state: response?.data.data
        })
      }

    }
    catch(error){
      toast.error(error?.response?.data?.message)
      console.log("error",error);
    }
  }
  return (
    <div>
      <div className='mt-10'>
        <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>

          <div className='flex justify-center items-center'>
            <LuUserCircle2 
            size={50}/>
          </div>

         
          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>

            <div className='flex flex-col gap-1 '>
              <label htmlFor='email'> Email : </label>
              <input 
                type='email' 
                id='email' 
                name='email' 
                placeholder='enter your email' 
                className='border bg-slate-100 px-2 py-1 hover:outline-primary'
                value = {data.email}
                onChange= {handleOnChange}
                required/>
            </div>
          

            <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white'>Continue</button>

          </form>

          <p className='mt-2'>New User? <Link to={"/register"}  className="hover:text-primary font-semibold">Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default CheckEmailPage
