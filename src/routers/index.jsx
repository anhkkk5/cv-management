import React from "react";
import LayoutDefault from "../Layout/LayoutDefault";
import Home from "../pages/Home/index.jsx";
import JobsPage from "../pages/Jobs/index.jsx";
import CompaniesPage from "../pages/Companies/index.jsx";
import JobDetail from "../pages/JobDetail/index.jsx";
import CompanyDetail from "../pages/CompanyDetail/index.jsx";
import CVPage from "../pages/CV/index.jsx";
import Login from "../pages/login/index.jsx";
import Register from "../pages/Register/index.jsx";
import Logout from "../logout/index.jsx";

import LoginCompany from "../pages/login/loginCompany.jsx";
import RegisterCompany from "../pages/Register/registerCompany.jsx";
import Search from "../pages/Search/index.jsx";
import Post from "../pages/Post/index.jsx";
import CreateJob from "../pages/CreateJob/index.jsx";
export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "jobs/:id",
        element: <JobDetail />,
      },
      {
        path: "job/:id",
        element: <JobDetail />,
      },
      {
        path: "companies",
        element: <CompaniesPage />,
      },
      {
        path: "companies/:id",
        element: <CompanyDetail />,
      },
      {
        path: "cv",
        element: <CVPage />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "create-job",
        element: <CreateJob />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/loginCompany",
    element: <LoginCompany />,
  },
  {
    path: "/registerCompany",
    element: <RegisterCompany />,
  },
  {
    path: "/post",
    element: <Post />,
  }
];
