import {Form, Input, Select, Typography, TreeSelect, Flex, ColorPicker} from 'antd';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {InputNumber, Slider, Watermark} from 'antd';
import type {Color} from 'antd/es/color-picker';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';
import {InboxOutlined} from '@ant-design/icons';

const {Paragraph} = Typography;

interface WatermarkConfig {
    content: string;
    fontColor: string | Color;
    fontSize: number;
    frameSize: number;
    rotate: number;
    privateKey: string;
}

interface FileItem {
    uid: string;
    name: string;
    status: 'uploading' | 'done' | 'error';
    file: File
}

const rotateChange = (value: string) => {
    console.log(`selected ${value}`);
};

const {Dragger} = Upload;
const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
        const {status} = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const AddWaterMarkPage: React.FC = () => {
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const handleUpload = (fileItem: FileItem) => {
        const formData = new FormData();
        formData.append('file', fileItem.file);

        // 发送文件到服务器
        // 此处使用示例地址，你需要替换成你自己的上传地址和处理逻辑
        fetch('https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                // 上传成功
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // 处理成功后更新对应文件的状态为完成
                setFileList(prevList =>
                    prevList.map(item => (item.uid === fileItem.uid ? {...item, status: 'done'} : item))
                );
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                // 处理失败后更新对应文件的状态为错误
                setFileList(prevList =>
                    prevList.map(item => (item.uid === fileItem.uid ? {...item, status: 'error'} : item))
                );
            });
    };

    // 文件上传状态改变时触发
    const handleChange = (info: any) => {
        // 仅在上传状态改变时处理
        if (info.file.status === 'uploading') {
            // 在队列中添加一个上传中的文件
            setFileList(prevList => [
                ...prevList,
                {
                    uid: info.file.uid,
                    name: info.file.name,
                    status: 'uploading',
                    file: info.file,
                },
            ]);
            // 处理文件上传
            handleUpload(info.file.originFileObj);
        }
    };

    // 生成文件操作按钮
    const renderActions = (status: FileItem['status']) => {
        switch (status) {
            case 'uploading':
                return '处理中';
            case 'done':
                return (
                    <a href={`文件下载链接`} download>
                        下载
                    </a>
                );
            case 'error':
                return '处理失败';
            default:
                return null;
        }
    };
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

    const watermarkProps = useMemo(
        () => ({
            content: content,
            font: {
                color: typeof fontColor === 'string' ? fontColor : fontColor.toRgbString(),
                fontSize,
            },
            frameSize: frameSize,
            rotate: rotate,
            privateKey: privateKey,
        }),
        [config],
    );

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
                    <Form.Item name="privateKey" label="密钥">
                        <Input placeholder="10位数字" showCount maxLength={10}/>
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
                <div>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">点击或拖拽来上传</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or
                            other
                            banned files.
                        </p>
                    </Dragger>
                </div>
                {/* 文件队列 */}
                <div>
                    {fileList.map(file => (
                        <div key={file.uid}>
                            <span>{file.name}</span>
                            <span>{renderActions(file.status)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddWaterMarkPage;
