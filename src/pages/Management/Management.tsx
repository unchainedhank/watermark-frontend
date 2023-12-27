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
    Modal, Flex
} from 'antd';
import {Link, useNavigate, useHref} from 'react-router-dom';
import {Simulate} from "react-dom/test-utils";
import axios from "axios";
import {GlobalContext} from "@/contexts/Global";

interface Users {
    key: string;
    userName: string;
    department: string;
    create_time?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    fingerPrint: string;
    role: string;
}
interface IFormState {

    addUid: string;
    // email: string;
    // phone: string;
    //username: string
    // department: string;
    addPassword: string;
    addUserRole: string;
}

const initialData: Users[] = [
    {
        key: '1',
        userName: 'John Doe',
        department: 'IT',
        fingerPrint: 'fingerprint1',
        role: 'Admin',
    },
    {
        key: '2',
        userName: 'Jane Smith',
        department: 'HR',
        fingerPrint: 'fingerprint2',
        role: 'User',
    },
    // Add more default users as needed
];


const Management: React.FC = () => {
    const [dataSource, setDataSource] = useState<Users[]>(initialData);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        // Function to fetch data from an API endpoint using Axios
        const fetchData = async () => {
            try {
                const response = await axios.get('YOUR_API_ENDPOINT'); // Replace with your API endpoint
                const responseData: Users[] = response.data; // Assuming the response data is an array of Users
                setDataSource(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetchData function when component mounts
        fetchData();
    }, []);

    // Columns for the Table
    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: Users) => (
                <Button onClick={() => handleEdit(record)}>Edit</Button>
            ),
        },
    ];

    // Function to handle edit action
    const handleEdit = (record: Users) => {
        // Implement edit logic here, e.g., show a modal with form fields to edit user info
        console.log('Edit user:', record);
    };

    // Function to handle pagination change
    const handlePaginationChange = (page: number, pageSize?: number) => {
        // Implement logic to fetch data for the new page
        console.log('New page:', page);
        setPagination({ current: page, pageSize: pageSize || 10 });
    };
    const { userInfo } = useContext(GlobalContext);
    const onFinish = async (values: any) => {
        // submit(values);
        console.log("原始表单信息：");
        console.log(values);
        let registerConfig = {
            data: {
                uid: userInfo.uid,
                //username: values.uid,
                addUid:values.addUid,
                addPassword:values.password,
                addUserRole:values.addUserRole,
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }
        console.log("发送请求信息");
        console.log(registerConfig.data)
        await axios.post(
            "https://4024f85r48.picp.vip/admin/add/user",
            registerConfig.data,
            registerConfig
        ).then(response => {
            console.log(response);
            if (response.data.statusCode == '200') {
                //navigate('/Login');
                message.success("添加成功");
            } else {
                message.error("添加失败");
            }
        });


    };
    const onFinishFailed = (values: any) => {
        message.error("注册失败");
    }


    return (
        <div>

            <Flex vertical={true} justify={"center"} gap={"large"}>
                <Row justify="start" style={{ marginBottom: '10px' }}>
                    <Col>
                        <Button type="primary" onClick={() => setModalVisible(true)}>
                            Add User
                        </Button>
                    </Col>
                </Row>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false} // Disable built-in pagination as we're using Ant Design's Pagination component
                />
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={100} // Replace 'total' with the actual total number of users
                    onChange={handlePaginationChange}
                    showSizeChanger={true}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    pageSizeOptions={['10', '20', '30']}
                />
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
                    {/* Form fields for user details */}
                    {/* Example: */}
                    {/*<Form.Item label="User Name">*/}
                    {/*    <Input />*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item label="Department">*/}
                    {/*    <Input />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        name="addUid"
                        label="uid"
                        rules={[{required: true, message: 'uid不能为空'},
                           //{pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "'用户名应为4到16位（字母，数字，下划线）'"},
                            // {validator: changeUsername}
                        ]}
                        //style={formLayout}
                    >
                        <Input placeholder="请输入uid" bordered={false} />
                    </Form.Item>
                    <Form.Item
                        name="addUserRole"
                        label={"用户角色"}
                        rules={[{required: true, message: '请设置用户角色!'}]}
                        //style={formLayout}
                    >
                        <Input placeholder="请设置用户角色" bordered={false} />
                    </Form.Item>
                    <Form.Item
                        name="addPassword"
                        label="设置密码"
                        rules={[{required: true, message: '请设置密码!'},
                            {type: "string", max: 18},
                            {type: "string", min: 8},
                            {
                                pattern: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[A-Z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*\d)(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])|(?=.*[A-Z])(?=.*[a-z])(?=.*[_!@#$%^&*()?=\[\]])).{8,18}$/,
                                message: "数字、大写字母、小写字母、特殊字符至少3种"
                            },
                        ]}

                    >
                        <Input.Password
                            bordered={false}
                            type="password"
                            placeholder="请设置密码"
                        />
                    </Form.Item>
                    {/* Other form fields */}
                    {/* Submit button */}
                    <Form.Item
                        wrapperCol={{offset:8}}
                    >
                        <Button type="primary" htmlType="submit" >
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Management;



