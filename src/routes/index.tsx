import React, { lazy } from 'react';

import { RouteObject, createBrowserRouter } from 'react-router-dom';
import Redirect from '@/components/Redirect';

import GlobalLayout from '@/layouts/global';
import PageLoading from '@/components/Loading/PageLoading';

import { UserCenterPage, UserCenterUpdatePage } from '@/pages/UserCenter';
import { NotFoundPage } from '@/pages/Error';
import { AddWatermarkPage } from '@/pages/Article';
import { ExtractWatermarkPage } from '@/pages/Article';

import { iframeUrlPrefix } from '@/utils/iframe';

// const ArticleIndexPage = lazy(() => import('@/pages/Article/Index/index'));
const LoginPage = lazy(() => import('@/pages/Login'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const IframePage = lazy(() => import('@/pages/Iframe'));
const RegisterPage = lazy(() => import('@/pages/Register/Register'));
const ManagementPage = lazy(() => import('@/pages/Management/Management'));

const Suspense: React.FC<React.PropsWithChildren> = ({ children }) => (
  <React.Suspense fallback={<PageLoading />}>{children}</React.Suspense>
);

// todo: 页面错误降级
export function routeRules() {
  const routes: RouteObject[] = [

    {
      path: '/Login',
      element: <Suspense children={<LoginPage />} />
    },
    {
      path:'/Register',
      // element:<RegisterPage />
      element:  <Suspense children={<RegisterPage />}/>
    },

    {
      path: '/',
      element: <GlobalLayout />,
      children: [
        {
          path: '/',
          // 重定向
          element: <Redirect to="/dashboard" />
        },
        {
          path: '/dashboard',
          element: <Suspense children={<DashboardPage />} />
        },
        {
          path: '/user',
          children: [
            {
              index: true,
              element: <UserCenterPage />
            },
            {
              path: '/user/center/index',
              element: <UserCenterPage />
            },
            {
              path: '/user/center/update',
              element: <UserCenterUpdatePage />
            }
          ]
        },
        {
          path: '/management',
          element:  <Suspense children={<ManagementPage />}/>
        },

        {
          path: '/article',
          // element: <ArticleIndexPage />,
          children: [
            // {
            //   index: true,
            //   element: <Suspense children={<ArticleIndexPage />} />
            // },
            {
              path: '/article/category',
              element: <ExtractWatermarkPage />
            },
            {
              path: '/article/create',
              element: <AddWatermarkPage />
            },
          ]
        },
        {
          path: iframeUrlPrefix,
          element: <Suspense children={<IframePage />} />
        },

        {
          path: '*',
          element: <NotFoundPage />
        }
      ]
    }
  ];
  return routes;
}

export const routes = createBrowserRouter(routeRules(), { basename: import.meta.env.BASE_URL });
