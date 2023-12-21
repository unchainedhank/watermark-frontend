import {Card, Space, Table, Tag} from 'antd';
import AddTodo from './components/AddTodo';
import TodoItem from './components/TodoItem';
import { useRequest } from 'ahooks';
import { getTodoList } from '@/api';
import {ColumnsType} from "antd/es/table";
import {Link} from "react-router-dom";
import React from "react";

type TodoItem = Model.TodoList;

const TodoList: React.FC = () => {
  const {
    loading: getTodolistLoading,
    data: { list: todoList } = { list: [] },
    mutate: updateList
  } = useRequest(getTodoList);

  interface DataType {
    time: string;
    watermark: string;
    filename: string;
    size: string;
    download: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      //render: (text) => <a>{text}</a>,
    },
    {
      title: '水印',
      dataIndex: 'watermark',
      key: 'watermark',
    },
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: '文件大小',
      key: 'size',
      dataIndex: 'size',

      },
    {
        title: '下载',
        dataIndex: 'download',
        key: 'download',
        render: () =><Link to="baidu.com"><a href="#">下载</a></Link>,

    },

  ];
  const data: DataType[] = [
    {
      time: '19:00',
      watermark: '明水印',
      filename: '12.pdf',
      size: '1kb',
      download:''
    },

  ];


  return (
    <Card loading={getTodolistLoading} title="操作历史记录">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Table columns={columns} dataSource={data} />;
      </Space>
    </Card>
  );
};

export default TodoList;
