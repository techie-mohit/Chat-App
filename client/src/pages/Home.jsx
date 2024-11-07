import React , {useEffect} from 'react'
import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {logout, setUser} from '../redux/userSlice';
import {  setOnlineUser ,setSocketConnection} from '../redux/userSlice';
import SideBar from '../components/SideBar';
import logo from '../assests/logo.png';
import io from 'socket.io-client';


const Home = () => {
  const user= useSelector(state=> state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location= useLocation();

  console.log("redux user", user);

  const fetchUserDetails = async()=>{
    try{
      const URL =  `${import.meta.env.VITE_BACKENED_URL}/api/user-detail`;
      const response = await axios({
        url: URL,
        withCredentials: true
      })

      console.log("current user details", response.data);

      dispatch(setUser(response.data.data));

      // if(!user.token){
      //   dispatch(logout());
      //   navigate("/email");
      // }

      if(response.data.data.logout){
        dispatch(logout());
        navigate("/email");
      }

      
    }
    catch(error){
      console.log("error", error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  }, [])

  /*** socket connection  */
  useEffect(()=>{
    const socketConnection = io(import.meta.env.VITE_BACKENED_URL, {
      auth: {
        token : localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser', (data)=>{
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));
    return ()=>{
      socketConnection.disconnect();
    }
    
  }, []);




  const basePath= location.pathname === '/'    // it is used to make responsive the website 
  return (
    <div className='grid lg:grid-cols-[280px,1fr] h-screen max-h-screen'>
      <section className={`bg-slate-400 lg:block ${!basePath && "hidden"}`}>
        <SideBar/>
      </section>

      {/** messages component */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img src = {logo} width={250} alt='logo'/>
        </div>
        <p className='text-lg mt-2 text-slate-600'>Select User to Send Message</p>
      </div>
    </div>
  )
}

export default Home
