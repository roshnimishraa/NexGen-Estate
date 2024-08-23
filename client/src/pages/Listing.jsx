import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
  import { Navigation } from 'swiper/modules';
  import 'swiper/css/bundle';
  import { Swiper, SwiperSlide } from 'swiper/react';
  import SwiperCore from 'swiper';
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
    SwiperCore.use({Navigation});
    const params = useParams();
    const [listing , setListing] = useState(null);
    const [error , setError] = useState(false);
    const [loading , setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { user } = useSelector(state => state.user);
    
    useEffect(() => {
        const fetchListing = async() => {
            try {
                setLoading(true)
                setError(false)
                const response = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await response.json();
                if(data.success === false){
                    setError(true)
                    setLoading(false)
                    return;
                }
                setListing(data);
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true);
                setLoading(false)
            }
        }
        fetchListing();
    }, [params.listingId])

  return (
    <main>
      {loading && <h4 className="text-2xl text-center mt-72 sm:mt-96">Loading...</h4>}
      {error && <h4 className="text-2xl text-center text-red-500 mt-72 sm:mt-96">Something went wrong</h4>}
      {listing && !loading && !error && (
        <div>
          <Swiper  modules={[Navigation]} navigation >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl gap-4 p-3 mx-auto my-7'>
          <p className='text-2xl font-semibold'>
              {listing.name} - ${''}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center gap-2 mt-6 text-sm text-slate-600'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                ${+listing.regularPrice - +listing.discountPrice} OFF
              </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {user && listing.userRef !== user._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='p-3 font-semibold text-white transition-all ease-in delay-150 bg-gray-900 border-2 border-transparent rounded-lg hover:bg-white hover:text-black hover:border-black'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  )
}

export default Listing
