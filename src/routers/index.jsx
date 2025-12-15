import React from "react";
import LayoutDefault from "../Layout/LayoutDefault";
import Home from "../pages/Home/index.jsx";
import JobsPage from "../pages/Jobs/index.jsx";
import CompaniesPage from "../pages/Companies/index.jsx";
import JobDetail from "../pages/JobDetail/index.jsx";
import CandidateDetail from "../pages/CandidateDetail/index.jsx";
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
import LoginAdmin from "../pages/login/loginAdmin.jsx";
import SavedJobs from "../pages/SavedJobs/index.jsx";
import GrossNet from "../pages/GrossNet/index.jsx";
import UnemploymentInsurance from "../pages/UnemploymentInsurance/index.jsx";
import PersonalIncomeTax from "../pages/PersonalIncomeTax/index.jsx";
import SavingsPlan from "../pages/SavingsPlan/index.jsx";
import CompoundInterestPage from "../pages/CompoundInterest/index.jsx";
import AdminLayout from "../Layout/AdminLayout/index.jsx";
import JobsManagement from "../pages/Admin/JobsManagement/index.jsx";
import UsersManagement from "../pages/Admin/UsersManagement/index.jsx";
import CompaniesManagement from "../pages/Admin/CompaniesManagement/index.jsx";
import PostsManagement from "../pages/Admin/PostsManagement/index.jsx";
import CandidateProfile from "../pages/CandidateProfile/index.jsx";
import AppliedJobs from "../pages/AppliedJobs/index.jsx";

import CVTemplatesList from "../pages/CVTemplates/List.jsx";
import CVTemplatePreview from "../pages/CVTemplates/Preview.jsx";
import MyCVsPage from "../pages/MyCVs/index.jsx";
import ViewCVPage from "../pages/ViewCV/index.jsx";
import SkillAssessment from "../pages/SkillAssessment/index.jsx";
import TakeQuiz from "../pages/SkillAssessment/TakeQuiz.jsx";
import QuizResult from "../pages/SkillAssessment/Result.jsx";
import CompanyQuizManagement from "../pages/CompanyQuizManagement/index.jsx";
import QuestionForm from "../pages/CompanyQuizManagement/QuestionForm.jsx";
import QuestionSetForm from "../pages/CompanyQuizManagement/QuestionSetForm.jsx";
import QuizForm from "../pages/CompanyQuizManagement/QuizForm.jsx";
import CareerGuide from "../pages/CareerGuide/index.jsx";
import CareerOrientation from "../pages/CareerGuide/CareerOrientation.jsx";
import JobSearchTips from "../pages/CareerGuide/JobSearchTips.jsx";
import SalaryBenefits from "../pages/CareerGuide/SalaryBenefits.jsx";
import ProfessionalKnowledge from "../pages/CareerGuide/ProfessionalKnowledge.jsx";
import CareerToolkit from "../pages/CareerGuide/CareerToolkit.jsx";
import MarketTrends from "../pages/CareerGuide/MarketTrends.jsx";
import PostsList from "../pages/Posts/index.jsx";
import PostDetail from "../pages/Posts/PostDetail.jsx";

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
        path: "saved-jobs",
        element: <SavedJobs />,
      },
      {
        path: "gross-net",
        element: <GrossNet />,
      },
      {
        path: "compound-interest",
        element: <CompoundInterestPage />,
      },
      {
        path: "unemployment-insurance",
        element: <UnemploymentInsurance />,
      },
      {
        path: "personal-income-tax",
        element: <PersonalIncomeTax />,
      },
      {
        path: "savings-plan",
        element: <SavingsPlan />,
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
        path: "my-cvs",
        element: <MyCVsPage />,
      },
      {
        path: "cv/view/:id",
        element: <ViewCVPage />,
      },
      {
        path: "cv/templates",
        element: <CVTemplatesList />,
      },
      {
        path: "cv/templates/:id",
        element: <CVTemplatePreview />,
      },
      {
        path: "profile",
        element: <CandidateProfile />,
      },
      {
        path: "applications",
        element: <AppliedJobs />,
      },
      {
        path: "candidates/:id",
        element: <CandidateDetail />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "create-job",
        element: <CreateJob />,
      },
      {
        path: "skill-assessment",
        element: <SkillAssessment />,
      },
      {
        path: "skill-assessment/take/:id",
        element: <TakeQuiz />,
      },
      {
        path: "skill-assessment/result/:id",
        element: <QuizResult />,
      },
      {
        path: "company/quiz",
        element: <CompanyQuizManagement />,
      },
      {
        path: "company/quiz/questions/new",
        element: <QuestionForm />,
      },
      {
        path: "company/quiz/question-sets/:id",
        element: <QuestionSetForm />,
      },
      {
        path: "company/quiz/quizzes/:id",
        element: <QuizForm />,
      },
      {
        path: "career-guide",
        element: <CareerGuide />,
      },
      {
        path: "career-guide/orientation",
        element: <CareerOrientation />,
      },
      {
        path: "career-guide/job-search-tips",
        element: <JobSearchTips />,
      },
      {
        path: "career-guide/salary-benefits",
        element: <SalaryBenefits />,
      },
      {
        path: "career-guide/professional-knowledge",
        element: <ProfessionalKnowledge />,
      },
      {
        path: "career-guide/toolkit",
        element: <CareerToolkit />,
      },
      {
        path: "career-guide/market-trends",
        element: <MarketTrends />,
      },
      {
        path: "posts",
        element: <PostsList />,
      },
      {
        path: "posts/:slug",
        element: <PostDetail />,
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
    path: "/loginAdmin",
    element: <LoginAdmin />,
  },
  {
    path: "/post",
    element: <Post />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "jobs",
        element: <JobsManagement />,
      },
      {
        path: "users",
        element: <UsersManagement />,
      },
      {
        path: "companies",
        element: <CompaniesManagement />,
      },
      {
        path: "posts",
        element: <PostsManagement />,
      },
    ],
  },
];
