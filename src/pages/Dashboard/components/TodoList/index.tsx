import {Button,Card, message, Space, Table, Tag} from 'antd';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import AddTodo from './components/AddTodo';
import TodoItem from './components/TodoItem';
import {useReactive, useRequest} from 'ahooks';
import { getTodoList } from '@/api';
import {ColumnsType} from "antd/es/table";
import {Link} from "react-router-dom";
import React, {useContext,useEffect, useState} from "react";
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
    uid:string;
    timestamp: string;
    type: string;
    filename: string;
    filesize: string;
    url: string;
  }

  interface UserType{
    list:DataType
  }
  const handleClick=(url:any)=> {
    const link = document.createElement("a");
    link.href = url;
    link.click();
  }
  const { userInfo } = useContext(GlobalContext);
  const columns: ColumnsType<DataType> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      //render: (text) => <a>{text}</a>,
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
      dataIndex: 'downloadlink',
      key: 'downloadlink',
      render: (url: DataType) => (
          <Button onClick={() => handleClick(url)}>下载</Button>),

    },

  ];
  const userdata: DataType[] = [
    {
      uid:userInfo.uid,
      timestamp: '',
      type: '',
      filename: '',
      filesize: '',
      url:'',
    },

  ];
  const [user,setUser]=useState(userdata)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
//url是文件的url ,filename是文件名

  useEffect(() => {
    const upData = async () => {
      let loginHistory: AxiosRequestConfig = {
        data: {
          uid: userInfo.uid,
          logType: 'loginHistory',
        }
      };
      return await axios.post(
          "https://4024f85r48.picp.vip/logs",
          loginHistory.data,
          loginHistory
      )
    }

    upData().then((res) => {
      console.log("获取登录历史", res);
      if (res.data.statusCode == '200') {
        message.success("获取成功");
      } else if(res.data.statusCode == '400'){
        message.error("获取失败");
      }else {
        setUser([
            {
          uid: res.data.uid,
          timestamp: res.data.timestamp,
          type: res.data.type,
          filename: res.data.filename,
          filesize: res.data.filesize,
          url :res.data.url,
        }
        ]);
      }
    });
  }, [])
  // async function postDate(user: any){
  //   console.log("原始表单信息：");
  //   console.log(user);
  //   let logsconfig = {
  //     data: {
  //       uid: user.uid,
  //     },
  //   }
  //   console.log("发送请求信息");
  //   console.log(logsconfig.data)
  //   await axios.post(
  //       "https://4024f85r48.picp.vip/logs",
  //       logsconfig.data,
  //       logsconfig
  //   ).then(response => {
  //     console.log(response);
  //     let res=response
  //     if (response.data.statusCode == '200') {
  //       message.success("获取成功");
  //     } else if(response.data.statusCode == '400'){
  //       message.error("获取失败");
  //     }else {
  //       setUser({
  //         ...user,
  //         timestamp:res.data.timestamp ,
  //         type: res.data.type,
  //         filename: res.data.filename,
  //         filesize: res.data.filesize,
  //         downlink:res.data.downlinkink,
  //       })
  //     }
  //   });

  const onChange: PaginationProps['onChange'] = (page: number, pageSize?: number) => {
    console.log('Page: ', page);
    setPagination({ current: page, pageSize: pageSize || 10 });
  };

  return (
      <Card  title="操作历史记录">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Table columns={columns} dataSource={user} pagination={false} scroll={{ x: 200, y: 500 }}/>
          <br/>
        </Space>
        <Pagination
            showQuickJumper
            //defaultCurrent={1}
            //defaultPageSize={5}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={user.length}
            showSizeChanger={true}
            //showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            //total={50}
            onChange={onChange} />
      </Card>
  );
};

export default TodoList;
