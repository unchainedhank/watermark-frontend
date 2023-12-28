import {
    Button,
    Flex,
    Form,
    Image,
    message,
    Spin,
    Upload
} from 'antd';
import React, {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import axios, {AxiosRequestConfig} from "axios";

const ExtractWaterMarkPage: React.FC = () => {

    const [loading, setLoading] = useState(false);


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
            setLoading(true);
            await axios.post(
                "http://localhost:30098/watermark/extract",
                config.data,
                config
            ).then((res) => {
                if (res.data) {
                    setImageSrc(res.data.uri);
                } else {
                    setLoading(false);
                    message.error("提取水印失败");
                }
            });
        } catch (error) {
            message.error("提取水印失败");
        } finally {
            setLoading(false);
        }


    };

    const handleCustomUpload = async (options: any) => {
        const {file, onSuccess, onError} = options;

        try {
            console.log('文件已选择:', file);
            form.setFieldValue("file", file);
            onSuccess("ok");
            message.success("上传成功");
        } catch (error) {
            console.error('上传失败:', error);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("提交错误");
    };

    return (

        <div>
            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Spin size="large" style={{fontSize: '50px'}}/>
                    <span style={{fontSize: '20px', marginTop: '10px', color: '#079c5c'}}>提取水印中，请稍等...</span>
                </div>
            )}
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
                            <Upload multiple={false} accept={".pdf,.doc,.jpg,.jpeg,.png"} maxCount={1}
                                    customRequest={handleCustomUpload}>
                                <Button style={{width: '120%'}} icon={<UploadOutlined/>}>点击上传</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: '40%'}}>
                                提取暗水印
                            </Button>
                        </Form.Item>
                    </Flex>


                </Form>
                <Flex vertical={true} justify={"center"}>
                    <Image width={350} height={350} src={imageSrc}></Image>
                    <span style={{fontSize: '20px', marginTop: '10px', color: '#079c5c',marginLeft:'33%'}}>水印提取结果</span>
                </Flex>
            </div>
        </div>
    );
};

export default ExtractWaterMarkPage;
