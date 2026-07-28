import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import {Provider} from "react-redux"
import store from "./store/store.js"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Protected from "./components/AuthLayout.jsx"
import Signup from "./pages/Signup.jsx"
import Allposts from "./pages/Allposts.jsx"
import Addpost from './pages/Addpost.jsx'
import EditPost from "./pages/EditPost.jsx"
import Post from"./pages/Post.jsx"

const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
      path:"/",
      element:<Home />
    },
    {
      path:"/login",
      element:(
        <Protected authentication={false}>
         <Login />
      </Protected>
      )
    },

    {
      path:"/signup",
      element:(
        <Protected authentication={false}>
      <Signup />
      </Protected>
      )
    },

    {
      path:"/all-posts",
      element:(
        <Protected authentication>
      <Allposts />
      </Protected>
      )
    },

    {
      path:"/add-post",
      element:(
        <Protected authentication>
      <Addpost />
      </Protected>
      )
    },
    {
      path:"/edit-post/:slug",
      element:(
        <Protected authentication>
      <EditPost />
      </Protected>
      )
    },

    {
      path:"/post/:slug",
      element:(
        <Protected authentication>
      <Post />
      </Protected>
      )
    }
  ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App/>
      </HashRouter>
    {/* <RouterProvider router={router}/> */}
    </Provider>
  </StrictMode>,
)
