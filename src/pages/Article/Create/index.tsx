import {
    Button,
    ColorPicker,
    Flex,
    Form,
    Input,
    message,
    Modal,
    Radio,
    RadioChangeEvent,
    Select,
    Spin,
    Typography,
    Upload,
    Watermark
} from 'antd';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import type {Color} from 'antd/es/color-picker';
import {DeleteOutlined, UploadOutlined} from '@ant-design/icons';
import axios, {AxiosRequestConfig} from "axios";
import {userInfo} from "os";
import UserInfo = Api.UserInfo;
import {GlobalContext} from "@/contexts/Global";

const apiUrl = 'wm_container:3000';

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
    id: number;
    name: string;
    content: string;
    fontColor: string | Color;
    fontSize: number;
    frameSize: number;
    rotate: number;
};

const AddWaterMarkPage: React.FC = () => {
    const [watermarkConfigVisible, setWatermarkConfigVisible] = useState('visible'); // 控制显示隐藏
    const [form] = Form.useForm();
    const [nameForm] = Form.useForm();
    const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
        content: 'pkc',
        fontColor: 'rgba(250, 0, 0, 0.9)',
        fontSize: 30,
        frameSize: 11,
        rotate: 0,
        privateKey: "",
        watermarkType: 'visible',
    });
    const {content, fontColor, fontSize, frameSize, rotate, privateKey, watermarkType} = watermarkConfig;
    const [templateOptions, setTemplateOptions] = useState<TemplateType[]>([]);
    const {userInfo, setUserInfo} = useContext(GlobalContext);

    const convertToRGBA = (rgbString: string, alpha: number) => {
        const rgbValues = rgbString
            .substring(1, rgbString.length - 1) // 去除括号
            .split(',') // 分割 RGB 字符串为数组
            .map((val) => parseInt(val, 10)); // 将字符串转为数字

        const [r, g, b] = rgbValues; // 获取 R、G、B 值
        alpha = alpha / 100;
        return `rgba(${r},${g},${b},${alpha})`; // 构建 RGBA 格式字符串
    };

    async function getTemplateData() {
        console.log("获取模板数据")
        let templateConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                uid: userInfo.uid, // 将用户的 uid 作为参数传递给请求
            },
        }

        await axios.post(
            apiUrl + '/watermark/template/query',
            templateConfig.data,
            templateConfig).then(res => {
            console.log(res);
            if (res.data.statusCode == 200) {
                let templateData = res.data.queryresult;
                const templateArray: TemplateType[] = [];
                for (let i = 0; i < templateData.length; i++) {
                    const currentTemplateData = templateData[i]; // 获取当前模板数据对象

                    let fontColorRgb = convertToRGBA(currentTemplateData.fontColor, currentTemplateData.alpha);
                    const template: TemplateType = {
                        id: currentTemplateData.templateId,
                        name: currentTemplateData.name,
                        content: currentTemplateData.content,
                        fontSize: currentTemplateData.fontSize,
                        frameSize: currentTemplateData.frameSize,
                        rotate: currentTemplateData.angle,
                        fontColor: fontColorRgb,
                    };
                    templateArray.push(template);
                    console.log(i, template)
                }
                setTemplateOptions(templateArray);
            }
        });


    }

    useEffect(() => {
        console.log("获取模板 userInfo", userInfo);
        getTemplateData();
    }, [])

    const handleTemplateChange = (value: number) => {
        const selectedTemplate = templateOptions.find((template: TemplateType) => template.id === value);
        console.log("选中的模板");
        console.log(selectedTemplate);
        if (selectedTemplate) {
            form.setFieldsValue({
                content: selectedTemplate.content,
                fontColor: selectedTemplate.fontColor,
                fontSize: selectedTemplate.fontSize,
                frameSize: selectedTemplate.frameSize,
                rotate: String(selectedTemplate.rotate), // 转换为字符串类型
            });

            setWatermarkConfig({
                content: selectedTemplate.content,
                fontColor: selectedTemplate.fontColor,
                fontSize: selectedTemplate.fontSize,
                frameSize: selectedTemplate.frameSize,
                rotate: selectedTemplate.rotate,
                privateKey: '',
                watermarkType: 'visible',
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
    function extractRgba(colorObj:any): string {
        const { r, g, b, a } = colorObj.metaColor;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    function extractRgbAndAlpha(rgbaString: string): { rgb: string, a: number } {
        const regex = /rgba\((\d+), (\d+), (\d+), (\d*\.?\d+)\)/;
        const match = rgbaString.match(regex);

        if (match) {
            const [_, r, g, b, a] = match;
            const rgb = `rgb(${r}, ${g}, ${b})`;
            return { rgb, a: parseFloat(a) };
        }

        throw new Error("Invalid RGBA string");
    }

    const onFinish = async (values: any) => {

        if (!values.file) {
            message.error("请先上传文件");
        }
        // if (values.fontSize <= 0 || values.fontSize == undefined || values.fontSize.length == 0) {
        //     message.error("水印字体大小必须大于0");
        // }

        try {

            setLoading(true);
            if (watermarkTypeSelect == 'invisible') {
                console.log("暗水印");
                let darkConfig: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: {
                        uid: userInfo.uid,
                        targetFingerprint: [values.privateKey],
                        file: values.file.file.originFileObj,
                    }
                };
                // formData.append('file', values.file.fileList[0]);
                console.log(darkConfig.data);
                await axios.post(
                    apiUrl + "/watermark/embed/invisible",
                    darkConfig.data,
                    darkConfig
                ).then((response) => {
                    console.log(response.data)
                    if (response.data) {
                        const base64String = response.data.base64String; // 接收到的 base64 字符串
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
                });

            } else if (watermarkTypeSelect == 'visible') {
                console.log("明水印");
                console.log(values.fontColor);
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
                    let r = values.fontColor.metaColor.r.toFixed(1);
                    let g = values.fontColor.metaColor.g.toFixed(1);
                    let b = values.fontColor.metaColor.b.toFixed(1);
                    let a = values.fontColor.metaColor.a ? values.fontColor.metaColor.a.toFixed(1) : 1.0;
                    rgb = `(${r},${g},${b})`;
                    alpha = a;
                }
                let lightConfig: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: {
                        uid: userInfo.uid,
                        file: values.file.file.originFileObj,
                        targetFingerprint: 'self',
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
                await axios.post(
                    apiUrl + "/watermark/embed/visible",
                    lightConfig.data,
                    lightConfig
                ).then(response => {
                    console.log("水印返回")
                    console.log(response.data);
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
                        } else if (values.file.file.type == 'image/jpg') {
                            blob = new Blob([arrayBuffer], {type: 'image/jpg'});
                        }else if (values.file.file.type == 'image/jpeg') {
                            blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
                        }
                        // 将 ArrayBuffer 转换为 Blob
                        // 创建一个 URL 对象，指向该 Blob 对象
                        const url = window.URL.createObjectURL(blob);

                        // 创建一个链接并模拟点击下载
                        const link = document.createElement('a');

                        link.href = url;
                        link.download = response.data.fileName // 设置文件名
                        document.body.appendChild(link);
                        link.click();

                        message.success("添加水印成功，正在下载");
                        // 清理创建的 URL 对象
                        window.URL.revokeObjectURL(url);
                    } else {
                        message.error("添加水印失败");
                    }
                    //  结束loading
                });

            } else {
                console.log("双重水印");
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
                    let r = values.fontColor.metaColor.r.toFixed(1);
                    let g = values.fontColor.metaColor.g.toFixed(1);
                    let b = values.fontColor.metaColor.b.toFixed(1);
                    let a = values.fontColor.metaColor.a ? values.fontColor.metaColor.a.toFixed(1) : 1.0;
                    rgb = `(${r},${g},${b})`;
                    alpha = a;
                }

                let bothConfig: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: {
                        uid: userInfo.uid,
                        file: values.file.file.originFileObj,
                        targetFingerprint: [values.privateKey],
                        content: values.content,
                        fontSize: values.fontSize,
                        fontColor: rgb,
                        frameSize: values.frameSize,
                        alpha: alpha * 100,
                        angle: values.rotate,
                    }
                };
                console.log("bothConfig req");
                console.log(bothConfig.data);
                console.log("bothConfig req");
                //插入loading
                await axios.post(
                    apiUrl + "/watermark/embed/both",
                    bothConfig.data,
                    bothConfig
                ).then(response => {
                    console.log(response);
                    if (response.data.fileName) {
                        console.log(response.data);
                        const base64String = response.data.base64String; // 接收到的 base64 字符串
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
                        } else if (values.file.file.type == 'image/jpeg') {
                            blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
                        } else if (values.file.file.type == 'image/jpg') {
                            blob = new Blob([arrayBuffer], {type: 'image/jpg'});
                        }


                        // 将 ArrayBuffer 转换为 Blob
                        // 创建一个 URL 对象，指向该 Blob 对象
                        const url = window.URL.createObjectURL(blob);

                        // 创建一个链接并模拟点击下载
                        const link = document.createElement('a');

                        link.href = url;
                        link.download = response.data.fileName; // 设置文件名
                        document.body.appendChild(link);
                        link.click();

                        message.success("添加水印成功，正在下载");
                        // 清理创建的 URL 对象
                        window.URL.revokeObjectURL(url);
                    } else {
                        message.error("添加水印失败");
                    }
                    //  结束loading
                });


            }
        } catch (e) {
            console.log(e);
            message.error("水印添加失败");
        } finally {
            setLoading(false);
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("水印请求提交错误，请检查表单");
    };

    const [watermarkTypeSelect, setWatermarkTypeSelect] = useState('visible');
    const onTypeChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setWatermarkTypeSelect(e.target.value);
        setWatermarkConfigVisible(e.target.value); // 根据值来控制是否显示除了文件选项之外的表单项
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleSaveTemplate = () => {
        setIsModalVisible(true);
    };

    function hsvToRgb(h: number, s: number, v: number, alpha = 1) {
        let r, g, b;
        const c = v * s;
        const hp = h / 60;
        const x = c * (1 - Math.abs((hp % 2) - 1));
        const m = v - c;

        if (hp >= 0 && hp < 1) {
            [r, g, b] = [c, x, 0];
        } else if (hp >= 1 && hp < 2) {
            [r, g, b] = [x, c, 0];
        } else if (hp >= 2 && hp < 3) {
            [r, g, b] = [0, c, x];
        } else if (hp >= 3 && hp < 4) {
            [r, g, b] = [0, x, c];
        } else if (hp >= 4 && hp < 5) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return `rgba(${Math.floor((r + m) * 255)}, ${Math.floor((g + m) * 255)}, ${Math.floor((b + m) * 255)}, ${alpha})`;
    }

    const handleConfirmSave = async () => {
        // 在这里执行保存模板的操作
        try {
            const values = await form.validateFields(); // 获取表单填写的所有字段值
            const templateName = nameForm.getFieldValue('templateName');
            console.log("表单内容", values);
            console.log("当前颜色：", values.fontColor);
            let rgb: string = "(255,255,255)";
            let alpha: number = 1.0;
            let rgbaValue: string = "";

            if (typeof values.fontColor != 'string') {
                let metaColor = values.fontColor.metaColor;
                rgbaValue = hsvToRgb(metaColor.originalInput.h, metaColor.originalInput.s, metaColor.originalInput.v, metaColor.roundA);
            } else {
                rgbaValue = values.fontColor;
            }
            console.log("rgbaValue", rgbaValue);
            const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
            const matches = rgbaValue.match(regex);
            if (matches) {
                const [, r, g, b, a] = matches;
                rgb = `(${r},${g},${b})`;
                alpha = a ? parseFloat(a) : 1.0;
            }


            let newTemplateConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    // @ts-ignore
                    uid: userInfo.uid,
                    name: templateName,
                    targetFingerprint: ['self'],
                    content: String(values.content),
                    fontSize: String(values.fontSize),
                    fontColor: rgb,
                    frameSize: String(values.frameSize),
                    alpha: String(alpha * 100),
                    angle: String(values.rotate),
                }
            };
            console.log("请求数据");
            console.log(newTemplateConfig.data);

            await axios.post(
                apiUrl + '/watermark/template/insert',
                newTemplateConfig.data,
                newTemplateConfig
            ).then(res => {
                console.log("返回数据");
                console.log(res);
                if (res.data.statusCode == "200") {
                    message.success("模版添加成功");
                    // @ts-ignore
                    getTemplateData();
                } else {
                    message.error("模版添加错误");
                }
            });

            // 处理请求成功后的逻辑
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
            form.setFieldValue("file", file);
            onSuccess("ok");
            console.log(file)
            message.success("文件上传成功");
            // 在这里可以将文件数据添加到表单中（示例中未添加，您需要根据需要修改）
            // 模拟成功上传，并调用 onSuccess 方法通知 Ant Design 上传成功
        } catch (error) {
            message.error("文件上传失败");
            onError(error);
        }
    };

    const beforeUpload = (file: any) => {
        const maxSize = 50 * 1024 * 1024; // 5MB, 可以根据需求修改限制的文件大小
        if (file.size > maxSize) {
            message.error('文件大小超过限制（最大限制为5MB）');
            return false; // 返回 false 可以阻止文件上传
        }
        return true; // 允许文件上传
    };


    const deleteOption = async (uid: string | undefined, templateId: number) => {
        try {
            let deleteConfig: AxiosRequestConfig = {
                headers: {
                    'contentType': 'application/json',
                },
                data: {
                    uid: uid,
                    templateId: templateId,
                }
            };
            console.log("删除的请求", deleteConfig.data);
            await axios.post(
                apiUrl + "/watermark/template/delete",
                deleteConfig.data,
                deleteConfig
            ).then(res => {
                console.log(res);
                if (res.data.statusCode === "200") {
                    message.success("模板删除成功");
                } else {
                    message.error("模板删除失败");
                }
                // @ts-ignore
                getTemplateData();
            });
        } catch (error) {
            message.error("模板删除失败");
        }
    };

    const [colorRgb, setColorRgb] = useState<Color | string>('rgb(22, 119, 255,0.5)');


    return (

        <div style={{position: 'relative'}}>
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
                    <span style={{fontSize: '20px', marginTop: '10px', color: '#079c5c'}}>添加水印中，请稍等...</span>

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
                    onValuesChange={(changedValues) => {
                        // 使用spread operator将改变的值合并到现有配置中
                        setWatermarkConfig(prevConfig => ({...prevConfig, ...changedValues}));
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete={"on"}
                >
                    <Form.Item name={"file"} label={"文件"}>
                        <Upload multiple={false} accept={".pdf,.doc,.jpg,.jpeg,.png,.svg"} maxCount={1}
                                customRequest={handleCustomUpload} beforeUpload={beforeUpload}>
                            <Button icon={<UploadOutlined/>}>点击上传</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name={"watermarkType"} label={"水印类型"}>
                        <Radio.Group onChange={onTypeChange} value={watermarkTypeSelect}>
                            <Radio value={'visible'}>明水印</Radio>
                            <Radio value={'invisible'}>暗水印</Radio>
                            <Radio value={'both'}>双重水印</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {(watermarkConfigVisible == 'visible' || watermarkConfigVisible == 'both') && (
                        <>
                            <Form.Item name="template" label="选择模板">
                                <Select onChange={handleTemplateChange} placeholder="选择模板"
                                >
                                    {templateOptions.length > 0 ? (
                                        templateOptions.map((template) => (
                                            <Select.Option key={template.id} value={template.id}>
                                                <span>{template.name}</span>
                                                <span style={{float: "right"}}>
                                                <DeleteOutlined
                                                    onClick={() => {
                                                        // @ts-ignore
                                                        deleteOption(localStorage.getItem('uid'), template.id);
                                                    }}
                                                />
                                              </span>
                                            </Select.Option>
                                        ))
                                    ) : (
                                        <Select.Option value={null} disabled>
                                            加载中
                                        </Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item name="content" label="自定义水印内容">
                                <Input placeholder="pkc" showCount maxLength={20}/>
                            </Form.Item>
                            <Form.Item name="fontColor" label="字体颜色">
                                <ColorPicker
                                    value={colorRgb} // 受控属性 value
                                    onChange={setColorRgb}
                                    trigger={"hover"}  format={"rgb"} showText={true}/>
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
                                        {value: '210', label: '210°'},
                                        {value: '240', label: '240°'},
                                        {value: '270', label: '270°'},
                                        {value: '300', label: '300°'},
                                        {value: '330', label: '330°'},
                                        {value: '360', label: '360°'},
                                    ]}
                                />
                            </Form.Item>
                        </>
                    )}

                    {(watermarkConfigVisible == 'invisible' || watermarkConfigVisible == 'both') && (
                        <>
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
                        </>
                    )}


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
                            <Form form={nameForm}>
                                <Form.Item
                                    name="templateName"
                                    label="模板名称"
                                    rules={[
                                        {
                                            required: true,
                                            message: '模板名称不能为空',
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入模板名称"/>
                                </Form.Item>
                            </Form>
                            <p>确定要保存为新的模板吗？</p>
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
