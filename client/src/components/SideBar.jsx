import React, {useState, useEffect } from 'react'
import { BsChatDotsFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import {useSelector , useDispatch} from 'react-redux';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';
import { IoImageSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';




const SideBar = () => {
    const user = useSelector (state => state?.user);

    console.log("redux user in sidebar", user)
    const [editUserOpen , setEditUserOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state=> state?.user?.socketConnection);  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar', user._id);
            
            socketConnection.on('conversation', (data)=>{
                console.log("all users", data);

                const conversationUserData = data.map((conversationUser , index)=>{

                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.receiver
                        }
                    }
                    else{
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        }
                    }
                })
                setAllUsers(conversationUserData);
            })    
        }
    },[socketConnection,user])

    const handleLogout = ()=>{
        dispatch(logout());
        navigate('/email');
        localStorage.clear();

    }




  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
        <div className='bg-slate-200 w-12 h-full rounded-tr-lg rounded-br-lg py-3 text-slate-800 flex flex-col justify-between'>
            <div>
                <NavLink className ={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer text-3xl hover:bg-slate-400 ${isActive && 'bg-slate-200'}`} title='chat'>
                    <BsChatDotsFill />
                </NavLink>
                <div  title='add Friend' onClick={()=>{setOpenSearchUser(true)}} className='w-12 h-12 flex justify-center items-center cursor-pointer text-3xl hover:bg-slate-400 mt-2'>
                    <FaUserPlus />
                </div>
            </div>
            <div>
                <button className='mx-auto mb-2 flex justify-center items-center cursor-pointer' title={user?.name} onClick = {()=>setEditUserOpen(true)}>
                    <Avatar
                        width={40}
                        height={40}
                        name= {user?.name}
                        imageUrl={user?.profile_pic}
                        userId={user?._id}
                    />


                   

                </button>
                <button title='logout'className='w-12 h-12 flex justify-center items-center cursor-pointer text-3xl hover:bg-slate-400' onClick={handleLogout}>
                    <span className='-ml-2'>
                        <BiLogOut />
                    </span>
                   
                </button>    
            </div>
        </div>

        <div className='w-full'>
           <div className='h-16 flex items-center'>
                <h1 className='text-xl font-bold p-4 text-slate-800 '>Message</h1>
           </div>
           <div className='bg-slate-200 p-[0.5px]'></div>

           <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
            {
                allUsers.length===0 && (
                    <div>
                        <div>

                        </div>
                        <p className='text-lg text-center text-slate-400 '> Explore users to start a  conversation </p>
                    </div>
                )
            }
            {
                allUsers.map((conv, index)=>{
                    return(
                        <NavLink to = {"/"+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                            <div>
                                <Avatar
                                imageUrl = {conv?.userDetails?.profile_pic}
                                name = {conv?.userDetails?.name}
                                width={40}
                                height={40}
                                />
                            </div>
                            <div>
                                <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                <div className='text-slate-500 text-xs flex items-center gap-1'>
                                    <div className='flex items-center gap-1'>
                                        {
                                            conv?.lastMsg?.imageUrl && (
                                                <div className='flex items-center gap-1 '>
                                                    {!conv?.lastMsg?.text && <span><IoImageSharp /></span>}
                                                    <span>Image</span>
                                                </div>
                                            )
                                        }
                                        {
                                            conv?.lastMsg?.videoUrl && (
                                                <div className='flex items-center gap-1 '>
                                                    {!conv?.lastMsg?.text && <span><FaVideo/></span>}
                                                    <span>Video</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                </div>
                            </div>
                            {
                                Boolean(conv?.unseenMsg)  && (
                                    <p className='text-xs w-5 h-5 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                )
                            }
                            

                        </NavLink>
                    )
                })
            }
           </div>

        </div>

        {/** edit user details */}
        {
            editUserOpen && (
                <EditUserDetails onClose= {()=> setEditUserOpen(false)} user={user}/>
            )
        }
          
        {/** search user  */}
        {
            openSearchUser&& (
                <SearchUser onClose={()=>{
                    setOpenSearchUser(false)
                }}/>
            )
        }
        

        
    </div>
  )
}

export default SideBar
