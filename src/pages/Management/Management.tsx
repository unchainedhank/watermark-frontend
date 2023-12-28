import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Form,
    Input,
    Button,
    Checkbox,
    Tabs,
    Row,
    Col,
    Typography,
    theme,
    message,
    Pagination,
    Table,
    Modal, Flex, Select, Tag
} from 'antd';
import {Link, useNavigate, useHref} from 'react-router-dom';
import {Simulate} from "react-dom/test-utils";
import axios, {AxiosRequestConfig} from "axios";
import {GlobalContext} from "@/contexts/Global";
import RelativeTime from "@/components/RelativeTime";

interface Users {
    key: string;
    uid: string;
    username: string;
    department: string;
    create_time?: string;
    password?: string;
    email?: string;
    phone?: string;
    fingerPrint: string;
    role: string;
}

interface IFormState {

    uid: string;
    username: string;
    department: string;
    phone?: string;
    email?: string;
    password: string;
}


const Management: React.FC = () => {
    const [dataSource, setDataSource] = useState<Users[]>();
    const [pagination, setPagination] = useState({current: 1, pageSize: 10});
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {userInfo, setUserInfo} = useContext(GlobalContext);


    useEffect(() => {
        const fetchUserInfo = async (username: string, password: string) => {
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
                "http://localhost:30098/user/login",
                // "http://http://localhost:30098/user/login",
                infoConfig.data,
                infoConfig
            );
        }

        let tempUid = localStorage.getItem('uid');
        let tempPswd = localStorage.getItem('password');
        console.log("用户列表", userInfo);
        if (userInfo==undefined || Object.keys(userInfo).length === 0) {
            // @ts-ignore
            fetchUserInfo(tempUid, tempPswd).then((res) => {
                if (res.data.statusCode == "200") {
                    let user = res.data.user;

                    const newUserInfo = {
                        uid: user.uid,
                        username: user.username,
                        phone: user.phone,
                        email: user.email,
                        department: user.department,
                        role: user.userRole,
                    }
                    setUserInfo(newUserInfo);
                } else {
                    message.error(res.data.statusContent);
                    navigate("/login");
                }
            })

        }

        const fetchData = async () => {



            let userDataConfig: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                }
            }
            console.log("请求用户列表", userDataConfig.data);

            return await axios.post(
                'http://localhost:30098/admin/select/users',
                userDataConfig.data,userDataConfig);
        };

        fetchData().then((res) => {
            console.log("获取用户列表", res);
            if (res.data.statusCode === '200') {
                const userList: Users[] = res.data.user.map((temp: any) => {
                    let role = '普通用户';
                    if (temp.userRole === 'admin') {
                        role = '管理员';
                    }
                    return {
                        uid: temp.uid,
                        username: temp.username,
                        department: temp.department,
                        password: temp.password,
                        email: temp.email,
                        phone: temp.phone,
                        role: role,
                        createdTime: temp.time,
                    };

                });
                setDataSource(userList);
            }
        });
    }, []);

    // Columns for the Table
    const departments = dataSource ? Array.from(new Set(dataSource.map(item => item.department))) : [];
    const columns = [
        {
            title: 'uid',
            dataIndex: 'uid',
            key: 'uid',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '密码',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
            filters: departments.map(department => ({ text: department, value: department })),
            onFilter: (value: any, record: any) => record.department === value,
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            key: 'createdTime',
            sorter: (a: any, b: any) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
            render: (createdTime: string) => {
                if (createdTime) {
                    return <RelativeTime time={createdTime} />;
                } else {
                    return null; // 如果时间戳为空，则不显示任何内容
                }
            }

        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: '管理员', value: '管理员' },
                { text: '普通用户', value: '普通用户' },
                // 添加其他角色筛选项...
            ],
            onFilter: (value: any, record: any) => record.role === value,
            render: (role: string) => {
                // 根据角色值渲染对应的标签
                let color = '';
                console.log(role);
                if (role === '管理员') {
                    color = 'geekblue';
                } else {
                    color = 'green';
                }
                return (
                    <Tag color={color} key={role}>
                        {role.toUpperCase()}
                    </Tag>
                );
            },
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (text: any, record: Users) => (
        //         <Button onClick={() => handleEdit(record)}>Edit</Button>
        //     ),
        // },
    ];
