import {Button, ColorPicker, Form, Input, Select, Typography, Upload, Watermark} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import type {Color} from 'antd/es/color-picker';
import {UploadOutlined} from '@ant-design/icons';
import axios, {AxiosRequestConfig} from "axios";
import {userInfo} from "os";
import UserInfo = Api.UserInfo;

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

type TemplateType = {
    id: string;
    name: string;
    content: string;
    fontColor: string;
    fontSize: number;
    frameSize: number;
    rotate: number;
    privateKey: string;
};

const AddWaterMarkPage: React.FC = () => {
// 生成文件操作按钮
    const [form] = Form.useForm();
    const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
        content: 'pkc',
        fontColor: 'rgba(250, 0, 0, 0.9)',
        fontSize: 30,
        frameSize: 11,
        rotate: 0,
        privateKey: "",
    });
    const {content, fontColor, fontSize, frameSize, rotate, privateKey} = watermarkConfig;

    const [templateOptions, setTemplateOptions] = useState<TemplateType[]>([]);

    // useRequest(getTemplateData)
    useEffect(() => {
        // 这里监听templateOptions的变化
        console.log('templateOptions changed:', templateOptions);
        console.log('templateOptions type:', typeof templateOptions);
        console.log('templateOptions len:', templateOptions.length);
    }, [templateOptions]); // 当templateOptions变化时执行useEffect
    useEffect(() => {
        // Fetch template data from an API using axios POST request
        async function fetchData(uid: string) {
            try {
                console.log("Fetching data")
                let config: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                    params: {
                        id: uid, // 将用户的 uid 作为参数传递给请求
                    },
                }
                const response = await axios.get('/getTemplates', config);
                let templateData = response.data.data.data;
                console.log(templateData);
                const templateArray: TemplateType[] = [];
                for (let i = 0; i < templateData.length; i++) {
                    const currentTemplateData = templateData[i]; // 获取当前模板数据对象

                    const template: TemplateType = {
                        id: currentTemplateData.id,
                        name: currentTemplateData.name,
                        content: currentTemplateData.content,
                        fontColor: currentTemplateData.fontColor,
                        fontSize: currentTemplateData.fontSize,
                        frameSize: currentTemplateData.frameSize,
                        rotate: currentTemplateData.rotate,
                        privateKey: currentTemplateData.privateKey,
                        // 可能还有其他属性...
                    };
                    templateArray.push(template);
                    console.log(i, template)
                }
                console.log("templateArray", templateArray)
                setTemplateOptions(templateArray);
                console.log(templateOptions);
            } catch (error) {
                console.error('Error fetching template data:', error);
            }
        }

        let storedUserInfo: UserInfo | null = null;
        const storedUserInfoString = localStorage.getItem('userInfo');
        if (storedUserInfoString) {
            storedUserInfo = JSON.parse(storedUserInfoString); // 将字符串解析为 UserInfo 对象
            if (storedUserInfo) {
                fetchData(storedUserInfo.uid);
            }
        } else {
            console.error('No user info found in local storage');
        }
    }, []);

    const handleTemplateChange = (value: string) => {
        const selectedTemplate = templateOptions.find((template: TemplateType) => template.id === value);
        if (selectedTemplate) {
            form.setFieldsValue({
                content: selectedTemplate.content,
                fontColor: selectedTemplate.fontColor,
                fontSize: selectedTemplate.fontSize,
                frameSize: selectedTemplate.frameSize,
                rotate: String(selectedTemplate.rotate), // 转换为字符串类型
                privateKey: selectedTemplate.privateKey,
            });

            setWatermarkConfig({
                content: selectedTemplate.content,
                fontColor: selectedTemplate.fontColor,
                fontSize: selectedTemplate.fontSize,
                frameSize: selectedTemplate.frameSize,
                rotate: selectedTemplate.rotate,
                privateKey: selectedTemplate.privateKey,
            });
        }
    };



    const watermarkProps = useMemo(() => ({
        content: content,
        font: {
            color: typeof fontColor === 'string' ? fontColor : fontColor.toRgbString(),
            fontSize,
        },
        frameSize: frameSize,
        rotate: rotate,
        privateKey: privateKey,
    }), [watermarkConfig]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        let file = values.file;
        console.log("file", file);
        let storedUserInfo = localStorage.getItem('userInfo');
        console.log(storedUserInfo);
        await axios.post(
            "",
            values,
        ).then((res) => {
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
                    initialValues={watermarkConfig}
                    onValuesChange={(changedValues, allValues) => {
                        // 使用spread operator将改变的值合并到现有配置中
                        setWatermarkConfig(prevConfig => ({...prevConfig, ...changedValues}));
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete={"on"}
                >
                    <Form.Item name="template" label="Select Template">
                        <Select onChange={handleTemplateChange} placeholder="Select a template">
                            {templateOptions.length > 0 ? (
                                templateOptions.map((template) => (
                                    <Select.Option key={template.id} value={template.id}>
                                        {template.name}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option value={null} disabled>
                                    Loading...
                                </Select.Option>
                            )}
                        </Select>
                    </Form.Item>
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
                            required: true,
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
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
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
