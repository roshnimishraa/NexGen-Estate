import { useRef, useState ,useEffect} from "react"
import { useSelector } from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase.js';
import {updateUserStart , updateUserSuccess , updateUserError , deleteUserError , deleteUserStart, deleteUserSuccess , logoutUserError , logoutUserStart , logoutUserSuccess} from '../redux/user/userSlice.js'
import {useDispatch} from 'react-redux'
import { Link } from "react-router-dom";

const Profile = () => {
  const {user , loading , error} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [hideListing , setHideListing] = useState(false);
  const [file, setFile] = useState(undefined)
  const [filePerc , setFilePerc] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess , setUpdateSuccess] = useState(false);
  const [showListError , setShowListError] = useState(false);
  const [userListings , setUserListings] = useState([]);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  } , [file]);

  const handleFileUpload = (file) => {
    setFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef , file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
    (error) => {
      setFileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
        setFormData({...formData, avatar: downloadURL})
      )
    });
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${user._id}` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(updateUserError(data.message));
        console.log(data.message);
        return;
      }  
      dispatch(updateUserSuccess(data)); 
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserError(error.message));
      console.log(error.message);
    }
  }

  const handleDeleteUser = async(e) => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(deleteUserError(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserError(error.message));
    }
  }

  const handleLogoutUser = async(e) =>{
    try {
      dispatch(logoutUserStart());
      const res = await fetch(`/api/auth/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(logoutUserError(data.message));
        return;
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserError(error.message));
    }
  }

  const handleShowListing = async(e) => {
     try {
      setShowListError(false);
      const res = await fetch(`/api/user/listings/${user._id}`);
      const data = await res.json();
      if(data.success===false){
        setShowListError(true);
        return;
      }
      setUserListings(data);
      setHideListing(true);
     } catch (error) {
      setShowListError(true);
     }
  }

  const handleHideListing = (e) => {
    setUserListings([]);
    setHideListing(false);
  }

  const handleListingDelete = async (listingid) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingid}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success===false){
        console.log(data.message);
        return;
      }
      const newListings = userListings.filter((item) => item._id!== listingid);
      setUserListings(newListings);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  return (
    <div className="flex flex-col gap-2 items-center text-sm sm:text-lg">
      <h1 className='text-3xl text-center font-bold font-head mt-6 sm:mt-9 tracking-wide'>Profile</h1>
      <form onSubmit={handleSubmit} className="w-64 sm:w-96 flex flex-col gap-3">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || user.avatar} alt="profile" className="rounded-full h-16 w-16 sm:h-24 sm:w-24 object-cover 
        mx-auto mt-4 sm:mt-6 cursor-pointer" />
        <p className='text-sm sm:text-lg self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-blue-600'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-500'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input onChange={handleChange} type="text" placeholder="username" defaultValue={user.username} id="username" className="border-2 p-3 mt-4 rounded-lg"/>
        <input onChange={handleChange} type="email" placeholder="email" defaultValue={user.email} id="email" className="border-2 p-3 mt-4 rounded-lg"/>
        <input onChange={handleChange} type="password" placeholder="password"  id="password" className="border-2 p-3 mt-4 rounded-lg"/>
        <button disabled={loading} className='disabled:opacity-80 bg-black text-white font-semibold p-2 rounded-lg  mt-4 hover:bg-white hover:text-black transition-all delay-150 ease-in border-2 border-transparent hover:border-black '>
          {loading? "updating..." : "update"}
        </button>
        <Link to={"/create-listing"} className='bg-black text-white text-center font-semibold p-2 rounded-lg  sm:mt-1 hover:bg-white hover:text-black transition-all delay-150 ease border-2 border-transparent hover:border-black '>
          Create Listing
        </Link>
      </form>
      <div className="flex gap-3 mt-1 justify-between w-64 sm:w-96">
        <span onClick={handleDeleteUser} className=' text-red-900 font-semibold cursor-pointer '>
          Delete Account
        </span>
        <span onClick={handleLogoutUser} className=' text-red-900 font-semibold cursor-pointer '>
          Logout 
        </span>
       </div>
       <p className='text-red-500 font-semibold'>{error? "error : " + error : ""}</p>
       <p className='text-green-500 font-semibold'>{updateSuccess? "Successfully updated the user" : ""}</p>
       <button  className="text-center font-semibold tracking-wider text-lg sm:text-xl">
        {hideListing? <span onClick={handleHideListing}>Hide listings</span> : <span onClick={handleShowListing}>Show listings</span>}
        </button>
       <p className='text-red-500'>
        {showListError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0  && (
        <div className='flex flex-col gap-4 mb-5 border  p-3 sm:w-1/2'>
          <h1 className='text-center text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-2 sm:gap-4 '
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex flex-wrap'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-900 font-semibold'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-500 font-semibold'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
