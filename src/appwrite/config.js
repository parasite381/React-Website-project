
import conf from "../conf/conf.js"
import { Client, ID, Databases, Storage, Query } from "appwrite";
import { Permission, Role } from "appwrite";


export class Service {
    Client = new Client()
    databases;
    bucket;


  constructor(){
    this.Client.setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId)
    this.databases = new Databases(this.Client)
    this.bucket = new Storage(this.Client)
  }

  async getPost(slug){
    try{
       return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug)
    }catch(error){
      console.log("Appwrite service :: getPost() ::",error);
      return false
    }
  }

  async getPosts(queries=[Query.equal("status","active")]){
    try{
       return await this.databases.listDocuments
       (conf.appwriteDatabaseId,
        conf.appwriteCollectionId,queries)
    }catch(error){
      console.log("Appwrite service :: getPosts() ::",error);
      return false
    }
  }
async createPost({title,slug,content,featuredImage,status,userId}){
  try{
     return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      //slug,
      {
       title,
       slug,
       content,
       featuredImage,
       status,
       userId
      }
     )
  }catch(error){
    console.log("Appwrite service :: createPost() ::",error);
      return false
  }
}

async updatePost(id,{title,slug,content,featuredImage,status}){
  try{
    return await this.databases.updateDocument(
     conf.appwriteDatabaseId,
     conf.appwriteCollectionId,
     id,
     //slug,
     {
      title,
      slug,
      content,
      featuredImage,
      status,
     }
    )
 }catch(error){
   console.log("Appwrite service :: updatePost() ::",error);
     return false
 }
}

async deletePost(id){
  try{
    await this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id,
    )
    return true
  }catch(error){
    console.log("Appwrite service :: updatePost() ::",error);
    return false
  }
}


async uploadFile(file,userId){
  try{
    return await this.bucket.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()),     // anyone can read
        Permission.update(Role.user(userId)), // only owner can update
        Permission.delete(Role.user(userId))  // only owner can delete
      ]
    )
  }catch(error){
    console.log("Appwrite service :: uploadFile() :: ", error);
    return false
  }
}

async deleteFile(fileId){
  try{
    return await this.bucket.deleteFile(
      conf.appwriteBucketId,
      fileId
    )
  }catch(error){
    console.log("Appwrite service :: deleteFile() :: ", error);
    return false
  }
}

getFilePreview(fileId){
  return this.bucket.getFileView(
    conf.appwriteBucketId,
    fileId
  );
}

// Fetch by slug
async getPostBySlug(slug) {
  try {
    const response = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("slug", slug)]
    );
    return response.documents[0];
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}


}

const service=new Service()
export default service;