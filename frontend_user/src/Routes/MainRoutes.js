import React from "react";
import Purchase from "../Product/Purchase";
import Introduction from "../views/Introduction";
import NewsSection from "../views/NewsSection";
import NewsDetail from "../views/NewsDetail";
import Question from "../views/Question";
import ProductList from "../Product/ProductList";
import Home from "../HomePage/Home";


const MainRoutes = [
    {
        path: "/",
        // element: <Introduction />,
        element: <Home/>
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
        path: "/news/:id",
        element: <NewsDetail />,
    },
    {
        path: "/question",
        element: <Question />,
    }
];

export default MainRoutes;