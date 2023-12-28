import {Button, Card, message, Space, Table, Tag} from 'antd';
import type {PaginationProps} from 'antd';
import {Pagination} from 'antd';
import AddTodo from './components/AddTodo';
import TodoItem from './components/TodoItem';
import {useReactive, useRequest} from 'ahooks';
import {getTodoList} from '@/api/index_r';
import {ColumnsType} from "antd/es/table";
import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {AxiosRequestConfig} from "axios/index";
import {GlobalContext} from "@/contexts/Global";

type TodoItem = Model.TodoList;

const TodoList: React.FC = () => {
    // const {
    //   loading: getTodolistLoading,
    //   data: { list: todoList } = { list: [] },
    //   mutate: updateList
    // } = useRequest(getTodoList);

    interface DataType {
        id: string;
        timestamp: string;
        type: string;
        filename: string;
        filesize: string;
        url: string;
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const handleClick = (url: any) => {
        console.log("下载的url", url);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", ""); // Adds the attribute to download the file
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up: remove the temporary link element
    }
    const {userInfo} = useContext(GlobalContext);
    const columns: ColumnsType<DataType> = [
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
        },
        {
            title: '水印类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '文件名',
            dataIndex: 'filename',
            key: 'filename',
        },
        {
            title: '文件大小',
            key: 'filesize',
            dataIndex: 'filesize',

        },
        {
            title: '下载',
            dataIndex: 'url',
            key: 'url',
            render: (url: string) => (
                <Button onClick={() => handleClick(url)}>下载</Button>),

        },
    ];
    const userdata: DataType[] = [
        // {
        //   uid:userInfo.uid,
        //   timestamp: '',
        //   type: '',
        //   filename: '',
        //   filesize: '',
        //   url:'',
        // },

    ];
    const [user, setUser] = useState<DataType[]>(userdata)
    const [pagination, setPagination] = useState({current: 1, pageSize: 10});
//url是文件的url ,filename是文件名

    useEffect(() => {

        const upData = async () => {
            let opHistory: AxiosRequestConfig = {
                data: {
                    uid: userInfo.uid,
                    logType: "opHistory",
                }
            };
            console.log("获取操作历史记录请求", opHistory.data);

            return await axios.post(
                "http://localhost:30098/logs",
                opHistory.data,
                opHistory
            )
        }

        upData().then((res) => {
            console.log("获取操作历史记录返回值", res);
            if (res.data.statusCode == '200') {
                message.success("获取成功");
                let logsData = res.data.results;

                const dataTypeList: DataType[] = logsData.map((log: any) => {
                    let t1 = log.db_logsWmOperate;

                    const timestamp = new Date(t1.timestamp).toLocaleString(); // 格式化时间戳
                    const formattedFileSize = formatFileSize(t1.filesize); // 格式化文件大小
                    return {
                        id: t1.logId,
                        timestamp: timestamp,
                        type: t1.type,
                        filename: t1.filename,
                        filesize: formattedFileSize,
                        url: 'http://localhost:30098' + log.url.uri,

                    }

                });


                setUser(dataTypeList);
            } else {
                message.error("获取失败");
            }
        });
    }, [])

    const onChange: PaginationProps['onChange'] = (page: number, pageSize?: number) => {
        console.log('Page: ', page);
        setPagination({current: page, pageSize: pageSize || 10});
    };

    return (
        <Card title="操作历史记录">
            <Space direction="vertical" style={{width: '100%'}}>
                <Table columns={columns} dataSource={user} pagination={false} scroll={{x: 200, y: 500}}/>
                <br/>
            </Space>
            {/*<Pagination*/}
            {/*    showQuickJumper*/}
            {/*    //defaultCurrent={1}*/}
            {/*    //defaultPageSize={5}*/}
            {/*    current={pagination.current}*/}
            {/*    pageSize={pagination.pageSize}*/}
            {/*    total={user.length}*/}
            {/*    showSizeChanger={true}*/}
            {/*    //showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}*/}
            {/*    //total={50}*/}
            {/*    onChange={onChange}/>*/}
        </Card>
    );
};
export default TodoList;
