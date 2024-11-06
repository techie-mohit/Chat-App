import React, {useState} from 'react'
import { BsChatDotsFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import {useSelector} from 'react-redux';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';




const SideBar = () => {
    const user = useSelector (state => state?.user);

    console.log("redux user in sidebar", user)
    const [editUserOpen , setEditUserOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);



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
                <button title='logout'className='w-12 h-12 flex justify-center items-center cursor-pointer text-3xl hover:bg-slate-400'>
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