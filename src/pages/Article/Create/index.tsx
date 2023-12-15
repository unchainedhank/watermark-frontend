import {
    Button,
    ColorPicker, Flex,
    Form,
    Input, InputNumber, message, Modal,
    Radio,
    RadioChangeEvent,
    Select, Spin,
    Switch,
    Typography,
    Upload,
    Watermark
} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import type {Color} from 'antd/es/color-picker';
import {UploadOutlined} from '@ant-design/icons';
import axios, {AxiosRequestConfig} from "axios";
import {userInfo} from "os";
import UserInfo = Api.UserInfo;
import {AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders} from "axios/index";

const {Paragraph} = Typography;

interface WatermarkConfig {
    watermarkType: string;
    content: string;
    fontColor: string | Color;
    fontSize: number;
    frameSize: number;
    rotate: number;
    privateKey: string;
}


type TemplateType = {
    id: string;
    name: string;
    content: string;
    fontColor: string;
    fontSize: number;
    frameSize: number;
    rotate: number;
    privateKey: string;
    watermarkType: string;

};

const AddWaterMarkPage: React.FC = () => {
    const [watermarkConfigVisible, setWatermarkConfigVisible] = useState(true); // 控制显示隐藏
    const [form] = Form.useForm();
    const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
        content: 'pkc',
        fontColor: 'rgba(250, 0, 0, 0.9)',
        fontSize: 30,
        frameSize: 11,
        rotate: 0,
        privateKey: "",
        watermarkType: 'both',
    });
    const {content, fontColor, fontSize, frameSize, rotate, privateKey, watermarkType} = watermarkConfig;

    const [templateOptions, setTemplateOptions] = useState<TemplateType[]>([]);

    useEffect(() => {
        // Fetch template data from an API using axios POST request
        async function fetchData(uid: string) {
            try {
                console.log("Fetching data")
                let config: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: 'Bearer ' + localStorage.getItem('token'),
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
                        watermarkType: currentTemplateData.watermarkType,
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
        console.log(storedUserInfoString)
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
                watermarkType: selectedTemplate.watermarkType,
            });

            setWatermarkConfig({
                content: selectedTemplate.content,
                fontColor: selectedTemplate.fontColor,
                fontSize: selectedTemplate.fontSize,
                frameSize: selectedTemplate.frameSize,
                rotate: selectedTemplate.rotate,
                privateKey: selectedTemplate.privateKey,
                watermarkType: selectedTemplate.watermarkType,

            });
        }
    };
    const rotateChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const [actualFontSize, setActualFontSize] = useState<number | null>(fontSize !== null ? fontSize : 1);
    const watermarkProps = useMemo(() => ({
        content: content,
        font: {
            color: typeof fontColor === 'string' ? fontColor : fontColor.toRgbString(),
            fontSize: actualFontSize !== null ? actualFontSize : 1,
        },
        frameSize: frameSize,
        rotate: rotate,
        privateKey: privateKey,
        watermarkType: watermarkType,
    }), [content, fontColor, actualFontSize, frameSize, rotate, privateKey, watermarkType]);

