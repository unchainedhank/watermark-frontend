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
    const [activeTab, setActiveTab] = useState('pv');
    const tabList = [
        {tab: '近一周水印使用情况', key: 'pv'},
        // { tab: 'IP', key: 'ip' }
    ];
    const chartColor = {
        pv: {stroke: '#8884d8', fill: '#b5b1e6'},
        // ip: { stroke: '#00b96b', fill: '#82ca9d' }
    };
    // const visitData = Array.from({ length: 7 })
    //   .map((_, i) => ({
    //     name: dayjs()
    //       .subtract(i + 1, 'day')
    //       .format('MM-DD'),
    //     pv: randomNumber(1000, 10000),
    //     // ip: randomNumber(100, 1000)
    //   }))
    //   .reverse();
    const {userInfo} = useContext(GlobalContext);
    const [useData, setUseData] = useState<any[]>();
    //setUseData([{Date:'12.29',Integer:'6'}])
    // interface DataType {
    //     Date:string,
    //     Integer:number,
    // }
    // const userdata: DataType[] = [
    //     {
    //         Date:'12.24',
    //         Integer:5,
    //     },
    //     {
    //         Date:'12.25',
    //         Integer:8,
    //     },
    //     {
    //         Date:'12.26',
    //         Integer:10,
    //     },
    //
    // ];
    //const [useData, setUseData] = useState(userdata);
    useEffect(() => {
        const fetchUseData = async () => {
            let useConfig: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                }
            };
            return await axios.post(
                "https://4024f85r48.picp.vip/watermark/count",
                useConfig.data, useConfig
            );
        }

        fetchUseData().then((res) => {
            console.log("获取水印使用统计数据", res);
            if (res.data.statusCode === '200') {
                const temp = Object.entries(res.data.dateCounts).map(([Date,Integer]) => ({
                    //name,
                    Date,
                    Integer,
                }));
                console.log(temp);
                setUseData(temp)
            }
        });
    }, [userInfo.uid])


    return (
        <Card activeTabKey={activeTab} onTabChange={(key) => setActiveTab(key)} tabList={tabList}>
            <ResponsiveContainer width={'100%'} height={300}>
                <AreaChart
                    data={useData}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="Date"/>
                    <YAxis type="number" domain={['auto', 'auto']}/>
                    <Tooltip wrapperStyle={{outline: 'none'}}/>
                    <Area
                        type="monotone"
                        strokeWidth={2}
                        //dataKey={activeTab}
                        dataKey={"Integer"}
                        // stroke={chartColor[activeTab as 'pv'].stroke}
                        // fill={chartColor[activeTab as 'pv'].fill}
                    />

                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default VisitLineChart;
