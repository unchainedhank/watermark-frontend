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
    ResponsiveContainer, Legend
} from 'recharts';
import axios, {AxiosRequestConfig} from "axios";
import {GlobalContext} from "@/contexts/Global";
const apiUrl = 'wm_container:3000';

interface useStaticMap {
    [key: string]: number;
}

const VisitLineChart: React.FC = () => {
    const [activeTab, setActiveTab] = useState('counts');
    const tabList = [
        {tab: '添加水印总数', key: 'counts'},
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
                headers: {
                    'Content-Type': 'application/json', // 显式设置请求头部为 JSON
                },
                data: {
                    uid: userInfo.uid,
                }
            };
            return await axios.post(
                apiUrl+"/watermark/count",
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
                    <defs>
                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        strokeWidth={2}
                        dataKey={activeTab}
                        stroke={chartColor[activeTab as 'counts'].stroke}
                        fill={chartColor[activeTab as 'counts'].fill}

                        fillOpacity={0.5} // 设置填充透明度
                        animationDuration={1000} // 添加动画效果
                        isAnimationActive={true}
                        connectNulls // 连接 null 数据点
                        dot={{ stroke: 'black', strokeWidth: 2 }} // 设置数据点的样式
                        activeDot={{ r: 6 }} // 设置激活状态下数据点的样式

                    />
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="4" dy="4" stdDeviation="2" floodColor="#8884d8" floodOpacity="0.5" />
                        </filter>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default VisitLineChart;
