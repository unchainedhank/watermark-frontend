import {randomNumber} from '@/utils/util';
import {Card} from 'antd';
import dayjs from 'dayjs';
import {useContext, useEffect, useState} from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import axios, {AxiosRequestConfig} from "axios";
import {GlobalContext} from "@/contexts/Global";

interface useStaticMap {
    [key: string]: number;
}

const VisitLineChart: React.FC = () => {
    const [activeTab, setActiveTab] = useState('counts');
    const tabList = [
        {tab: '近一周水印使用情况', key: 'counts'},
        // { tab: 'IP', key: 'ip' }
    ];
    const chartColor = {
        counts: {stroke: '#8884d8', fill: '#b5b1e6'},
        // ip: { stroke: '#00b96b', fill: '#82ca9d' }
    };

    const {userInfo} = useContext(GlobalContext);
    const [useData, setUseData] = useState<any[]>();
    useEffect(() => {
        const fetchUseData = async () => {
            let useConfig: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                }
            };
            return await axios.get(
                "https://4024f85r48.picp.vip/watermark/count",
                useConfig.data
            );
        }

        fetchUseData().then((res) => {
            console.log("获取水印使用统计数据", res);
            if (res.data.statusCode === '200') {
                const temp = Object.entries(res.data.dateCounts)
                    .map(([name, counts]) => ({
                    name:name,
                    counts:counts,
                })).reverse();
                console.log(temp);
                setUseData(temp)
            }
        });
    }, [userInfo.uid])


    return (
        <Card activeTabKey={activeTab} onTabChange={(key) => setActiveTab(key)} tabList={tabList}>
            <ResponsiveContainer width={'100%'} height={300}>
                <AreaChart data={useData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip wrapperStyle={{outline: 'none'}}
                             // label="日期" // 设置 X 轴的提示文本为“日期”
                             labelStyle={{ fontWeight: 'bold' }}
                             formatter={(value, name, props) => {
                                 return [`添加水印总数：${value}`]; // 自定义 Tooltip 显示的内容，“数量”为中文提示
                             }}/>
                    <Area
                        type="monotone"
                        strokeWidth={2}
                        dataKey={activeTab}
                        stroke={chartColor[activeTab as 'counts'].stroke}
                        fill={chartColor[activeTab as 'counts'].fill}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default VisitLineChart;
