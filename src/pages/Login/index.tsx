import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {Button, Checkbox, Col, ConfigProvider, Form, Input, Row, theme, Typography, Flex, message} from 'antd';
import Cache from '@/utils/cache';
import type {FlexProps} from "antd";
import {validateToken} from '@/utils/jwt';
import {postLogin} from '@/api';
import {useRequest} from 'ahooks';
import './index.less';
import Config from '@/configs';
import {Link, useNavigate} from 'react-router-dom';
import UserInfo = Api.UserInfo;
import axios from "axios";

interface IFormState {
    username: string;
    password: string;
    remember: boolean;
}


// todo: dark theme 适配
const LoginPage: React.FC = () => {

    const navigate = useNavigate();
    // const { loading: loginRunning, run: submit } = useRequest(postLogin, {
    //   manual: true,
    //   debounceWait: 300,
    //   onSuccess: (data) => {
    //     console.log(data);
    //     if (data) {
    //       Cache.setToken(data.token);
    //       const userInfo = data.user;
    //       console.log("userInfo", userInfo);
    //       localStorage.setItem('userInfo', JSON.stringify(userInfo));
    //       navigate('/dashboard');
    //     } else {
    //       message.error("用户名或密码错误");
    //     }
    //
    //   }
    // });

    document.title = Config.pageTitle;

    const onFinish = (values: IFormState) => {

        let loginConfig = {
            data: {
                uid: values.username,
                password: values.password,
            },
            headers: {
                contentType: "application/json",
            }
        };
        axios.post(
            "https://4024f85r48.picp.vip/user/login",
            loginConfig.data,
            loginConfig
        ).then((res) => {
            console.log(res);
            if (res.data.statusCode == "200") {
                const userInfo = res.data.user;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                Cache.setToken(res.data.token);
                navigate('/dashboard');
            } else {
                message.error(res.data.statusContent);
            }
        });

        // submit(values);
        // postLogin(values)
        //   .then((data) => {
        //     Cache.setToken(data.token);
        //     toDashboardPage();
        //   })
        //   .catch((e) => 1);
    };

    // useEffect(() => {
    //     if (validateToken()) {
    //         // 跳转到控制台页, 再通过接口继续判断token的有效性
    //         navigate('/dashboard');
    //     }
    // }, []);

    // example: 使用useForm
    // const [form] = useForm<IFormState>();
    // form.validateFields().then(value => {
    //   value.password // xxxx
    // })

    const tailLayout = {
        wrapperCol: {offset: 4, span: 16},
    };
    const initialValues: Partial<IFormState> = {
        remember: true,
        username: '',
        password: ''
    };
    return (
        <>
            <ConfigProvider
                theme={{
                    algorithm: [theme.defaultAlgorithm]
                }}
            >
                <div className="bg-wrap"></div>
                <Row className="login-wrap">
                    <Col span={15} className="login-banner"></Col>
                    <Col span={9} className="login-form-wrap">
                        <Typography.Title style={{textAlign: 'center'}}>数字水印系统</Typography.Title>
                        <br/>
                        <Form<IFormState>
                            name="loginForm"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 19}}
                            style={{maxWidth: 600}}
                            initialValues={initialValues}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="用户名"
                                name="username"
                                rules={[{required: true, message: '请输入用户名!'}]}
                            >
                                <Input placeholder="请输入uid"/>
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[{required: true, message: '请输入密码!'}]}
                            >
                                <Input.Password placeholder="请输入密码"/>
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 5}}>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>

                            {/*<Form.Item wrapperCol={{ offset: 5, span: 16 }}>*/}
                            {/*  <Button loading={loginRunning} type="primary" htmlType="submit">*/}
                            {/*    登录*/}
                            {/*  </Button>*/}
                            {/*</Form.Item>*/}

                            {/*<Form.Item wrapperCol={{ offset: 5, span: 16 } }>*/}
                            {/*  <Link to="/register">*/}
                            {/*    <Button type="primary" htmlType="button">*/}
                            {/*      注册*/}
                            {/*    </Button>*/}
                            {/*  </Link>*/}
                            {/*</Form.Item>*/}
                            <Form.Item  {...tailLayout}>
                                <Flex>
                                    <Button type="primary" htmlType="submit">
                                        登录
                                    </Button>
                                    <Link to="/register">
                                        <Button type="primary" htmlType="button" style={{margin: '0 25px'}}>
                                            注册
                                        </Button>
                                    </Link>
                                </Flex>

                            </Form.Item>

                        </Form>
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    );
};

export default LoginPage;
