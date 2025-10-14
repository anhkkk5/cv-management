import React from "react";
import LayoutDefault from "../Layout/LayoutDefault";
import Home from "../pages/Home/index.jsx";
import JobsPage from "../pages/Jobs/index.jsx";
import CompaniesPage from "../pages/Companies/index.jsx";
import JobDetail from "../pages/JobDetail/index.jsx";
import CompanyDetail from "../pages/CompanyDetail/index.jsx";
import Login from "../pages/login/index.jsx";
import Register from "../Register/index.jsx";

import LoginCompany from "../pages/login/loginCompany.jsx";
import RegisterCompany from "../Register/registerCompany.jsx";

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
        path: "companies",
        element: <CompaniesPage />,
      },
      {
        path: "companies/:id",
        element: <CompanyDetail />,
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
    path: "/loginCompany",
    element: <LoginCompany />,
  },

  {
    path: "/registerCompany",
    element: <RegisterCompany />,
  },
];
