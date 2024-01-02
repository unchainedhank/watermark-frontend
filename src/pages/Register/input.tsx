import React from 'react';
import { Input } from 'antd';
import './Custom.css'; // 引入全局样式文件

const CustomPasswordInput = () => {
    return <Input.Password className="custom-password-input" placeholder="请设置密码" />;
};

export default CustomPasswordInput;
