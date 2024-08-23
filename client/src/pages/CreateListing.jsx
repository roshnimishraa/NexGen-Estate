import { useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase.js';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const {user} = useSelector((state) => state.user);
    const [files , setFiles] = useState([]);
    const [formData , setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        bedrooms: 1,
        type: 'rent',
        bathrooms: 1,
        regularPrice : 0,
        discountedPrice: 0,
        offer:false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError , setImageUploadError] = useState(null);
    const [submitError , setSubmitError] = useState(false);
    const [submitLoading , setSubmitLoading] = useState(false);
    const navigate = useNavigate();
    
    const [imageUploadLoading , setImageUploadLoading] = useState(false);

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setImageUploadLoading(true);
            setImageUploadError(false);
            const promises = [];
            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData , imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadLoading(false);
            }).catch((error)=>{
                setImageUploadLoading(false);
                setImageUploadError("image upload failed (6 mb max per image)");
            })
        }else{
            if(files.length === 0) setImageUploadError("Add atleast one image");
            else setImageUploadError("You can only add up to 6 images");
            setImageUploadLoading(false);
        }};

    const storeImage = async(file)=> {
        return new Promise((resolve , reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }
            , 
            (error)=>{
                reject(error);
            },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            })
            })
        })
    }

    const handleRemoveImage= (index)=> {
        setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i!== index)});
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
          setFormData({
            ...formData,
            type: e.target.id,
          });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
          });
        }
    
        if (
          e.target.type === 'number' ||
          e.target.type === 'text' ||
          e.target.type === 'textarea'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.value,
          });
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();    
        try {
            if(formData.imageUrls.length < 1) return setSubmitError("Upload atleast one image");
            if(+formData.regularPrice < +formData.discountedPrice) return setSubmitError("Discounted price must be less than regular price");
            setSubmitLoading(true);
            const res = await fetch('/api/listing/create' , {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef : user._id,
                }),
            })
            const data = await res.json();
            if(data.success===false){
                setSubmitError(data.message);
                setSubmitLoading(false);
                return;
            }
            setSubmitError(null);
            setSubmitLoading(false);
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setSubmitError(error.message);
            setSubmitLoading(false);
        }
      }
  return (
    <main className="max-w-4xl p-3 mx-auto ">
      <h1 className="text-3xl font-bold tracking-wide text-center font-head">Create Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col text-sm sm:text-lg">
        <div className="flex flex-col gap-4 mt-5 sm:gap-7">
            <input onChange={handleChange} value={formData.name} type="text" placeholder="Title" className="p-3 border rounded-lg"
            id="name" maxLength='62' minLength='10' required/>
            <textarea onChange={handleChange} value={formData.description} type="text" placeholder="Description" className="p-3 border rounded-lg resize-none"
            id="description" required />
            <input onChange={handleChange} value={formData.address} type="text" placeholder="Address" className="p-3 border rounded-lg"
            id="address" maxLength='62' minLength='10' required/>

            <div className="flex flex-wrap gap-3 sm:gap-7 sm:mt-2">
            <div className="flex gap-2">
                <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={formData.type === 'sale'}/>
                <span>Sell</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={formData.type === 'rent'}/>
                <span>Rent</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" className="w-5" id="parking" onChange={handleChange} checked={formData.parking}/>
                <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" className="w-5" id="furnished" onChange={handleChange} checked={formData.furnished} />
                <span>Furnished</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={formData.offer}/>
                <span>Offer</span>
            </div>
        </div>
        <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2 mr-3">
                <input type="number" className="w-24 p-3 border rounded-lg sm:w-32 "
                id="bedrooms" min='1' required onChange={handleChange} value={formData.bedrooms}/>
                <span>Beds</span>
            </div>
            <div className="flex items-center gap-2 mr-3">
                <input type="number" className="w-24 p-3 border rounded-lg sm:w-32"
                id="bathrooms" min='1' required onChange={handleChange} value={formData.bathrooms}/>
                <span>Baths</span>
            </div>
            <div className="flex items-center gap-2 mr-3">
                <input type="number" className="w-32 p-3 border rounded-lg sm:w-44"
                id="regularPrice" min='0' required onChange={handleChange} value={formData.regularPrice}/>
                <div className="flex flex-col">
                    <span>Regular Price</span>
                    {formData.type === 'rent' && (
                        <span className="text-sm text-center">($ / month)</span>
                    )}     
                </div>
                
            </div>
            {formData.offer && (
                <div className="flex items-center gap-2">
                <input type="number" className="w-32 p-3 border rounded-lg sm:w-44"
                id="discountedPrice" min='0' onChange={handleChange} value={formData.discountedPrice}/>
                <div className="flex flex-col">
                    <span>Discounted Price</span>
                    {formData.type === 'rent' && (
                        <span className="text-sm text-center">(₹ / month)</span>
                    )} 
                </div>             
            </div>
            )}
            
        </div>
        <div className="flex items-center gap-2 mt-4">
            <p className="font-bold text-md ">Images :</p>
            <span>(You may choose multiple images)</span>
        </div>
        <div className="flex flex-col ">
            <input onChange={(e)=> setFiles(e.target.files)} type="file" id="images" accept="image/*" multiple />
            <button type="button" disabled={imageUploadLoading} onClick={handleImageSubmit} className='p-2 my-4 font-semibold text-white transition-all ease-in delay-150 bg-black border-2 border-transparent rounded-lg disabled:opacity-80 hover:bg-white hover:text-black hover:border-black '>
             {imageUploadLoading? "Uploading Images..." : "Upload Images"}
            </button>
            <p className="font-semibold text-center text-red-500 "> {imageUploadError && imageUploadError}</p> 

            <div className="flex flex-wrap ">
            {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex items-center justify-between w-full p-3 mt-0 mb-3 border sm:w-1/2'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='object-contain w-20 h-20 rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 font-semibold text-red-900 cursor-pointer hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
            </div>
            
        </div>
        </div>
        <button disabled={submitLoading || imageUploadLoading} type="submit" className='p-2 font-semibold text-white transition-all ease-in delay-150 bg-black border-2 border-transparent rounded-lg disabled:opacity-80 hover:bg-white hover:text-black hover:border-black '>
                {submitLoading ? "Creating new listing..." : "Create Listing"}
        </button>
        <p className="font-semibold text-center text-red-500 "> {submitError && submitError}</p>
      </form>
    </main>
  )
}

export default CreateListing
