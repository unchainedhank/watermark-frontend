import { message, notification } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { getUserInfo } from '@/api';
import { validateToken } from '@/utils/jwt';
import PageLoading from '@/components/Loading/PageLoading';
import { GlobalContext } from '@/contexts/Global';
import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import { SettingContext } from '@/contexts/Setting';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import MultitabLayout from '../multiTab';
import SingleLaylut from '../singleTab';
import MenuProvider, { MenuContext } from '@/contexts/Menu';
import useThemeToken from '@/hooks/useThemeToken';
import React from 'react';
import './index.less';
import './fixed-layout.less';
import { useUpdateEffect } from 'ahooks';
import Cache from "@/utils/cache";

const GlobalLayout: React.FC = () => {
  const [getUserInfoLoading, setGetUserInfoLoading] = useState(true);
  const { setIsLogin, setUserInfo } = useContext(GlobalContext);

  const { colorBgContainer } = useThemeToken();
  const {
    settings: { multitabMode, fixedMenu, fixedHeader, theme }
  } = useContext(SettingContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  console.log('global layout render...');

  useEffect(() => {
    // if (pathname === '/') {
    //   navigate('/dashboard');
    // }
    const fetchUserInfo = async (username:string,password:string) => {
      let infoConfig: AxiosRequestConfig = {
        data: {
          uid: username,
          password: password,
        },
        headers: {
          contentType: "application/json",
        }
      };
      return await axios.post(
          "https://4024f85r48.picp.vip/user/login",
          // "http://localhost:30098/user/login",
          infoConfig.data,
          infoConfig
      );
    }

    console.log(validateToken())
    if (!validateToken()) {
      // token 无效
      navigate('/login');
      return;
    }

    setIsLogin(true);
    setGetUserInfoLoading(false);
    const rememberMeInfo = localStorage.getItem('rememberMeInfo');
    if (rememberMeInfo) {
      console.log("获取的登录缓存：", rememberMeInfo)
      const {username, password, rememberMe} = JSON.parse(rememberMeInfo);
      fetchUserInfo(username,password).then((res)=>{
        console.log("登录返回值")
        console.log(res);
        if (res.data.statusCode == "200") {
          let user = res.data.user;

          const newUserInfo = {
            uid: user.uid,
            username:user.username,
            phone: user.phone,
            email: user.email,
            department: user.department,
            role: user.userRole,
          }
          setUserInfo!(newUserInfo);
          console.log(newUserInfo)

          navigate('/dashboard');
        } else {
          message.error(res.data.statusContent);
          navigate("/login");
        }
      })
    }
    // setUserInfo!(data);
    // 第一个接口必须要保成功
    // todo: async await
    // getUserInfo()
    //   .then((data) => {
    //     setGetUserInfoLoading(false);
    //     setIsLogin(true);
    //     setUserInfo!(data);
    //
    //     // 借助 gh-page 404.html的功能跳转回来, 解析路由并加载相应的页面
    //     // https://www.xstnet.com/article-162.html
    //     if (searchParams.has('ghpage')) {
    //       const ghpage = decodeURIComponent(searchParams.get('ghpage')!);
    //       navigate(ghpage);
    //       return;
    //     }
    //   })
    //   .catch((e) => {
    //     if (e instanceof AxiosError) {
    //       notification.error({
    //         message: '网络错误',
    //         description: '获取用户信息失败, 无法打开页面',
    //         duration: null,
    //         closeIcon: null
    //       });
    //     }
    //   });
  }, []);

  // 页面更新检测token, 不需要第二个参数
  // useUpdateEffect(() => {
  //   if (!validateToken()) {
  //     // token 无效
  //     message.error('登录状态已失效, 即将跳转到登录页面...');
  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 500);
  //   }
  // });

  if (getUserInfoLoading) {
    return <PageLoading title="页面加载中" loading={getUserInfoLoading} />;
  }
  return (
    <MenuProvider>
      <div
        data-fixed-menu={fixedMenu ? 1 : 0}
        data-fixed-header={fixedHeader ? 1 : 0}
        style={{ background: colorBgContainer }}
        className={`global-layout theme-${theme}`}
      >
        {multitabMode ? <MultitabLayout /> : <SingleLaylut />}
        {/*<SmallScreenNotify />*/}
      </div>
    </MenuProvider>
  );
};

export default React.memo(GlobalLayout);
