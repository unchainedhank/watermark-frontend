import React, {useContext, useRef, useState} from 'react';
import {Form, Input, Button, Checkbox, Tabs, Row, Col, Typography, theme, message, Flex} from 'antd';
import {Link, useNavigate, useHref} from 'react-router-dom';
import {Simulate} from "react-dom/test-utils";
import axios from "axios";
import {GlobalContext} from "@/contexts/Global";
import CustomPasswordInput from "@page/Register/input";
const apiUrl = 'http://39.96.137.165:30099';

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
            apiUrl+"/user/register",
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
        borderRadius: '10px',
        border: '2px solid #222222',
        margin: '0px 0px 20px 0px',
        width: '330px',
        color: '#ffffff',
        // background:'#c17500'
        // color: '#5a5a5a', // 设置文字颜色为黑色
    };

    return (
        <Flex vertical={true} gap={"middle"} align={"center"}>
            <div>
                <Typography.Title
                    style={{
                        textAlign: 'center',
                        // margin: '20px 10px 30px 10px',
                        color: "#222222",
                        marginTop: '110%',
                        marginLeft: '90px',

                    }}>数字水印系统</Typography.Title>
            </div>
            <div>
                <Form<IFormState>
                    labelCol={{span: 5}}
                    wrapperCol={{span: 19}}
                    autoComplete="off"
                    name="register-form"
                    initialValues={initialValues}
                    size="large"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <span className="helper-text" style={{color: '#073069',marginLeft:'20%'}}>用户名</span>

                    <Form.Item
                        name="uid"
                        // label="用户名"
                        rules={[{required: true, message: '用户名不能为空'},
                            {pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "'用户名应为4到16位（字母，数字，下划线）'"},
                            // {validator: changeUsername}
                        ]}
                        style={{marginLeft:'20%'}}

                    >
                        <Input className={"my-input"} placeholder="请输入用户名" style={formLayout}/>
                    </Form.Item>
                    {/*<span className="helper-text" style={{color:'#09488a'}}>部门</span>*/}

                    {/*<Form.Item*/}
                    {/*    name="department"*/}
                    {/*    // label="设置部门"*/}
                    {/*    rules={[{required: true, message: '请设置部门!'}]}*/}
                    {/*    // style={{color: "#e09a00"}}*/}
                    {/*    //style={formLayout}*/}
                    {/*>*/}

                    {/*    <Input placeholder="请设置部门"  style={formLayout}/>*/}
                    {/*</Form.Item>*/}
                    <span className="helper-text" style={{color: '#073069',marginLeft:'20%'}}>密码</span>
                    <Form.Item
                        name="password"
                        // label="设置密码"
                        rules={[{required: true, message: '请设置密码!'},
                            {type: "string", max: 18},
                            {type: "string", min: 8},
                            {
                                pattern: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[A-Z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*\d)(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*[A-Z])(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])).{8,18}$/,
                                message: "数字、大写字母、小写字母、特殊字符至少3种"
                            },
                        ]}
                        style={{marginLeft:'20%'}}

                    >

                        <Input.Password
                            type="password"
                            placeholder="请设置密码"
                            style={formLayout}
                        />
                    </Form.Item>
                    <span className="helper-text" style={{color: '#073069',marginLeft:'20%'}}>确认密码</span>

                    <Form.Item
                        name="passwordcertificate"
                        // label="确认密码"
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
                        style={{marginLeft:'20%'}}

                    >
                        <Input.Password
                            style={formLayout}
                            type="password"
                            placeholder="确认密码"
                        />
                    </Form.Item>


                    <Form.Item
                        name="checked"
                        valuePropName="checked"
                        style={{
                            textAlign: 'left',
                            marginLeft:'20%'
                        }}
                        rules={[{required: true, message: '您必须同意用户服务协议!'}]}

                    >
                        <Checkbox style={{color: '#000000', textAlign: 'left',}}>我已阅读并同意《<Link
                            to={""}>用户服务协议</Link>》</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block
                                style={{
                                    height: '56PX',
                                    width: '330px',
                                    borderRadius: '12PX',
                                    margin: '0 0 0 80px'
                                }}>
                            注册
                        </Button>
                    </Form.Item>
                    <Form.Item style={{textAlign: 'center', color: '#222222',marginLeft:'30%'}}>
                        已有帐号，<Link to="/login"><a href="#" style={{color: 'red'}}>点击登录</a></Link>
                    </Form.Item>
                </Form>
            </div>
        </Flex>
    );
}



