import React from "react";
import Purchase from "../Product/Purchase";
import Introduction from "../views/Introduction";
import NewsSection from "../views/NewsSection";
import NewsDetail from "../views/NewsDetail";
import Question from "../views/Question";
import ProductList from "../Product/ProductList";
import Home from "../HomePage/Home";
import UserInfo from "../UserInfo/UserInfo";


const MainRoutes = [
    {
        path: "/user_app",
        // element: <Introduction />,
        element: <Home />
    },
    {
        path: "/user_app/purchase",
        element: <Purchase />,
    },
    {
        path: "/user_app/product",
        element: <ProductList />
    },
    {
        path: "/user_app/introduction",
        element: <Introduction />,
    },
    {
        path: "/user_app/news",
        element: <NewsSection />,
    },
    {
        path: "/user_app/news/:id",
        element: <NewsDetail />,
    },
    {
        path: "/user_app/question",
        element: <Question />,
    },
    {
        path: "/user_app/user",
        element: <UserInfo />
    },
];

export default MainRoutes;