// 监听 fontSize 的变化
    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = e.target.value;
        if (newSize === '') {
            setActualFontSize(1); // 设置默认字体大小
        } else {
            const parsedSize = parseInt(newSize, 10);
            if (!isNaN(parsedSize)) {
                setActualFontSize(parsedSize);
            }
        }
    };

    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {

        if (!values.file) {
            message.error("请先上传文件");
        }

        if (watermarkTypeSelect == 'invisible') {
            console.log("暗水印");
            let darkConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: {
                    targetFingerprint: "111",
                    file: values.file.file.originFileObj,
                }
            };
            // formData.append('file', values.file.fileList[0]);
            console.log(darkConfig.data);
            setLoading(true);
            await axios.post(
                "https://4024f85r48.picp.vip/watermark/embed/invisible",
                darkConfig.data,
                darkConfig
            ).then((response) => {
                console.log(response.data)
                if (response.data) {
                    const base64String = response.data; // 接收到的 base64 字符串
                    // 将 base64 字符串解码为 ArrayBuffer
                    const binaryString = window.atob(base64String);
                    const binaryLen = binaryString.length;
                    const bytes = new Uint8Array(binaryLen);
                    for (let i = 0; i < binaryLen; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const arrayBuffer = bytes.buffer;

                    // 将 ArrayBuffer 转换为 Blob
                    const blob = new Blob([arrayBuffer], {type: 'application/pdf'});

                    // 创建一个 URL 对象，指向该 Blob 对象
                    const url = window.URL.createObjectURL(blob);

                    // 创建一个链接并模拟点击下载
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = response.data.fileName; // 设置文件名
                    document.body.appendChild(link);
                    link.click();
                    message.success("水印添加成功，开始下载");

                    // 清理创建的 URL 对象
                    window.URL.revokeObjectURL(url);
                } else {
                    message.error("水印添加失败");
                }
                setLoading(false);

            });

        }
        else if (watermarkTypeSelect == 'visible') {
            console.log("明水印");
            console.log(values);
            let rgb: string = "(255,255,255)";
            let alpha: number = 1.0;

            if (typeof values.fontColor === 'string') {
                const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
                const matches = values.fontColor.match(regex);
                if (matches) {
                    const [, r, g, b, a] = matches;
                    rgb = `(${r},${g},${b})`;
                    alpha = a ? parseFloat(a) : 1.0;
                }
            } else {
                rgb = values.fontColor.fontColor;
                alpha = values.fontColor.alpha;
            }
            let lightConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: {
                    file: values.file.file.originFileObj,
                    targetFingerprint: ['self'],
                    content: values.content,
                    fontSize: values.fontSize,
                    fontColor: rgb,
                    frameSize: values.frameSize,
                    alpha: alpha * 100,
                    angle: values.rotate,
                    key: values.key,
                }
            };
            console.log(lightConfig.data);
            //插入loading
            setLoading(true);
            await axios.post(
                "https://4024f85r48.picp.vip/watermark/embed/visible",
                lightConfig.data,
                lightConfig
            ).then(response => {
                if (response.data.fileName) {
                    console.log(response.data);
                    const base64String = response.data.base64String; // 接收到的 base64 字符串
                    console.log(base64String);
                    // 将 base64 字符串解码为 ArrayBuffer
                    const binaryString = window.atob(base64String);
                    const binaryLen = binaryString.length;
                    const bytes = new Uint8Array(binaryLen);
                    for (let i = 0; i < binaryLen; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const arrayBuffer = bytes.buffer;
                    let blob: any;
                    if (values.file.file.type === 'application/pdf') {
                        blob = new Blob([arrayBuffer], {type: 'application/pdf'});
                    } else if (values.file.file.type == 'image/png') {
                        blob = new Blob([arrayBuffer], {type: 'image/png'});
                    }
                    // 将 ArrayBuffer 转换为 Blob
                    // 创建一个 URL 对象，指向该 Blob 对象
                    const url = window.URL.createObjectURL(blob);

                    // 创建一个链接并模拟点击下载
                    const link = document.createElement('a');

                    link.href = url;
                    link.download = '数字符号.pdf'; // 设置文件名
                    document.body.appendChild(link);
                    link.click();

                    message.success("添加水印成功，正在下载");
                    // 清理创建的 URL 对象
                    window.URL.revokeObjectURL(url);
                } else {
                    message.error("添加水印失败");
                }
            //  结束loading
                setLoading(false);
            });

        }
        // else {
        //     let bothConfig: AxiosRequestConfig = {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: 'Bearer ' + localStorage.getItem('token'),
        //         },
        //         params: {
        //             targetFingerprint: ['self'],
        //         },
        //         data: values.file.originFileObj
        //     };
        //     await axios.post(
        //         "/watermark/embed/both",
        //         darkConfig,
        //     ).then((res) => {
        //         // data: T;
        //         // status: number;
        //         // statusText: string;
        //         // headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
        //         if (res.data.statusCode === 200) {
        //             try {
        //                 // 创建一个 Blob 对象，包含从服务器返回的文件数据
        //                 const blob = new Blob([res.data.file], {
        //                     type: res.headers['content-type'],
        //                 });
        //                 // 创建一个 URL 对象，指向该 Blob 对象
        //                 const downloadUrl = window.URL.createObjectURL(blob);
        //                 // 创建一个链接并模拟点击下载
        //                 const link = document.createElement('a');
        //                 link.href = downloadUrl;
        //                 link.download = '下载的文件名'; // 可以根据需要设置文件名
        //                 document.body.appendChild(link);
        //                 link.click();
        //                 // 清理创建的 URL 对象
        //                 window.URL.revokeObjectURL(downloadUrl);
        //             } catch (error) {
        //                 console.error('Error:', error);
        //             }
        //         } else {
        //             //    提示失败
        //         }
        //         console.log(res);
        //     })
        // }


    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const [watermarkTypeSelect, setWatermarkTypeSelect] = useState('');
    const onTypeChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setWatermarkTypeSelect(e.target.value);
        setWatermarkConfigVisible(e.target.value !== 'invisible'); // 根据值来控制是否显示除了文件选项之外的表单项
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleSaveTemplate = () => {
        setIsModalVisible(true);
    };
    const handleConfirmSave = async () => {
        // 在这里执行保存模板的操作
        try {
            const values = await form.validateFields(); // 获取表单填写的所有字段值
            console.log("表单内容", values);
            const newTemplateData = {
                // 根据实际情况构建新模板的数据
                // 例如：id、name、content、fontColor、fontSize、frameSize、rotate、privateKey 等
                // 使用 values 对象中对应的字段来填充
            };

            // 发送 POST 请求保存新模板数据
            const response = await axios.post('/saveTemplate', newTemplateData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            // 处理请求成功后的逻辑
            if (response.status === 200) {
                // 模板保存成功，可以添加一些提示或者其他操作
                console.log('Template saved successfully!');
            } else {
                // 请求成功但是模板保存失败，可以添加错误提示或者其他操作
                console.log('Failed to save template!');
            }
        } catch (error) {
            // 处理异常情况
            console.error('Error saving template:', error);
        }
        // 关闭对话框
        setIsModalVisible(false);
    };

    const handleCancelSave = () => {
        // 关闭对话框
        setIsModalVisible(false);
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

    return (

        <div  style={{ position: 'relative' }}>
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
                    <Spin size="large" style={{fontSize: '50px'}} />
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
                    initialValues={watermarkConfig}
                    onValuesChange={(changedValues, allValues) => {
                        // 使用spread operator将改变的值合并到现有配置中
                        setWatermarkConfig(prevConfig => ({...prevConfig, ...changedValues}));
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete={"on"}
                >
                    <Form.Item name={"file"} label={"文件"}>
                        <Upload multiple={false} accept={".pdf,.doc,.jpg,.jpeg,.png,.svg"} maxCount={1}
                                customRequest={handleCustomUpload}>
                            <Button icon={<UploadOutlined/>}>点击上传</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="template" label="选择模板">
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
                    <Form.Item name={"watermarkType"} label={"水印类型"}>
                        <Radio.Group onChange={onTypeChange} value={watermarkTypeSelect}>
                            <Radio value={'visible'}>明水印</Radio>
                            <Radio value={'invisible'}>暗水印</Radio>
                            <Radio value={'both'}>双重水印</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {watermarkConfigVisible && (
                        <>
                            <Form.Item name="content" label="自定义水印内容">
                                <Input placeholder="pkc" showCount maxLength={20}/>
                            </Form.Item>
                            <Form.Item name="fontColor" label="字体颜色">
                                <ColorPicker trigger={"hover"} defaultFormat={"rgb"} format={"rgb"} showText={true}/>
                            </Form.Item>
                            <Form.Item name="fontSize" label="字体大小"
                                       rules={[
                                           {
                                               required: true,
                                               message: "请输入字体大小",
                                           },
                                           // {
                                           //     type: "number",
                                           //     min: 0,
                                           //     message: '字体大小必须大于0',
                                           // }
                                       ]}>
                                <Input value={actualFontSize !== null ? actualFontSize.toString() : ''}
                                       onChange={handleFontSizeChange}/>
                            </Form.Item>
                            <Form.Item name="frameSize" label="水印框大小" rules={[
                                {
                                    required: true,
                                    message: "请输入水印框大小",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: '水印框大小必须大于0',
                                }
                            ]}>
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
                        </>
                    )}

                    <Form.Item name="privateKey" label="密钥" rules={[
                        {
                            required: true,
                            message: "请输入密钥",
                        },
                        {
                            pattern: /^\d{10}$/,
                            message: '密钥必须为10位数字',
                        },
                    ]}>
                        <Input placeholder="10位数字" showCount maxLength={10}/>
                    </Form.Item>
                    <Flex gap={"large"}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{flex: 1}}>
                                提交
                            </Button>
                        </Form.Item>
                        <Modal
                            title="保存模板确认"
                            visible={isModalVisible}
                            onOk={handleConfirmSave}
                            onCancel={handleCancelSave}
                        >
                            <p>确定要保存为新的模板吗</p>
                        </Modal>

                        <Button type="primary" onClick={handleSaveTemplate} style={{marginLeft: "auto"}}>
                            保存为新的模板
                        </Button>
                    </Flex>

                </Form>


                {/* Watermark and Image */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>

                    <Watermark {...watermarkProps}>
                        <Typography>
                            <Paragraph>
                                水印效果预览：
                            </Paragraph>
                            <Paragraph>
                                The light-speed iteration of the digital world makes products more complex. However,
                                human consciousness and attention resources are limited. Facing this design
                                contradiction, the pursuit of natural interaction will be the consistent direction of
                                Ant Design.
                            </Paragraph>
                            <Paragraph>
                                Natural user cognition: According to cognitive psychology, about 80% of external
                                information is obtained through visual channels. The most important visual elements in
                                the interface design, including layout, colors, illustrations, icons, etc., should fully
                                absorb the laws of nature, thereby reducing the user&apos;s cognitive cost and bringing
                                authentic and smooth feelings. In some scenarios, opportunely adding other sensory
                                channels such as hearing, touch can create a richer and more natural product experience.
                            </Paragraph>
                            <Paragraph>
                                Natural user behavior: In the interaction with the system, the designer should fully
                                understand the relationship between users, system roles, and task objectives, and also
                                contextually organize system functions and services. At the same time, a series of
                                methods such as behavior analysis, artificial intelligence and sensors could be applied
                                to assist users to make effective decisions and reduce extra operations of users, to
                                save users&apos; mental and physical resources and make human-computer interaction more
                                natural.
                            </Paragraph>
                        </Typography>
                        <img
                            style={{
                                zIndex: 10,
                                width: 'auto',
                                display: 'block',
                                maxWidth: '40%',
                                margin: '0 auto',
                                position: 'relative',
                            }}
                            src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
                            alt="示例图片"
                        />
                    </Watermark>
                </div>


            </div>
        </div>
    );
};

export default AddWaterMarkPage;
