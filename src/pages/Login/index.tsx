import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {Button, Checkbox, Col, ConfigProvider, Form, Input, Row, theme, Typography, Flex, message} from 'antd';
import Cache from '@/utils/cache';
import type {FlexProps} from "antd";
import {validateToken} from '@/utils/jwt';
import {useRequest} from 'ahooks';
import './index.less';
import Config from '@/configs';
import {Link, useNavigate} from 'react-router-dom';
import UserInfo = Api.UserInfo;
import {Http} from "@/utils/http";
import axios, {AxiosRequestConfig} from "axios";
import {GlobalContext} from "@/contexts/Global";
const apiUrl = 'wm_container:3000';

interface IFormState {
    uid: string;
    password: string;
    remember: boolean;
}


// todo: dark theme 适配
const LoginPage: React.FC = () => {

    const navigate = useNavigate();
    const {userInfo, setUserInfo} = useContext(GlobalContext);


    const [form] = Form.useForm();
    document.title = Config.pageTitle;

    useEffect(() => {
        if (localStorage.getItem('remember') == 'true') {
            form.setFieldValue('uid', localStorage.getItem('uid'));
            form.setFieldValue('password', localStorage.getItem('password'));
        }
    }, [])


    const onFinish = (values: IFormState) => {

        let loginConfig: AxiosRequestConfig = {
            data: {
                uid: values.uid,
                password: values.password,
            }
        };
        axios.post(
            apiUrl + '/user/login',
            loginConfig.data,
            loginConfig
        ).then((res) => {
            console.log("登录返回值", res);
            if (res.data.statusCode === '200') {
                let info = res.data.user;
                let temp: UserInfo = {
                    uid: info.uid,
                    username: info.username,
                    phone: info.phone,
                    email: info.email,
                    department: info.department,
                    role: info.userRole,
                };
                setUserInfo(temp);
                localStorage.setItem('uid', info.uid);
                localStorage.setItem('password', values.password);
                const rememberValue = form.getFieldValue('remember');
                console.log("记住", rememberValue);
                if (rememberValue) {
                    localStorage.setItem('remember', 'true');
                }
                navigate('/dashboard');
            } else if (res.data.statusCode === '400') {
                message.error("uid错误或不存在或密码不正确");
            } else {
                message.error("登录失败");
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
    // if (validateToken()) {
    // 跳转到控制台页, 再通过接口继续判断token的有效性
    // navigate('/dashboard');
    // }
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
        uid: '',
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
                            form={form}
                            name="loginForm"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 19}}
                            style={{maxWidth: 600}}
                            initialValues={initialValues}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="uid"
                                name="uid"
                                rules={[{required: true, message: '请输入uid!'}]}
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
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                                <Link to="/register">
                                    <Button type="primary" htmlType="button" style={{margin: '0 0 0 25px'}}>
                                        注册
                                    </Button>
                                </Link>
                            </Form.Item>

                        </Form>
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    );
};

export default LoginPage;
