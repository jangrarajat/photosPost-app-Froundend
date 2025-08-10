import { useEffect, useState } from 'react'
import { HiPlus } from "react-icons/hi";
import { BsCloudUploadFill } from "react-icons/bs";
import { CiCircleRemove } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import PageLaoder from "./Components/PageLaoder"
import { Transition } from '@headlessui/react';
import '@fortawesome/fontawesome-free/css/all.min.css';


import './App.css'

import axios from 'axios';



function App() {

  const [menuOption, setMenuOption] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [pageLaoder, setPageLaoder] = useState(false)
  const [searchBar, setSearchBar] = useState(false)
  const [upLaodPhotoLoading, setUpLaodPhotoLoading] = useState(false)
  const [postDiv, setPostDiv] = useState(false)
  const [imageUrl, setImageUrl] = useState("");
  const [genrateUrlLoading, setGenrateUrlLoading] = useState(false)
  const [sucMsg, setSucMsg] = useState(false)
  const [title, setTitle] = useState("add title")
  const [allData, setAllData] = useState()
  const [searchkey, setSearchkey] = useState("")





  //  get only searched data 

  const searchedData = async () => {
    if (!searchkey) return console.log("searchkey is empty")

    try {
      setPageLaoder(true)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?q=${encodeURIComponent(searchkey)}`)

      if (res.data.message.length !== 0) {
        const myAllPostes = res.data.message.length === 1 ? (
          <div className="w-full">
            {res.data.message.map((post) => (
              <div key={post._id} className=' w-fit   rounded-lg'>
                <img
                  src={post.photo}
                  className="rounded-xl w-full "
                  alt="postes"
                />
                <div><p className='text-white font-extralight'>{post.title}</p></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-2 md:columns-9 gap-4">
            {res.data.message.map((post) => (
              <div key={post._id} className="mb-2 break-inside-avoid   rounded-lg" >
                <img

                  src={post.photo}
                  className="w-full rounded-lg"
                  alt="postes"
                />

              </div>
            ))}


          </div>
        );

        setAllData(myAllPostes)



      }
      setPageLaoder(false)
      setSearchkey("")
    } catch (error) {
      console.log("serch daata  get error", error.message)
      console.log(searchkey)
    }
  }



  //  get all data from mongoDb 

  const getData = async () => {

    try {

      setPageLaoder(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`)
      const data = await res.json();

      const myAllPostes = data.length === 1 ? (
        <div className="w-full">
          {data.map((post) => (
            <div key={post._id} className=' w-fit   rounded-lg'>
              <img
                src={post.photo}
                className="rounded-xl w-full "
                alt="postes"
              />
              <div><p className='text-white font-extralight'>{post.title}</p></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-9 gap-4">
          {data.map((post) => (
            <div key={post._id} className="mb-2 break-inside-avoid   rounded-lg">
              <img
                src={post.photo}
                className="w-full rounded-lg"
                alt="postes"
                onClick={() => { console.log(post._id) }}
              />
            </div>
          ))}
        </div>

      );
      setPageLaoder(false)
      setAllData(myAllPostes)
      // console.log(process.env.REACT_APP_API_URL)
    } catch (error) {
      console.log("  get all data error", error.message)
      console.log(searchkey)
    }

  }


  //  post new photo 


  const postNewPhoto = async () => {

    try {

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, {
        title: title,
        photo: imageUrl,
      })
      setUpLaodPhotoLoading(false)
      getData();
      setPostDiv(false)
      console.log("photo uplodaed", res.data);
    } catch (error) {
      console.log(error.message)
      setUpLaodPhotoLoading(false)
    }
  }



  // delete photo 

  const deletePhoto = async (id, title, photo) => {

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
        data: {
          title: title,
          photo: photo,
        },
      })
      getData();


    } catch (error) {
      console.log("delete error", error.message)
    }
  }





  // genrating image url 

  function successMessage() {
    setSucMsg(true)

    setTimeout(() => {
      setSucMsg(false)
    }, 2000)

  }


  // upload new post 

  const upLaodPhoto = async (e) => {

    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log("No file selected.");
      return;
    }

    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "rajat_jangra");

    try {
      setGenrateUrlLoading(true)
      const response = await fetch("https://api.cloudinary.com/v1_1/drrj8rl9n/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setImageUrl(data.secure_url);
      setGenrateUrlLoading(false)
      successMessage()

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };


  useEffect(() => {

    getData()
  }, [imageUrl])




  function hideserchbar() {

    if (searchkey === "") {
      getData()
      searchedData()
      setSearchBar(false)
      setPostDiv(false)
    } else {
      searchedData()
      setSearchBar(false)
      setPostDiv(false)
    }


  }

  function homeBtn() {

    getData()
    hideserchbar()
    setSearchBar(false)
    setPostDiv(false)
  }

  function serchBtn() {
    searchBar ? setSearchBar(false) : setSearchBar(true)
    setPostDiv(false)
  }

  function newPostBtn() {
    postDiv ? setPostDiv(false) : setPostDiv(true)
    setSearchBar(false)
  }


  return (
    <>

      <Transition

        show={sucMsg}
        enter="transition ease duration-500 transform"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease duration-300 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
      >
        <div className='p-2 px-8 fixed  top-5  left-1/4 md:left-[40%] translate-x-1/2  translate-y-1/2    bg-green-400     z-50  rounded-xl  '>
          <p className='text-white'>Success</p>
        </div>
      </Transition>








      {/* navbar  */}

      <div className='
   // phone
       bg-white
         fixed 
         z-30 
         w-full 
         flex 
         justify-between
         px-5
         items-center 
         h-14
         top-0

     //  desktop
        md:hidden
       '>

        <img src="https://i.pinimg.com/736x/6e/ad/91/6ead912ceb43c93b8e189d1eb802845f.jpg" className='w-11 rounded-full p-1' alt="logo" />
        {!menuOption ? (<><i className="fa-solid fa-bars"
          onClick={() => setMenuOption(!menuOption)}
        ></i></>) :
          (<>
            <i className="fa-solid fa-xmark"
              onClick={() => setMenuOption(!menuOption)}
            ></i>
          </>)}

      </div>






      <div className='
   // phone
       bg-white
         fixed 
         z-30 
         w-full 
         flex 
         justify-around
         items-center 
         h-14
         bottom-0

     //  desktop
           md:top-[-20px]
           md:pt-4
         
          md:w-[50px]
          md:h-[800px]
          md:flex 
          md:items-center
          md:gap-8
          md:mt-4 
          md:justify-start
          md:flex-col
       '>
        <img src="https://i.pinimg.com/736x/6e/ad/91/6ead912ceb43c93b8e189d1eb802845f.jpg" className='w-11 rounded-full p-1 hidden md:flex' alt="logo" />
        <button
          className=' w-[20%] md:w-fit md:h-fit h-[90%] flex items-center justify-center'
          onClick={homeBtn}> <FaHome className=' cursor-pointer' />
        </button>
        <button
          className=' w-[20%] h-[90%] md:w-fit md:h-fit flex items-center justify-center'
          onClick={newPostBtn}>
          <HiPlus className={postDiv ? "animate-bounce cursor-pointer" : "animate-none cursor-pointer"} />
        </button>
        <button
          className=' w-[20%] h-[90%] md:w-fit md:h-fit flex items-center justify-center'
         onClick={serchBtn}>
        <FaSearch className={searchBar ? "animate-bounce" : "animate-none"}  />
        </button>

        {/* <button className='bg-gray-700 text-white p-1' onClick={() => setIsOpen(!isOpen)}>ok</button> */}

      </div>


      <Transition
        show={isOpen}
        enter="transition ease duration-500 transform"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease duration-300 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
      >
        <div className="fixed inset-x-0 bottom-0 bg-purple-500 z-40 w-[97%] ml-[3%] ">
          <h1> this is transition </h1>
        </div>
      </Transition>







      {/* search bar  start */}




      <Transition
        show={searchBar}
        enter="transition ease duration-500 transform"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease duration-200 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
      >
        <div className=' text-white p-4 min-h-[90%] md:h-fit md:rounded-xl w-full md:w-[70%] bg-gradient-to-br from-blue-900 via-gray-800 to-black z-40  fixed md:top-10 left-1/2 transform -translate-x-1/2 '>

          <input
            onChange={(e) => setSearchkey(e.target.value)}
            type="text" placeholder='Search your think' className=' font-extralight  px-4 mt-10 w-full flex flex-col bg-white/30  h-12 rounded-md ' />
          <button
            onClick={hideserchbar}
            className=' w-full rounded-lg mt-5 p-2 bg-white/40 flex  items-center justify-center text-gray-600'
          >
            <FaSearch />
            search
          </button>

        </div>
      </Transition>



      {/* search bar  end */}






      {/* uplod new photo section  */}


      <Transition
        show={postDiv}
        enter="transition ease duration-500 transform"
        enterFrom=" opacity-0"
        enterTo="opacity-100"
        leave="transition ease duration-200 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
      >
        <div className='  fixed  left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded-[20px]  bg-gradient-to-br from-blue-900 via-gray-800 to-black z-20  w-fit ' >
          <div><CiCircleRemove onClick={() => postDiv ? setPostDiv(false) : setPostDiv(true)} className=' cursor-pointer text-white' /></div>
          <div className="flex flex-col items-center justify-center w-full mt-3" >
            <label
              htmlFor="fileupload"
              className="  flex flex-col items-center justify-center w-full max-w-sm h-20 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition"
            >

              <h2 className='flex flex-col items-center gap-2 '
              >
                {genrateUrlLoading ? (
                  <>
                    <div className='flex flex-col justify-center items-center text-white'>
                      <div className='h-10 w-10 border-[5px] border-green-100 border-b-blue-500 animate-spin  rounded-full'></div>
                      <p className='font-extralight text-white'>genrating image url</p>
                    </div>
                  </>) : (
                  <>
                    <p className='font-extralight text-white'>Select Image </p>
                    <BsCloudUploadFill className='text-white' />
                  </>)}
              </h2>

              <input id="fileupload" type="file" accept="image/*" onChange={upLaodPhoto} className="hidden" />
            </label>

            <label
              htmlFor="title"
              className="   w-full max-w-sm mt-3  rounded-lg cursor-pointer"
            >

              <input type="text" id='title' placeholder='Some keyword '
                onChange={(e) => setTitle(e.target.value)}
                className='h-10 w-full font-thin mt-4 px-2 rounded-lg  bg-gray-700 text-white'
              />


            </label>

          </div>
          <br />
          <br />
          <button

            onClick={() => {
              postNewPhoto()
              setUpLaodPhotoLoading(true)
            }}
            className='flex flex-row gap-5 justify-center items-center mt-3 bg-green-500 w-80 rounded-lg p-2 md:bg-green-400'
          >
            {upLaodPhotoLoading ? (
              <>
                <div className='h-10 w-10  rounded-full border-4 border-white border-b-gray-400 animate-spin'>
                </div>
                <p className='font-extralight'>uplaoding pic...</p>
              </>) : (<><p className='font-extralight text-white'> upload photo</p></>)}

          </button>
        </div>
      </Transition>








      {/* photos section  */}




      {pageLaoder ?
        (<>

          <PageLaoder />
        </>)
        : (<>




          <div className=' flex flex-row flex-wrap  w-[97%] ml-[3%] absolute  p-5 bg-white'   >

            {allData}
          </div>

        </>)}




    </>
  )
}

export default App




