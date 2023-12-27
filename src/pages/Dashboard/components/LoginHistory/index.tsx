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

    const {userInfo} = useContext(GlobalContext);
    console.log(userInfo)
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

    // 使用相同数据构造数组, 此时没有有效的key
    // const data: Model.LoginHistory[] = Array(5).fill({
    //     id: randomNumber(10, 100000),
    //     userId: 1,
    //     loginIp: '127.0.0.1',
    //     nickname: 'admin',
    //     create_time: dayjs().subtract(3, 'second').format(DayjsFormatEnum.second)
    // });

    useEffect(() => {
        const fetchLoginData = async () => {
            let loginHistory: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                    logType: 'loginHistory',
                }
            };
            return await axios.get(
                "https://4024f85r48.picp.vip/logs",
                loginHistory.data,
            )
        }

        fetchLoginData().then((res) => {
            console.log("获取登录历史", res);
            if (res.data.statusCode === '200') {
                setLoginHistoryData(res.data.logs);
            }
        });
    }, [])

    return (
        <Card title="登录历史" extra={<Link to="/">查看更多</Link>}>
            <Table
                rowKey={() => randomNumber(10, 100000)}
                pagination={false}
                size="small"
                columns={columns}
                dataSource={loginHistoryData}
            />
        </Card>
    );
};

export default LoginHistory;
