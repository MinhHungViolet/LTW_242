import React from "react";
import Purchase from "../Product/Purchase";
import Introduction from "../views/Introduction";
import NewsDetail from "../views/NewsDetail";

const MainRoutes = [
    {
        path: "/purchase",
        element: <Purchase />,
    },
    {
        path: "/introduction",
        children: [
            {
                path: "/introduction",
                element: <Introduction />,
            },
            {
                path: "/introduction/news/:id",
                element: <NewsDetail />,
            },
        ],
    },
];

export default MainRoutes;