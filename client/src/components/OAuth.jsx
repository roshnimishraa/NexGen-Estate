import {GoogleAuthProvider , getAuth , signInWithPopup} from 'firebase/auth'
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/user/userSlice.js';
import {useNavigate} from 'react-router-dom'

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth,provider);
            const res = await fetch('/api/auth/google' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),              
            })    
            const data = await res.json();
            dispatch(loginSuccess(data));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-black text-white font-semibold p-2 rounded-lg  hover:bg-white hover:text-black transition-all delay-150 ease-in border-2 border-transparent hover:border-black'>
      Continue with Google
    </button>
  )
}

export default OAuth
