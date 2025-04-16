import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Components/Root/Root';
import DashBoard from './Components/DashBoard/DashBoard';
import UserManagement from './Components/UserManagement/UserManagement';
import BookManagement from './Components/BookManagement/BookManagement';
import Login from './Components/Login/Login';
import AssignBook from './Components/AssignBook/AssignBooks';
import BorrowedBooks from './Components/BorrowedBooks/BorrowedBooks';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/dashboard",
        element: <DashBoard />
      },
      {
        path: "/usermanagement",
        element: <UserManagement />,
      },
      {
        path: "/bookmanagement",
        element: <BookManagement />,
      },
      {
        path: "/assignbook",
        element: < AssignBook/>,
      },
      {
        path: "/borrowedbooks",	
        element: <BorrowedBooks></BorrowedBooks>
      }
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
