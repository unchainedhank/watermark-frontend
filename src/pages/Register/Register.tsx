import React, {useContext, useRef, useState} from 'react';
import {Form, Input, Button, Checkbox, Tabs, Row, Col, Typography, theme, message} from 'antd';
import {Link, useNavigate, useHref} from 'react-router-dom';
import {Simulate} from "react-dom/test-utils";
import axios from "axios";
import {GlobalContext} from "@/contexts/Global";

const onFinishFailed = (values: any) => {
    message.error("注册失败");
}

const initialValues: Partial<IFormState> = {
    uid: '',
    // email: '',
    // phone: '',
    username: '',
    // department: '',
    password: '',
    passwordcertificate: '',
};

interface IFormState {

    uid: string;
    // email: string;
    // phone: string;
    username: string
    // department: string;
    password: string;
    passwordcertificate: string;
}

export default function register(this: IFormState) {
    const navigate = useNavigate();
    // const [formValues, setFormValues] = useState(initialValues);
    // const ref = useRef(null);
    // const changePhone = (values: any) => {
    //     console.log(values)
    //     const formData = ref.current.getFieldValue();
    //     const reg = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/
    //     const flag = reg.test(formData.phone)
    //     if (!flag) {
    //         return Promise.reject('电话号码填写错误')
    //     }
    //     return Promise.resolve()
    // }
    const changePhone = (rule: any, value: string) => {
        const reg = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/
        const flag = reg.test(value)
        if (!flag) {
            return Promise.reject('电话号码填写错误')
        }
        return Promise.resolve()
    }
// const handleRegister = () => {
    //     // 触发表单提交事件
    //     const formData = ref.current.getFieldValue();
    //     console.log(formData);
    //     onFinish(formData); // 调用 onFinish 函数并传递表单数据
    //
    // };

    // const {run: submit} = useRequest(postRegister, {
    //     manual: true,
    //     debounceWait: 300,
    //     onSuccess: (data) => {
    //         console.log(data);
    //         navigate('/Login');
    //     },
    //     onError: (error) => {
    //     }
    // });

    const onFinish = async (values: any) => {
        // submit(values);
        console.log("原始表单信息：");
        console.log(values);
        let registerConfig = {
            data: {
                phone: '',
                username: values.uid,
                uid: values.uid,
                password: values.password,
                department: values.department,

            },
            headers: {
                'Content-Type': 'application/json',
            }
        }
        console.log("发送请求信息");
        console.log(registerConfig.data)
        await axios.post(
            "https://4024f85r48.picp.vip/user/register",
            registerConfig.data,
            registerConfig
        ).then(response => {
            console.log(response);
            if (response.data.statusCode == '200') {
                navigate('/Login');
                message.success("注册成功");
            } else {
                message.error("注册失败");
            }
        });


    };
    const formLayout = {
        borderRadius: ' 10px',
        backgroundColor: '#ffffff',
        border: '2px solid #bfbfbf',
        margin: '0px 0px 20px 0px',
        width: '330px',
        //height:'50px',

    };

    return (
        <div style={{backgroundColor: '#f5f5f5', fontSize: '10px'}}>
            <div>
                <Typography.Title
                    style={{textAlign: 'center', margin: '20px 10px 30px 10px'}}>数字水印系统</Typography.Title>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                background: '#f5f5f5',
                //overflow: 'scroll',
                height: '200px'
            }}>
                <Form<IFormState>
                    labelCol={{span: 5}}
                    wrapperCol={{span: 19}}
                    style={{maxWidth: 3000}}
                    autoComplete="off"
                    name="register-form"
                    initialValues={initialValues}
                    size="large"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}

                >
                    <br/>
                    {/*<Form.Item*/}
                    {/*    name="uid"*/}
                    {/*    rules={[{required: true, message: '账号'}, {*/}
                    {/*        pattern: /^[a-zA-Z0-9_-]{4,16}$/,*/}
                    {/*        message: "'账号应为4到16位（字母，数字，下划线，减号）'"*/}
                    {/*    },*/}
                    {/*    ]}*/}

                    {/*    // style={{borderRadius:' 0 10px 10px 0',*/}
                    {/*    //     backgroundColor: '#FFFFFF',*/}
                    {/*    //     border: '2px solid #bfbfbf',*/}
                    {/*    //     margin:'5px'*/}
                    {/*    // }}*/}
                    {/*    //style={formLayout}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请输入账号" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    name="phone"*/}
                    {/*    rules={[{required: true, message: '请输入手机号!'}, {validator: changePhone}]}*/}
                    {/*    // style={{borderRadius:' 10px',*/}
                    {/*    //     backgroundColor: '#FFFFFF',*/}
                    {/*    //     border: '2px solid #bfbfbf',*/}
                    {/*    //     margin:'20px',*/}
                    {/*    //     width:'400px',*/}
                    {/*    //     height:'50px'*/}
                    {/*    // }}*/}
                    {/*    //style={formLayout}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请输入手机号" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    name="email"*/}
                    {/*    rules={[{required: true, message: '邮箱'}, {*/}
                    {/*        type: 'email',*/}
                    {/*        message: '请输入正确的邮箱',*/}
                    {/*    }]}*/}
                    {/*    //style={formLayout}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请输入邮箱" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        name="uid"
                        label="用户名"
                        rules={[{required: true, message: '用户名不能为空'},
                            {pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "'用户名应为4到16位（字母，数字，下划线）'"},
                            // {validator: changeUsername}
                        ]}
                        //style={formLayout}
                    >
                        <Input placeholder="请输入用户名" bordered={false} style={formLayout}/>
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label={"设置部门"}
                        rules={[{required: true, message: '请设置部门!'}]}
                        //style={formLayout}
                    >
                        <Input placeholder="请设置部门" bordered={false} style={formLayout}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="设置密码"
                        rules={[{required: true, message: '请设置密码!'},
                            {type: "string", max: 18},
                            {type: "string", min: 8},
                            {
                                pattern: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[A-Z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*\d)(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*[A-Z])(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])).{8,18}$/,
                                message: "数字、大写字母、小写字母、特殊字符至少3种"
                            },
                            // {validator: changePassword,
                            // message: "数字、大写字母、小写字母、特殊字符至少3种"}]}
                        ]}
                        //style={formLayout}
                    >
                        <Input.Password
                            bordered={false}
                            type="password"
                            placeholder="请设置密码"
                            style={formLayout}
                        />
                    </Form.Item>
                    <Form.Item
                        name="passwordcertificate"
                        label="确认密码"
                        rules={[{required: true, message: '请确认密码!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不匹配'));
                                },
                            }),
                            // {validator: changePassCtf}
                        ]}
                        //style={formLayout}
                    >
                        <Input.Password
                            bordered={false}
                            type="password"
                            placeholder="确认密码"
                            style={formLayout}
                        />
                    </Form.Item>


                    <Form.Item
                        name="checked"
                        valuePropName="checked"
                        style={{
                            textAlign: 'left',
                            margin: '0 0 0px 80px'
                        }}
                        rules={[{required: true, message: '您必须同意用户服务协议!'}]}
                    >
                        <Checkbox style={{color: '#000000', textAlign: 'left',}}>我已阅读并同意《<Link
                            to={""}>用户服务协议</Link>》</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block
                                style={{height: '56PX', width: '330px', borderRadius: '12PX', margin: '0 0 0 80px'}}>
                            注册
                        </Button>
                    </Form.Item>
                    <Form.Item
                        style={{
                            //textAlign: 'left',
                            textAlign: 'center',
                            //margin: '0 0 0 40px'

                        }}
                    >
                        已有帐号，<Link to="/index"><a href="#">点击登录</a></Link>
                    </Form.Item>


                </Form>
            </div>
        </div>
    );
}



