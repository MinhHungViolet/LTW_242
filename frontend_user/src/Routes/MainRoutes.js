import React from "react";
import Purchase from "../Product/Purchase";
import Introduction from "../views/Introduction";
import NewsSection from "../views/NewsSection";
import NewsDetail from "../views/NewsDetail";
import Question from "../views/Question";

const MainRoutes = [
    {
        path: "/",
        element: <Introduction />,
    },
    {
        path: "/purchase",
        element: <Purchase />,
    },
    {
        path: "/introduction",
        element: <Introduction />,
    },
    {
        path: "/news",
        element: <NewsSection />,
    },
    {
        path: "/news/:id",
        element: <NewsDetail />,
    },
    {
        path: "/question",
        element: <Question />,
    }
];

export default MainRoutes;