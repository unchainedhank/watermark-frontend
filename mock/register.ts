import Mock, { Random } from 'mockjs';
import { encode as base64Encode } from 'js-base64';

// 看起来像是 JWT 格式就行了
function createToken(data: { uid: number | any }) {
    const header = JSON.stringify({ type: 'JWT', alg: 'HS256' });

    const now = Number((new Date().getTime() / 1000).toFixed(0));
    const payload = JSON.stringify({
        iss: 'github.com/xstnet',
        sub: 'react-admin',
        iat: now,
        exp: now + 86400 * 14,
        data: data
    });

    const secret = 'H_97UyQUOmURnZdDwI0khuAt4Cmg';
    const token = `${base64Encode(header)}.${base64Encode(payload)}.${secret}`;
    return token;
}
// Mock.setup({
//   timeout: '000-5000' // 延迟时间为 1-5 秒
// });

class UserInfo {
    Uid: string;
    Email: string;
    phone: string;
    username:string
    department: string;
    password: string;

    constructor() {
        this.Uid = '123';
        this.username = 'unchained';
        this.phone = '123123123';
        this.Email = '123@qq.com';
        this.department = 'security';
        this.password = '123Qwe..';
    }
}

Mock.mock(/api\/register/, 'post', ({ body }) => {
    const { Uid,username,phone,Email,department,password  } = JSON.parse(body);
    const userInfo = new UserInfo();

    // if (username === 'admin') {
    //
    //     if (password !== '123456') {
    //         return {
    //             code: -1,
    //             message: '密码错误'
    //         };
    //     }
    //     return {
    //         code: 0,
    //         message: '登录成功',
    //         data: {
    //             token: createToken({ uid: 1 }),
    //             userInfo: userInfo,
    //         }
    //     };
    // }

    return {
        code: 0,
        message: '注册成功',
        data: {
            token: createToken({ uid: Random.natural(2, 10000) }),
            userInfo: userInfo,
        }
    };
});
