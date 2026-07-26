import React,{useCallback} from 'react'
import {useForm} from "react-hook-form"
import Button from "../Button"
import Input from "../Input"
import RTE from '../RTE'
import Select from "../Select"
import appwriteService from "../../appwrite/config"
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"



export default function PostForm({post}){
   const {register,handleSubmit,watch,reset,setValue,control,getValues,formState:{errors}}=useForm({
    defaultValues:{
      title:post?.title||"",
      slug:post?.slug||"",
      content:post?.content||"",
      status:post?.status||"active",

    }
   })
   const navigate=useNavigate()
   const userData=useSelector((state)=>state.auth.userData)

   const submit= async(data)=>{
    if(post){
       const file=data.image[0] ? await appwriteService.uploadFile(data.image[0],userData.$id):null
    
    if(file){
      appwriteService.deleteFile(post.featuredImage)

    }
    const dbPost= await appwriteService.updatePost(post.$id,{
      ...data,
      featuredImage: file ? file.$id :undefined
    })

    if(dbPost){
      navigate(`/post/${dbPost.$id}`)
    }

   }else {
    const file =await appwriteService.uploadFile(data.image[0], userData.$id)
    if(file){
      const fileId = file.$id
      data.featuredImage = fileId
      const dbPost= await appwriteService.createPost({...data,userId:userData.$id})
      if(dbPost){
        navigate(`/Post/${dbPost.$id}`)
      }
    }
   }
  }

    const slugTransform = useCallback((value)=>{
      if (value && typeof value === "string") {return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g,"-").replace(/\s/g,"-")}
      return "";},[]
    )

    React.useEffect(()=>{
      if (post){
        reset(post)
      }
    },[post,reset])


    React.useEffect(()=>{
      watch((value,{name})=>{
        if(name ==="title"){
           setValue("slug",slugTransform(value.title),{shouldValidate:true})
        }
      })
    },[watch,slugTransform,setValue] )

    return(
      <form onSubmit={handleSubmit(submit)}
      className='flex flex-wrap items-center justify-center'
      >
       <div className='w-2/3 px-2'>
        <Input
        label="Title"
        placeholder="Title"
        className={`w-full border-2 rounded px-2 py-1 
        ${errors.title ? "border-red-500" : watch("title") ? "border-green-500" : "border-gray-300"}`}
        {...register("title",{required:true})}
        />
        {errors.title && <span className=" text-red-500">❌</span>}
        {!errors.title && watch("title") && <span className=" text-green-500">✅</span>}

        <Input
        label="Slug"
        placeholder="Slug"
        className={`mb-4 border-2 rounded px-2 py-1 
        ${errors.slug ? "border-red-500" : watch("slug") ? "border-green-500" : "border-gray-300"}`}
        {...register("slug",{required:true})}
        onInput={(e)=>{
          setValue("slug",slugTransform(e.currentTarget.value),{shouldValidate:true})
        }}
        />
        {errors.slug && <span className=" text-red-500">❌</span>}
        {!errors.slug && watch("slug") && <span className=" text-green-500">✅</span>}


        <RTE 
        label="Content: "
        name="content"
        control={control}
        defaultValue={post?.content || ""}
        />
       </div>

       <div className='1/3 px-2'>
        <Input 
        label="Featured Image"
        type="file"
        className={`mb-4 border-2 rounded px-2 py-1 
        ${errors.image ? "border-red-500" : watch("image") ?.length ? "border-green-500" : "border-gray-300"}`}
        accept="image/png, image/jpg , image/jpeg"
        {...register("image",{required: !post})}
        />

        {errors.image && <span className=" text-red-500">❌</span>}
        {!errors.image && watch("image")?.length > 0 && (<span className=" text-green-500">✅</span>)}

        {post && (
          <div className='w-full mb-4'>
            <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className='rounded-lg'/>
          </div>
        )} 

        <Select 
        options={["active","inactive"]}
        label="Status"
        className="mb-4 !text-black"
        {...register("Status",{required:true})}
        />

      
        <Button
        type='Submit'
        bgColor={post?"bg-green-500":""}
        className='px-6 py-3 rounded-lg text-white font-bold 
        border border-transparent 
        bg-gradient-to-b from-red-400 to-red-700 
        hover:from-red-300 hover:to-red-800 
        bg-clip-border transition-all duration-300'
        >{post?"Update":"Submit"}</Button>
        </div>
          
      </form>
    )
}