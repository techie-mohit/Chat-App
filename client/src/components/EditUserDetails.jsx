import React , {useEffect, useState, useRef} from 'react'
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import { setUser} from '../redux/userSlice';



const EditUserDetails = ({onClose, user}) => {
    console.log("redux  edituser", user);
    const [data, setData] = useState({

        name: user?.user,
        profile_pic: user?.profile_pic
    })
    const uploadPhoto = useRef();
    const dispatch = useDispatch(); 




    useEffect(()=>{
        setData((prev)=>{
            return{
                ...prev,
                ...user
            }
        })
    },[user]);    
    
    const handleOnChange = (e)=>{
        const {name, value} = e.target
        setData((prev)=>{
            return{
                ...prev,
                [name]: value
            }
        })
    }

    const handleOpenUploadPhoto = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        uploadPhoto.current.click();
    }    

    const handleUploadPhoto = async(e)=>{
        const file = e.target.files[0];
    
        const uploadPhoto = await uploadFile(file);
    
        setData((prev)=>{
          return{
            ...prev,
            profile_pic: uploadPhoto?.url,
          }
        })    
      }

      const handleSubmit = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        try{
            const URL =  `${import.meta.env.VITE_BACKENED_URL}/api/update-details`;
            const response = await axios({
                method: 'POST',
                url: URL,  
                data:data,
                withCredentials: true
            });
            console.log("response", response);
            toast.success(response?.data?.message)

            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClose();

            }
        }
        catch(error){
            console.log("error", error);
        }
      }   
      
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-30 flex justify-center items-center z-10 '>
        <div className='bg-white p-4 py-5 m-1 rounded w-full max-w-sm '>
            <h2 className='font-semibold'>Profile Details</h2>
            {/* <p className='text-sm'>Edit User Details </p> */}

            <form className='grid gap-3 mt-3'  onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name : </label>
                    <input type='text' 
                    id='name' 
                    name='name' 
                    value={data.name}
                    onChange={handleOnChange}
                    className='w-full py-1 px-2 focus:outline-primary  border'/>
                </div>

                <div>
                  <div>Photo : </div>
                    <div className='my-1  mt-2flex items-center  gap-10'>
                        <Avatar
                        width={60}
                        height={60}
                        imageUrl = {data?.profile_pic}
                        name= {data?.name}/>
                        <label htmlFor='profile_pic'>
                        {/* <button className='text-md bg-slate-400 border rounded p-1 hover:bg-slate-600' onClick = {handleOpenUploadPhoto}>
                            Change Photo
                        </button> */}

                        <input type='file' id= "profile_pic" className='hidden' onChange={handleUploadPhoto} ref={uploadPhoto}/>
                        </label>
                    </div>

                </div>
                <hr className='border-slate-300 w-full '/>
                <div className='flex gap-2 w-fit ml-auto mt-2'>
                    <button onClick= {onClose} className='bg-primary text-white py-1 px-2 rounded hover:bg-secondary' type='submit'>Cancel</button>
                    {/* <button onSubmit={handleSubmit} className='bg-primary text-white py-1 px-2 rounded hover:bg-secondary' type='submit'>Save</button> */}
                </div>
            </form>
        </div>
    </div>
  )
}

export default React.memo(EditUserDetails)