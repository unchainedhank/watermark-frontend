import {Button, ColorPicker, Form, Input, Select, Switch, Typography, Upload, Watermark} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import type {Color} from 'antd/es/color-picker';
import {UploadOutlined} from '@ant-design/icons';
import axios, {AxiosRequestConfig} from "axios";
import {userInfo} from "os";
import UserInfo = Api.UserInfo;
import {AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders} from "axios/index";

const {Paragraph} = Typography;


const ExtractWaterMarkPage: React.FC = () => {
// 生成文件操作按钮
    const [form] = Form.useForm();



    const onFinish = async (values: any) => {
        let config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            data: values.file
        }
        await axios.post(
            "/watermark/extract/invisible",
            config,
        ).then((res) => {
            if (res.data.statusCode === 200) {
                try {
                    // 创建一个 Blob 对象，包含从服务器返回的文件数据
                    const blob = new Blob([res.data.file], {
                        type: res.headers['content-type'],
                    });
                    // 创建一个 URL 对象，指向该 Blob 对象
                    const downloadUrl = window.URL.createObjectURL(blob);
                    // 创建一个链接并模拟点击下载
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = '下载的文件名'; // 可以根据需要设置文件名
                    document.body.appendChild(link);
                    link.click();
                    // 清理创建的 URL 对象
                    window.URL.revokeObjectURL(downloadUrl);
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
            //    提示失败
            }
            console.log(res);
        })

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (

        <div>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '20px'}}>
                {/* Form */}
                <Form
                    style={{
                        width: '280px',
                        borderLeft: '1px solid #eee',
                        paddingLeft: '20px',
                    }}
                    form={form}
                    layout="vertical"
                    // onValuesChange={(changedValues, allValues) => {
                    //     // 使用spread operator将改变的值合并到现有配置中
                    //     setWatermarkConfig(prevConfig => ({...prevConfig, ...changedValues}));
                    // }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete={"on"}
                >

                    <Form.Item name={"file"} label={"文件"}>
                        <Upload multiple={false} accept={".pdf,.doc"} maxCount={1}>
                            <Button icon={<UploadOutlined/>}>点击上传</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </div>
    );
};

export default ExtractWaterMarkPage;
