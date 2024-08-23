import { useEffect, useState } from 'react';
import {FaSearch} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link , useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.user);
  const [searchTerm , setSearchTerm] = useState('');
  const handleSubmit =(e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm' , searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const URLSearchTerm = urlParams.get('searchTerm');
    if(URLSearchTerm) setSearchTerm(URLSearchTerm);
  } , [location.search]); 

  return (
    <header>
      <div className="flex items-center justify-between p-1 mx-auto md:p-4 max-w-7xl">
        <Link to='/'>
        <h1 className="flex flex-wrap text-sm font-bold sm:text-xl">
            <span className="text-slate-500">NexGen</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
      <form onSubmit={handleSubmit} className='flex items-center justify-evenly'>
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type='text' placeholder='Search...' className='w-24 h-10 p-2 border-2 border-gray-300 rounded-lg sm:w-64 sm:h-12'/>
        <button><FaSearch className='m-2 text-gray-300 transition-all ease-in h-7 w-7 hover:text-black '/></button> 
      </form>
      <ul className='flex items-center justify-center mr-8 text-xl sm:gap-8'>
        <Link to='/'><li className='hidden sm:inline'>Home</li></Link>
        <Link to='/about'><li className='hidden sm:inline'>About</li></Link>
        {user? (<Link to='/profile'><img className='object-cover rounded-full w-9 h-9 sm:h-11 sm:w-11' src={user.avatar} alt='profile'></img></Link>)
        :(<Link to='/login'><li>Login</li></Link>)}
      </ul>
      </div>
    </header>
  )
}

export default Header
