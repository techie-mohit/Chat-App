import React, {useEffect, useState , useRef} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoImageSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backkgroundwallpaper from '../assests/wall.jpeg';
import { IoSendSharp } from "react-icons/io5";
import moment from 'moment'

const MessagePage = () => {
  const params = useParams();
 
  const socketConnection = useSelector(state=> state?.user?.socketConnection);  

  console.log("params", params.userId);
  const user = useSelector(state=> state?.user);
  const[dataUser, setDataUser] = useState({
    name:"",
    email:"",
    profile_pic:"",
    online:false,
    _id:""
  });

  const [openImageVideoUpload , setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text:"",
    imageUrl:"",
    videoUrl:""
  })

  const [loading, setLoading]= useState(false);
  const [allMessage , setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior:"smooth", block:"end"})
    }

  }, [allMessage])



  const handleUploadImageVideoOpen = ()=>{
    setOpenImageVideoUpload((prev)=>!prev)
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0];
    setLoading(true);

    const uploadPhoto = await uploadFile(file);
    // console.log("uploadPhoto", uploadPhoto);
    setLoading(false);
    setOpenImageVideoUpload(false);


    setMessage((prev)=>{
      return{
        ...prev,
        imageUrl: uploadPhoto?.url
      }
    })

  }

  const handleClearUploadImage = ()=>{
    setMessage((prev)=>{
      return{
        ...prev,
        imageUrl: ""
      }
    })

  }
  const handleUploadVideo = async(e)=>{
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    // console.log("uploadPhoto", uploadPhoto);
    setLoading(false);
    setOpenImageVideoUpload(false);


    setMessage((prev)=>{
      return{
        ...prev,
        videoUrl: uploadPhoto?.url,
      }
    })
    
    }

  const handleClearUploadVideo = ()=>{
    setMessage((prev)=>{
      return{
        ...prev,
        videoUrl: ""
      }
    })

  }

  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit('seen', params.userId);

      socketConnection.on("message-user", (data)=>{
        // console.log("user details", data);
        setDataUser(data);
      })
      socketConnection.on('message', (data)=>{
        console.log("message data", data);
        setAllMessage(data)
      })



    }
  },[socketConnection, params?.userId, user])

  const handleOnChange = (e)=>{
    const {name, value} = e.target;
    setMessage((prev)=>{
      return{
        ...prev,
        text : value
      }
    })
  }

  const handleSendMessage = (e)=>{
    e.preventDefault();

    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit("new-message", {
          sender :user?._id ,
          receiver : params.userId,
          text:message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl, 
          msgByUserId:user?._id
        })
        setMessage({
          text:"",
          imageUrl:"",
          videoUrl:""
        })
      }  
    }
  }
  return (
    <div style= {{ backgroundImage : `url(${backkgroundwallpaper})`}} className='bg-no-repeat bg-cover '>
       <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to ={"/"} className="lg:hidden">
            <FaAngleLeft size={25}/>
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name= {dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semobold text-lg my-0'>{dataUser?.name}</h3>
            <p className=' -my-2'>
              {dataUser?.online ? <span className='text-green-400'>Online </span>: <span className='text-slate-500'>Offline</span>}
            </p>
          </div>
        </div>
        <div>
           <button className='cursor-pointer hover:text-primary'>
             <HiDotsVertical />
           </button>
         </div>        
       </header>


       {/*** show all messages */}
       <section className='h-[calc(100vh-128px)]  overflow-x-hidden  overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
          
          {/** all message shown here */}
          <div className="flex flex-col gap-2 py-2 mx-2" ref = {currentMessage}>
            {
              allMessage.map((msg, index)=>{
                return (
                  <div  className={`bg-white p-1 py-1 my-2 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto " : "bg-white"}`} >
                    <div className='w-full'>
                    {
                      msg?.imageUrl && (
                        <img src = {msg.imageUrl} className='w-full h-full object-scale-down' />
                      )
                    }
                    {
                      msg?.videoUrl && (
                        <video src = {msg.videoUrl} className='w-full h-full object-scale-down'
                        controls />
                      )
                    }
                    </div>
                    
                    <p className='px-2'>{msg.text}</p>
                    <p className='text-xs ml-auto w-fit '>{moment(msg.createdAt).format('hh:mm')}</p>
                    
                  </div>
                )
              })
            }
          </div>

          {/** upload image display */}
          {
            message.imageUrl && (
              <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                  <IoClose size={30} />
                </div>
                <div className='bg-white p-3'>
                  <img 
                    src={message.imageUrl}
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  />
                </div>
              </div>
            )
          }

          {/** upload video display */}
          {
            message.videoUrl && (
              <div className='w-full h-full sticky-bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                  <IoClose size={30} />
                </div>
                <div className='bg-white p-3'>
                  <video
                    src={message.videoUrl}
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                    controls
                    muted
                    autoPlay
                  />
                </div>
              </div>
            )
          }

          {
            loading && (
              <div className='w-full h-full flex justify-center items-center'>
                <Loading/>
              </div> 
            )
          }


       </section>

       {/** send message */}
       <section className='h-16 bg-white flex items-center px-4 '>
          <div className='relative'>
            <button  onClick = {handleUploadImageVideoOpen} className='flex justify-center items-center  w-11 h-11  rounded-full hover:bg-primary hover:text-white'>
              <FaPlus  size={20} />
            </button>

            {/** video and images */}
            {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-16  w-30 p-2 '>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <IoImageSharp size={18} />
                    </div>
                    <p>
                      Image
                    </p>
                    <input type='file' id='uploadImage'
                    onChange = {handleUploadImage}
                    className='hidden' />
                  </label>
                  <label htmlFor='uploadVideo' className ='flex items-center p-2 gap-3  hover:bg-slate-200 cursor-pointer'>
                    <div className='text-purple-600'>
                      <FaVideo size={18}/>
                    </div>
                    <p>
                      Video
                    </p>
                    <input type='file' id='uploadVideo'
                    onChange = {handleUploadVideo}
                    className='hidden' />
                  </label> 

                </form>
            </div>

            )
          }

          </div>

          {/** input box */}
          <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>

          <input type='text' 
            placeholder='Enter your  Message...'
            className='w-full py-1 px-4 outline-none h-full '
            value={message.text}
            onChange = {handleOnChange}
          />
          <button className='hover:text-green-500 text-secondary'>
            <IoSendSharp  size={30}/>
          </button>
        </form>

       </section>
    </div>
  )
}

export default MessagePage



