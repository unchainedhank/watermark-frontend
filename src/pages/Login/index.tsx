import React, {useEffect} from 'react';
import {Button, Checkbox, Col, ConfigProvider, Form, Input, Row, theme, Typography, Flex, message} from 'antd';
import Cache from '@/utils/cache';
import './index.less';
import Config from '@/configs';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import {useForm} from "antd/es/form/Form";

interface IFormState {
    username: string;
    password: string;
    remember: boolean;
}


// todo: dark theme 适配
const LoginPage: React.FC = () => {
    const [form] = useForm(); // 使用 useForm 声明 form
    useEffect(() => {
        // 从 localStorage 中获取记住的用户名和密码
        const rememberMeInfo = localStorage.getItem('rememberMeInfo');
        if (rememberMeInfo) {
            console.log("获取的登录缓存：", rememberMeInfo)
            const {username, password, rememberMe} = JSON.parse(rememberMeInfo);
            if (rememberMe == true) {
                form.setFieldsValue({
                    username,
                    password,
                    remember: true,
                });
            }

        }

    }, []);


    const navigate = useNavigate();
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
                localStorage.setItem('rememberMeInfo', JSON.stringify({
                    username: values.username,
                    password: values.password,
                    rememberMe: values.remember,
                }));

                Cache.setToken(res.data.token);
                navigate('/dashboard');
                message.success("登录成功");
            } else {
                message.error(res.data.statusContent);
            }
        });

    };

    const tailLayout = {
        wrapperCol: {offset: 4, span: 16},
    };
    const initialValues: Partial<IFormState> = {
        remember: false,
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
                            form={form}
                            labelCol={{span: 5}}
                            wrapperCol={{span: 19}}
                            style={{maxWidth: 600}}
                            initialValues={initialValues}
                            onFinish={onFinish}
                            autoComplete="on"
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
