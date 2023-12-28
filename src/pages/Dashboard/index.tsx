import {ArrowUpOutlined} from '@ant-design/icons';
import {Card, Col, Row, Statistic} from 'antd';
import {Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import LoginHistory from './components/LoginHistory';
import TodoList from './components/TodoList';
import VisitLineChart from './components/VisitLineChart';
import {useContext, useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {GlobalContext} from "@/contexts/Global";
import UserInfo = Api.UserInfo;






const DashboardPage: React.FC = () => {
    const {userInfo,setUserInfo } = useContext(GlobalContext);
    const [ratio, setRatio] = useState([
        { name: '明水印', value: 15 },
        { name: '暗水印', value: 21 },
    ]);
    useEffect(() => {
        // console.log("刷新", userInfo);
        // if (userInfo && Object.keys(userInfo).length === 0) {
        //
        //     let tempUid = localStorage.getItem('uid');
        //     let tempPswd = localStorage.getItem('password');
        //     let loginConfig: AxiosRequestConfig = {
        //         data: {
        //             uid: tempUid,
        //             password: tempPswd,
        //         }
        //     };
        //     axios.post(
        //         'http://localhost:30098/user/login',
        //         loginConfig.data,
        //         loginConfig
        //     ).then((res) => {
        //         console.log("登录返回值", res);
        //         if (res.data.statusCode === '200') {
        //             let info = res.data.user;
        //             let temp: UserInfo = {
        //                 uid: info.uid,
        //                 username: info.username,
        //                 phone: info.phone,
        //                 email: info.email,
        //                 department: info.department,
        //                 role: info.userRole,
        //             }
        //             setUserInfo(temp);
        //         }
        //     });
        // }




        const fetchRatioData = async () => {
            let ratioConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json', // 显式设置请求头部为 JSON
                },
                data: {
                    uid: userInfo.uid,
                }
            };
            return await axios.post(
                "http://localhost:30098/watermark/ratio",
                ratioConfig.data
            );
        }

        fetchRatioData().then((res)=>{
            // console.log("获取水印使用占比数据",res);
            if (res.data.statusCode === '200') {
                let clearMarkTimes = res.data.clearMark;
                let darkMarkTimes = res.data.darkMark;
                // console.log(clearMarkTimes);
                // console.log(darkMarkTimes);
                if (clearMarkTimes == undefined || darkMarkTimes == undefined) {
                    clearMarkTimes = 0;
                    darkMarkTimes = 0;
                }
                setRatio(prevState => [
                    { name: '明水印', value: clearMarkTimes },
                    { name: '暗水印', value: darkMarkTimes },
                ]);
                // console.log(ratio);
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
                                        innerRadius={40}
                                        outerRadius={80}
                                        label
                                        animationBegin={1}

                                    >
                                        {ratio.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip wrapperStyle={{outline: 'none'}}/>
                                    <Legend/>
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
