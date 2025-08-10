import React, { useEffect, useState } from 'react'

import { BsCloudUploadFill } from "react-icons/bs";
import { CiCircleRemove } from "react-icons/ci";
import { Transition } from '@headlessui/react';

function UplaodPhoto(
    setUpLaodPhotoLoading,
    upLaodPhotoLoading,
    genrateUrlLoading,
    upLaodPhoto,
     setTitle,  
     postNewPhoto,
     postToggle
) {
         const [postDiv, setPostDiv] = useState(false)


    useEffect(()=>{
        setPostDiv(!postDiv)
    },[postToggle])
        
    
    return (
        <Transition
            show={postDiv}
            enter="transition ease duration-500 transform"
            enterFrom="-translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease duration-200 transform"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="-translate-y-full opacity-0"
        >
            <div className='  fixed  left-1/2 transform -translate-x-1/2 -translate-y-[-10px] p-5 rounded-[20px]  bg-gradient-to-r from-purple-500 to-pink-500 z-20  w-fit ' >
                <div><CiCircleRemove onClick={() => setPostDiv(!postDiv)} className=' cursor-pointer text-white' /></div>
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
    )
}

export default UplaodPhoto
