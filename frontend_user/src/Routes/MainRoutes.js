import React from "react";
import Purchase from "../Product/Purchase";
import Introduction from "../views/Introduction";
import NewsSection from "../views/NewsSection";
import NewsDetail from "../views/NewsDetail";
import NewsCreate from "../views/NewsCreate";
import NewsEdit from "../views/NewsEdit";
import Question from "../views/Question";
import ProductList from "../Product/ProductList";
import Home from "../HomePage/Home";
import UserInfo from "../UserInfo/UserInfo";

const MainRoutes = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/purchase",
        element: <Purchase />,
    },
    {
        path: "/product",
        element: <ProductList />
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
        path: "/news/create",
        element: <NewsCreate />,
    },
    {
        path: "/news/edit/:id",
        element: <NewsEdit />,
    },
    {
        path: "/news/:id",
        element: <NewsDetail />,
    },
    {
        path: "/question",
        element: <Question />,
    },
    {
        path: "/user",
        element: <UserInfo />
    },
];

export default MainRoutes;