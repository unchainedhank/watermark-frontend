import {Form, Input, Select, Typography, TreeSelect, Flex, ColorPicker, Button, Table, Tag, Alert, Space} from 'antd';
import React, {useEffect, useRef, useState, useMemo, useContext} from 'react';
import {InputNumber, Slider, Watermark} from 'antd';
import type {Color} from 'antd/es/color-picker';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined, InboxOutlined, SyncOutlined, UploadOutlined} from '@ant-design/icons';
import moment from 'moment';
import axios from "axios";

const {Paragraph} = Typography;

interface WatermarkConfig {
    content: string;
    fontColor: string | Color;
    fontSize: number;
    frameSize: number;
    rotate: number;
    privateKey: string;
}


const rotateChange = (value: string) => {
    console.log(`selected ${value}`);
};

const AddWaterMarkPage: React.FC = () => {
// 生成文件操作按钮
    const [form] = Form.useForm();
    const [config, setConfig] = useState<WatermarkConfig>({
        content: 'pkc',
        fontColor: 'rgba(250, 0, 0, 0.9)',
        fontSize: 30,
        frameSize: 11,
        rotate: 0,
        privateKey: "",
    });
    const {content, fontColor, fontSize, frameSize, rotate, privateKey} = config;

    const watermarkProps = useMemo(() => ({
            content: content,
            font: {
                color: typeof fontColor === 'string' ? fontColor : fontColor.toRgbString(),
                fontSize,
            },
            frameSize: frameSize,
            rotate: rotate,
            privateKey: privateKey,
        }), [config]);

    const onFinish = async ( values: any) => {
        console.log('Success:', values);
        let file = values.file;
        console.log("file", file);
        let storedUserInfo = localStorage.getItem('userInfo');
        console.log(storedUserInfo);
        await axios.post(
            "",
            values,

        ).then((res)=>{
            console.log(res);
        //    download(res)
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
                    initialValues={config}
                    onValuesChange={(changedValues, allValues) => {
                        // 使用spread operator将改变的值合并到现有配置中
                        setConfig(prevConfig => ({...prevConfig, ...changedValues}));
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete={"on"}
                >
                    <Form.Item name="content" label="自定义水印内容">
                        <Input placeholder="pkc" showCount maxLength={20}/>
                    </Form.Item>
                    <Form.Item name="fontColor" label="字体颜色">
                        <ColorPicker trigger={"hover"} defaultFormat={"rgb"} format={"rgb"} showText={true}/>
                    </Form.Item>
                    <Form.Item name="fontSize" label="字体大小">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="frameSize" label="水印框大小">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="rotate" label="水印角度">
                        <Select
                            // defaultValue=0
                            // style={{ width: 120 }}
                            onChange={rotateChange}
                            options={[
                                {value: '0', label: '0°'},
                                {value: '30', label: '30°'},
                                {value: '60', label: '60°'},
                                {value: '90', label: '90°'},
                                {value: '120', label: '120°'},
                                {value: '150', label: '150°'},
                                {value: '180', label: '180°'},

                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="privateKey" label="密钥" rules={[
                        {
                            required : true,
                            message: "请输入密钥",
                        }
                    ]}>
                        <Input placeholder="10位数字" showCount maxLength={10}/>
                    </Form.Item>
                    <Form.Item name={"file"} label={"文件"}>
                        <Upload multiple={true} accept={".pdf,.doc"}>
                            <Button icon={<UploadOutlined/>}>点击上传</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
                <div>

                </div>

                {/* Watermark and Image */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <Watermark {...watermarkProps}>
                        <img
                            style={{
                                zIndex: 10,
                                width: '100%',
                                maxWidth: '800px',
                                position: 'relative',
                            }}
                            src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
                            alt="示例图片"
                        />
                        <Paragraph>
                            段落开头：
                        </Paragraph>
                    </Watermark>
                </div>


            </div>
        </div>
    );
};

export default AddWaterMarkPage;
