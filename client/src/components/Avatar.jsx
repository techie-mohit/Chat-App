import React from 'react'
import { LuUserCircle2 } from "react-icons/lu";
import { useSelector } from 'react-redux';


const Avatar = ({userId, name, imageUrl, width, height}) => {

    const onlineUser = useSelector(state=> state?.user?.onlineUser);

    let avatarName = ""

    if(name){
        const splitname= name?.split(" ")
        if(splitname.length > 1){
            avatarName = splitname[0][0] + splitname[1][0]
        }else{
            avatarName = splitname[0][0] ;
        }
    }

    const bgcolor =[
        'bg-red-200',
        'bg-blue-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-indigo-200',
        'bg-purple-200',
        'bg-teal-200',
    ]

    const  randomColor = Math.floor(Math.random() *7)

    const isOnline = onlineUser?.includes(userId);
  return (
    <div className={`text-slate-800  overflow-hidden rounded-full  font-bold  relative `} style = {{width:width + "px", height : height +"px" }} >
        {
            imageUrl ? (
                <img src= {imageUrl} 
                width={width}
                height= {height}
                alt={name} 
                className=' overflow-hidden rounded-full' />
            ) : (

                name ? (
                    <div style = {{width : width + "px", height : height +"px" }} className={`overflow-hidden rounded-full flex  text-xl shadow border justify-center items-center ${bgcolor[randomColor]}`}>
                        {avatarName}

                    </div>

                ) : (

                    <LuUserCircle2 
                       size={width}/>

                )

            )
        }
        {
            isOnline && (
                <div className='bg-green-500 p-1.5 absolute bottom-1 right-1 z-10 rounded-full text-3xl'></div>
            )
        }
      
    </div>
  )
}

export default Avatar
