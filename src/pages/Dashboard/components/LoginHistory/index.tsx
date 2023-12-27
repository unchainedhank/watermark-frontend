import RelativeTime from '@/components/RelativeTime';
import {DayjsFormatEnum} from '@/constants/enum';
import {randomNumber} from '@/utils/util';
import {Card} from 'antd';
import Table, {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/contexts/Global";
import axios, {AxiosRequestConfig} from "axios";

const LoginHistory: React.FC<{}> = () => {

    const {userInfo,setUserInfo} = useContext(GlobalContext);
    const [loginHistoryData, setLoginHistoryData] = useState();
    const columns: ColumnsType<Model.LoginHistory> = [
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: '登录IP',
            dataIndex: 'loginIp',
            key: 'loginIp'
        },
        {
            title: '登录时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (create_time) => {
                return <RelativeTime time={create_time}/>;
            }
        }
    ];


    useEffect(() => {
        const fetchLoginData = async () => {
            let loginHistory: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                    logType: 'loginHistory',
                }
            };
            // console.log("登录历史的info", userInfo);
            // console.log("登录历史的请求数据",loginHistory.data)
            return await axios.post(
                "https://4024f85r48.picp.vip/logs",
                loginHistory.data,loginHistory
            )
        }

        fetchLoginData().then((res) => {
            // console.log("获取登录历史", res);
            if (res.data.statusCode === '200') {
                const adaptedData = res.data.logs.map((log:any) => ({
                    nickname: log.userName,
                    loginIp: log.ip,
                    create_time: log.time,
                    key: log.logId.toString(), // 添加一个 key，以便 React 可以唯一识别每个项目
                })).reverse();
                setLoginHistoryData(adaptedData);
            }
        });
    }, [])

    return (
        <Card title="登录历史">
        {/*<Card title="登录历史" extra={<Link to="/">查看更多</Link>}>*/}
            <Table
                // rowKey={() => randomNumber(10, 100000)}
                pagination={false}
                size="small"
                columns={columns}
                dataSource={loginHistoryData}
                scroll={{ y: 165 }} // 设置固定高度为300像素，超出部分将出现垂直滚动条
                // pagination={{ pageSize: 10 }} // 设置分页，每页显示10条数据（可根据需求调整）
            />
        </Card>
    );
};

export default LoginHistory;
