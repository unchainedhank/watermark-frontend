import {Button, Form, Input, message} from "antd";
import React, {useContext} from "react";
//import axios from "axios/index";
import axios from "axios";
import {GlobalContext} from "@/contexts/Global";
import {userInfo} from "os";
const apiUrl = 'wm_container:3000';

const UserCenterUpdatePage: React.FC = () => {

  const {userInfo, setUserInfo} = useContext(GlobalContext);

  const onFinishFailed = (values: any) => {
    message.error("修改信息失败");
  }

  const [form] = Form.useForm();
//提交表单
  const onFinish = async (values: any) => {
    // submit(values);
    console.log("原始表单信息：");
    console.log(values);
    let updateConfig = {
      data: {
        uid: userInfo.uid,
        phone: values.phone,
        email: values.email,
        department: values.department,
        password: values.password,

  },
    headers: {
      'Content-Type': 'application/json',
    }
  }
    console.log("发送请求信息");
    console.log(updateConfig.data)
    await axios.post(
        apiUrl+"/userinfo/fill",
        updateConfig.data,
        updateConfig
    ).then(response => {
      console.log(response);
      if (response.data.statusCode == '200') {
        form.resetFields();
        message.success("信息修改成功");
      } else {
        message.error("信息提交失败");
      }
    });
  }



  interface IFormState {
    email: string;
    phone: string;
    department: string;
    password: string;
    confirmPassword: string;
  }
  const initialValues: Partial<IFormState> = {
    email: '',
    phone: '',
    department: '',
  };
  const formLayout = {
    borderRadius: ' 10px',
    //backgroundColor: '#ffffff',
    border: '2px solid #bfbfbf',
    // margin: '0px 0px 20px 0px',
    //width: '350px',
    //height:'50px',
  };
  const changePhone = (rule: any, value: string) => {
    const reg = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/
    const flag = reg.test(value)
    if (!flag) {
      return Promise.reject('电话号码填写错误')
    }
    return Promise.resolve()
  }


  return(

      <Form<IFormState>
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          style={{
            // maxWidth: 500,
            //backgroundColor:'#ffffff',
            padding:'20px',
            maxWidth:350,
            // borderRadius: ' 10px',
          }}
          autoComplete="off"
          name="update-form"
          initialValues={initialValues}
          size="large"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}

      >

        <Form.Item
            name="phone"
            label="电话"
            rules={[{required: true, message: '请输入手机号!'}, {validator: changePhone}]}
        >
          <Input placeholder="请输入手机号" bordered={false} style={formLayout}/>
        </Form.Item>
        <Form.Item
            name="email"
            label="邮箱"
            rules={[{required: true, message: '邮箱'}, {
              type: 'email',
              message: '请输入正确的邮箱',
            }]}
        >
          <Input placeholder="请输入邮箱" bordered={false} style={formLayout}/>
        </Form.Item>
        <Form.Item
            name="department"
            label="部门"
            rules={[{required: true, message: '请设置部门!'}]}
        >
          <Input placeholder="请设置部门" bordered={false} style={formLayout}/>
        </Form.Item>

        <Form.Item
            name="password"
            label="密码"
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
            label="确认"
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


        <Form.Item>
          <Button type="primary" htmlType="submit" block
                  style={{width:'100px',borderRadius: '12PX', margin: '0 0 0 100px'}}>
            提交
          </Button>
        </Form.Item>



      </Form>
  )


};

export default UserCenterUpdatePage;
