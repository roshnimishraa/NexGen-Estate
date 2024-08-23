import { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth'

const Signup = () => {
  const [formData , setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup" , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success===false){
      setLoading(false);
      setError(data.message);
      return;
    }
    setLoading(false);
    setError(null);
    navigate('/login')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }
  return (
     <div className='flex flex-col gap-4 items-center mt-20 sm:mt-32 text-sm sm:text-lg'>
      <h1 className='text-3xl text-center font-semibold font-head'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='w-64 sm:w-96 flex flex-col gap-2'>
        <input type='text' placeholder='Username' id='username' onChange={handleChange} className='border-2 border-gray-300 p-3 mt-4 rounded-lg '/>
        <input type='email' placeholder='Email' id='email' onChange={handleChange} className='border-2 border-gray-300 p-3 mt-4 rounded-lg '/>
        <input type='password' placeholder='Password' id='password' onChange={handleChange} className='border-2 border-gray-300 p-3 mt-4 rounded-lg '/>
        <button type='submit' disabled={loading} className='disabled:opacity-80 bg-black text-white font-semibold p-2 rounded-lg  mt-4 hover:bg-white hover:text-black transition-all delay-150 ease-in border-2 border-transparent hover:border-black '>
          {loading? 'Signing Up...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-1'>
        <p>Already have an account? </p>
          <Link to="/login"> 
          <span className='text-blue-600'>
              Login
          </span></Link>
      </div>
      {error && <p className='text-red-500'>Error : {error}</p>}
     </div>
  )
}

export default Signup
