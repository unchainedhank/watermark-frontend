import Mock, {Random} from 'mockjs';

Mock.setup({
    timeout: 100
});
Mock.mock(/api\/article\/detail/, 'get', (options) => {
    console.log('🚀 ~ file: article.ts:7 ~ Mock.mock ~ options:', options);
    const data = {
        code: 0,
        message: 'ok',
        data: {
            id: 1,
            title: '主题',
            description: '醉丶春风',
            author: '醉丶春风',
            tags: [1, 2],
            content: {
                markdown_content: '# 内容标题\r\n 正文'
            },
            sort_value: 100,
            comment_control: 3,
            // cover: 'https://www.xstnet.com/static/images/head.gif',
            create_time: Random.datetime()
        }
    };

    return data;
});

Mock.mock(/api\/article\/list/, 'get', (options) => {
    const queryParams = new URLSearchParams(options.url);

    let pageSize = Number(queryParams.has('pageSize') ? queryParams.get('pageSize') : 10);
    const data = {
        code: 0,
        message: 'ok',
        data: {
            total: 100,
            [`list|${pageSize}`]: [
                {
                    'id|+1': pageSize,
                    author: '@first@last',
                    title: () => Mock.Random.ctitle(5, 20),
                    description: '@cname',
                    cover: () => Random.dataImage('480x270', '封面'),
                    content: '@email',
                    create_time: '@date(yyyy-MM-dd HH:MM:ss)'
                }
            ]
        }
    };

    return Mock.mock(data);
});

Mock.mock(/api\/article\/create/, 'post', (options) => {
    const data = {
        code: 0,
        message: '创建成功',
        data: {
            id: Random.natural(100, 9999)
        }
    };

    return data;
});

const { Random } = Mock;

const randomNumber = Random.integer(1, 5); // 随机长度为1到5



const mockWaterConfigData = Mock.mock({
    [`data|${randomNumber}`]: [
        {
            "id": '@string("number", 10)',
            "name": "@cname",
            "content": "pkc",
            "fontColor": "rgba(199,60,60,0.9)",
            "fontSize": 30,
            "frameSize": 11,
            "rotate": 0,
            "privateKey": "1231231233"
        }
    ],
});

Mock.mock(/api\/getTemplates/, 'get', (options) => {
  const data = {
      code: 0,
      message: 'ok',
      data: mockWaterConfigData,
  }
    return Mock.mock(data);
  // if (options.)
  // return Mock.mock(data)
})