// Function to handle pagination change
    const onFinish = async (values: any) => {
        // submit(values);
        console.log("原始表单信息：");
        console.log(values);
        let registerConfig = {
            data: {
                uid: userInfo.uid,
                addUid: values.uid,
                addPassword: values.password,
                addUserRole: values.addUserRole,

            },
            headers: {
                'Content-Type': 'application/json',
            }
        }
        console.log("发送请求信息");
        console.log(registerConfig.data)
        await axios.post(
            "http://localhost:30098/admin/add/user",
            registerConfig.data,
            registerConfig
        ).then(response => {
            console.log(response);
            if (response.data.statusCode == '200') {
                //navigate('/Login');
                message.success("添加成功");

                form.resetFields();
                setModalVisible(false);
            } else {
                message.error("添加失败");
            }
        });


    };
    const onFinishFailed = (values: any) => {
        message.error("注册失败");
    }
    const formLayout = {
        borderRadius: ' 10px',
        // backgroundColor: '#eeeeee',
        border: '2px solid #bfbfbf',
        margin: '0px 0px 20px 0px',
        width: '330px',
    };

    return (
        <div>

            <Flex vertical={true} justify={"center"} gap={"large"}>
                <Row justify="start" style={{marginBottom: '10px'}}>
                    <Col>
                        <Button type="primary" onClick={() => setModalVisible(true)}>
                            添加用户
                        </Button>
                    </Col>
                </Row>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false} // Disable built-in pagination as we're using Ant Design's Pagination component
                />
                {/*<Pagination*/}
                {/*    current={pagination.current}*/}
                {/*    pageSize={pagination.pageSize}*/}
                {/*    total={100} // Replace 'total' with the actual total number of users*/}
                {/*    onChange={handlePaginationChange}*/}
                {/*    showSizeChanger={true}*/}
                {/*    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}*/}
                {/*    pageSizeOptions={['10', '20', '30']}*/}
                {/*/>*/}
            </Flex>


            <Modal
                title="Add/Edit User"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {/* Add/Edit User Form */}
                {/* Implement the form here using Ant Design Form components */}
                <Form<IFormState>
                    labelCol={{span: 5}}
                    wrapperCol={{span: 19}}
                    style={{maxWidth: 3000}}
                    autoComplete="off"
                    name="add-form"
                    size="large"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    // Implement the form logic for adding/editing users
                >


                    <Form.Item
                        name="uid"
                        label="uid"
                        rules={[{required: true, message: 'uid不能为空'},
                            {pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "'uid应为4到16位（字母，数字，下划线）'"},
                            // {validator: changeUsername}
                        ]}
                        //style={formLayout}
                    >
                        <Input placeholder="请输入用户名" bordered={false} style={formLayout}/>
                    </Form.Item>
                    <Form.Item
                        name="addUserRole"
                        label="角色"
                        rules={[{required: true, message: '角色不能为空'},
                            // {pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "'uid应为4到16位（字母，数字，下划线）'"},
                            // {validator: changeUsername}
                        ]}
                        //style={formLayout}
                    >
                        <Select options={[
                            {value:'normal', label: '普通用户'}
                        ]}
                            bordered={false} style={formLayout} placeholder={"请选择角色"}/>
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    name="username"*/}
                    {/*    label="用户名"*/}
                    {/*    rules={[*/}
                    {/*        {pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "'用户名应为4到16位（字母，数字，下划线）'"},*/}
                    {/*        // {validator: changeUsername}*/}
                    {/*    ]}*/}
                    {/*    //style={formLayout}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请输入用户名" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}

                    {/*<Form.Item*/}
                    {/*    name="department"*/}
                    {/*    label={"设置部门"}*/}
                    {/*    rules={[{required: true, message: '请设置部门!'}]}*/}
                    {/*    //style={formLayout}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请设置部门" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    name="phone"*/}
                    {/*    label={"设置手机号"}*/}
                    {/*    // rules={[{required: true, message: '请设置部门!'}]}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请设置手机号" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    name="email"*/}
                    {/*    label={"设置邮箱"}*/}
                    {/*    rules={[{type:'email', message: '请输入正确的邮箱!'}]}*/}
                    {/*>*/}
                    {/*    <Input placeholder="请设置邮箱" bordered={false} style={formLayout}/>*/}
                    {/*</Form.Item>*/}
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
                    {/* Other form fields */}
                    {/* Submit button */}
                    <Form.Item
                        wrapperCol={{offset: 8}}
                    >
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Management;



