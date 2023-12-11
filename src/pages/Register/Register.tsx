import React, {useRef, useState} from 'react';
import {Form, Input, Button, Checkbox, Tabs, Row, Col, Typography, theme, message} from 'antd';
import {Footer} from 'antd/lib/layout/layout';
import {Link, useNavigate, useHref} from 'react-router-dom';
import {postLogin, postRegister} from "@/api";
import {useRequest} from "ahooks";
import Cache from "@/utils/cache";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
// const [messageApi,contextHolder]=message.useMessage();
// const navigate = useNavigate()

const onFinishFailed = (values: any) => {
    console.log('falied:', values)
}

const initialValues: Partial<IFormState> = {
    Uid: '',
    Email: '',
    phone: '',
    username: '',
    department: '',
    password: '',
    passwordcertificate: '',
};

interface IFormState {

    Uid: string;
    Email: string;
    phone: string;
    username: string
    department: string;
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

// const handleRegister = () => {
    //     // 触发表单提交事件
    //     const formData = ref.current.getFieldValue();
    //     console.log(formData);
    //     onFinish(formData); // 调用 onFinish 函数并传递表单数据
    //
    // };

    const {run: submit} = useRequest(postRegister, {
        manual: true,
        debounceWait: 300,
        onSuccess: (data) => {
            console.log(data);
            navigate('/Login');
        },
        onError: (error) => {
        }
    });
    const onFinish = async (values: any) => {
        submit(values);
        console.log(values);
        // const [messageApi, contextHolder] = message.useMessage();
        // const navigate = useNavigate();
        // console.log('Received values of form: ', values);
        // try{
        //     const res =await PostRegister(values)
        //         .then((res) =>{
        //                 console.log(res);
        //                 if(res.code==0){
        //                     messageApi.success("success")
        //                     navigate("/login")
        //                 }
        //                 else{
        //                     messageApi.error("error")
        //                 }
        //             }
        //         )
        // }catch (error) {
        //     console.error("发生错误：", error);
        //     messageApi.error("发生错误，请重试");
        // }

    };
    return (
        <div className="bg" style={{backgroundColor: '#333', fontSize: '20px'}}>

            <div className="heard">
                <Typography.Title style={{textAlign: 'center'}}>数字水印系统</Typography.Title>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <Form<IFormState>
                    labelCol={{span: 15}}
                    wrapperCol={{span: 29}}
                    style={{maxWidth: 1800}}
                    autoComplete="off"
                    name="register-form"
                    initialValues={initialValues}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="Uid"
                        rules={[{required: true, message: '账号'}]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input placeholder="请输入账号" bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        rules={[{required: true, message: '请输入手机号!'}, ]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input placeholder="请输入手机号" bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="Email"
                        rules={[{required: true, message: '邮箱'},{
                            type: 'email',
                            message: '请输入正确的邮箱',
                        }]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input placeholder="请输入邮箱" bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: '用户名'}, {pattern: /^[a-zA-Z0-9_-]{4,16}$/,message:"'用户名应为4到16位（字母，数字，下划线，减号）'"}]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input placeholder="请输入用户名" bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="department"
                        rules={[{required: true, message: '请设置部门!'}]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input placeholder="请设置部门" bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请设置密码!'},
                            {type:"string", max:18},
                            {type:"string", min:8},
                            {pattern:/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[A-Z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*\d)(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*[A-Z])(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])).{8,18}$/,message:"数字、大写字母、小写字母、特殊字符至少3种"},
                            // {validator: changePassword,
                            // message: "数字、大写字母、小写字母、特殊字符至少3种"}]}
                            ]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input.Password
                            bordered={false}
                            type="password"
                            placeholder="请设置密码"
                        />
                    </Form.Item>
                    <Form.Item
                        name="passwordcertificate"
                        rules={[{required: true, message: '请确认密码!'},
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不匹配'));
                                },
                            }),
                             // {validator: changePassCtf}
                        ]}
                        style={{borderBottom: '1px solid #DCDCDC'}}
                    >
                        <Input.Password
                            bordered={false}
                            type="password"
                            placeholder="确认密码"
                        />
                    </Form.Item>


                    <Form.Item
                        name="checked"
                        valuePropName="checked"
                        style={{textAlign: 'left'}}
                        rules={[{required: true, message: '您必须同意用户服务协议!'}]}
                    >
                        <Checkbox style={{color: '#CCCCCC'}}>我已阅读并同意《<a>用户服务协议</a>》</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block style={{height: '56PX', borderRadius: '12PX'}}>
                            注册
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        已有帐号，<Link to="/index"><a href="#">点击登录</a></Link>
                    </Form.Item>


                </Form>
            </div>
        </div>
    );
}



