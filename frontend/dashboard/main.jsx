import React from "react"
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css"

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello World</div>,
        errorElement: <div>Error</div>,
        children: [

        ],
    },
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} basename={"dashboard"}/>
    </React.StrictMode>
)