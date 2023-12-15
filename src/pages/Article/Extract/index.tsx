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
        console.log("提取水印");
        let config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: {
                targetFingerprint: 123123,
                file: values.file.file.originFileObj,
            }
        }
        try {

            await axios.post(
                "https://4024f85r48.picp.vip/watermark/extract",
                config.data,
                config
            ).then((res) => {
                console.log(res.data);
                setImageSrc(res.data.uri);
            });
        } catch (error) {

        }


    };

    const handleCustomUpload = async (options: any) => {
        const {file, onSuccess, onError} = options;

        try {
            // 处理上传文件：您可以在这里收集文件数据，并在提交表单时使用
            console.log('文件已选择:', file);
            form.setFieldValue("file", file);
            // 在这里可以将文件数据添加到表单中（示例中未添加，您需要根据需要修改）

            // 模拟成功上传，并调用 onSuccess 方法通知 Ant Design 上传成功
            setTimeout(() => {
                onSuccess("ok");
            }, 1000); // 模拟延迟1秒钟，您可以删除此行代码，根据实际需求调用 onSuccess 或者 onError
        } catch (error) {
            console.error('上传失败:', error);
            onError(error);
        }
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
                        <Form.Item name={"file"} label={"文件"}>
                            <Upload multiple={false} accept={".pdf,.doc"} maxCount={1}
                                    customRequest={handleCustomUpload}>
                                <Button style={{width: '120%'}} icon={<UploadOutlined/>}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: '90%'}}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Flex>


                </Form>

                <Image width={200} height={200} src={imageSrc} >

                </Image>
            </div>
        </div>
    );
};

export default ExtractWaterMarkPage;
