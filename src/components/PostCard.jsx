import React from 'react'
import {Link} from "react-router-dom"
import appwriteService from "../appwrite/config.js"

function PostCard({
    $id,title,featuredImage
}) {
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
          <div className='w-full flex justify-center mb-4'>
            <img src={appwriteService.getFilePreview(featuredImage)} alt={title} 
            className='rounded-lg' />
          </div>
          <h2 className='text-xl font-bold mt-2 text-black !text-black'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard