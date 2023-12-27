import {ArrowUpOutlined} from '@ant-design/icons';
import {Card, Col, Row, Statistic} from 'antd';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import LoginHistory from './components/LoginHistory';
import TodoList from './components/TodoList';
import VisitLineChart from './components/VisitLineChart';
import {useContext, useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {GlobalContext} from "@/contexts/Global";






const DashboardPage: React.FC = () => {
    const {userInfo } = useContext(GlobalContext);
    const [ratio, setRatio] = useState([
        { name: '明水印', value: 15 },
        { name: '暗水印', value: 21 },
    ]);
    useEffect(() => {
        const fetchRatioData = async () => {
            let ratioConfig: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                }
            };
            return await axios.post(
                "https://4024f85r48.picp.vip/watermark/ratio",
                ratioConfig.data, ratioConfig
            );
        }

        fetchRatioData().then((res)=>{
            console.log("获取水印使用占比数据",res);
            if (res.data.statusCode === '200') {
                let clearMarkTimes = res.data.clearMark;
                let darkMarkTimes = res.data.darkMark;
                setRatio(prevState => [
                    { name: '明水印', value: clearMarkTimes },
                    { name: '暗水印', value: darkMarkTimes },
                ])
            }
        });
    }, [userInfo.uid])
    return (
        <>
            <div>
                {/*<Row gutter={24}>*/}
                {/*    <Col span={6}>*/}
                {/*        <Card bordered={false}>*/}
                {/*            <Statistic title="今日销售额" value={126560} precision={2} prefix="$"/>*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*    <Col span={6}>*/}
                {/*        <Card bordered={false}>*/}
                {/*            <Statistic*/}
                {/*                title="示例指标"*/}
                {/*                value={11.28}*/}
                {/*                precision={2}*/}
                {/*                prefix={<ArrowUpOutlined/>}*/}
                {/*                suffix="%"*/}
                {/*            />*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*    <Col span={6}>*/}
                {/*        <Card bordered={false}>*/}
                {/*            <Statistic*/}
                {/*                title="示例指标"*/}
                {/*                value={11.28}*/}
                {/*                precision={2}*/}
                {/*                prefix={<ArrowUpOutlined/>}*/}
                {/*                suffix="%"*/}
                {/*            />*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*    <Col span={6}>*/}
                {/*        <Card bordered={false}>*/}
                {/*            <Statistic*/}
                {/*                title="示例指标"*/}
                {/*                value={11.28}*/}
                {/*                precision={2}*/}
                {/*                valueStyle={{color: '#3f8600'}}*/}
                {/*                prefix={<ArrowUpOutlined/>}*/}
                {/*                suffix="%"*/}
                {/*            />*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <br/>
                <Row gutter={16}>
                    <Col span={18} style={{height: 300}}>
                        <VisitLineChart/>
                    </Col>
                    <Col span={6}>
                        <Card title="水印使用占比">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={ratio}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        label
                                    >
                                        {ratio.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip wrapperStyle={{outline: 'none'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row gutter={16}>
                    <Col span={12}>
                        <TodoList/>
                    </Col>
                    <Col span={12}>
                        <LoginHistory/>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default DashboardPage;
