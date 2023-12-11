import {Button, ColorPicker, Flex, Form, Image, Input, Select, Switch, Typography, Upload, Watermark} from 'antd';
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
    const [imageSrc, setImageSrc] = React.useState<string | undefined>(undefined);

    const onFinish = async (values: any) => {
        let config: AxiosRequestConfig = {
            data: values.file
        }
        await axios.post(
            "/watermark/extract/invisible",
            config,
        ).then((res) => {
            if (res.data.statusCode === 200) {
                try {
                    // 创建一个 Blob 对象，包含从服务器返回的文件数据
                    setImageSrc(URL.createObjectURL(new Blob([res.data.file])));
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
                    <Flex vertical={true} gap={"middle"}>
                        <Form.Item name={"file"} label={"文件"} >
                            <Upload multiple={false} accept={".pdf,.doc"} maxCount={1}>
                                <Button style={{width:'120%'}} icon={<UploadOutlined/>}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width:'40%'}}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Flex>


                </Form>

                <Image width={200} height={200} src={imageSrc} fallback={"error"}>

                </Image>
            </div>
        </div>
    );
};

export default ExtractWaterMarkPage;
