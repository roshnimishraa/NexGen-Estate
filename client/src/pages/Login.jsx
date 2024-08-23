import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link , useNavigate} from 'react-router-dom'
import { loginStart , loginSuccess , loginError } from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'

const Login = () => {
  const [formData , setFormData] = useState({})
  const {loading , error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(loginStart());
      const res = await fetch("/api/auth/login" , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success===false){
      dispatch(loginError(data.message));
      return;
    }
    dispatch(loginSuccess(data));
    navigate('/')
    } catch (error) {
      dispatch(loginError(error.message))
    }
  }
  return (
    <div className='flex flex-col items-center gap-4 mt-20 text-sm sm:mt-32 sm:text-lg'>
      <h1 className='text-3xl font-semibold text-center font-head'>Login</h1>
      <form onSubmit={handleSubmit} className='flex flex-col w-64 gap-3 sm:w-96'>
        <input type='email' placeholder='Email' id='email' onChange={handleChange} className='p-3 mt-4 border-2 border-gray-300 rounded-lg '/>
        <input type='password' placeholder='Password' id='password' onChange={handleChange} className='p-3 mt-4 border-2 border-gray-300 rounded-lg '/>
        <button type='submit' disabled={loading} className='p-2 mt-4 font-semibold text-white transition-all ease-in delay-150 bg-black border-2 border-transparent rounded-lg disabled:opacity-80 hover:bg-white hover:text-black hover:border-black '>
          {loading? 'Logging...' : 'Login'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-1'>
        <p>New to NexGen? </p>
          <Link to="/signup"> 
          <span className='text-blue-600'>
              Signup
          </span></Link>
      </div>
      {error && <p className='text-red-500'>Error : {error}</p>}
     </div>
  )
}

export default Login
