import { Http } from '@/utils/http';

export const postLogin = (data: Api.PostLogin['params']) => {
  return Http.post<Api.PostLogin>('https://4024f85r48.picp.vip/user/login', data);
  // return Http.post<Api.PostLogin>('/login', data);
};

export const getUserInfo = (params?: Api.GetUserInfo['params']) => {
  return Http.get<Api.GetUserInfo>('/user/info', params);
};
export const postRegister =(data: KV | undefined) =>{
  return Http.post('/register',data);
}
export const postLogout = () => {
  return Http.post<any>('/user/logout');
};
export const getArticleList = (params?: Api.getArticleList['params'], formData?: KV) => {
  return Http.get<Api.getArticleList>('/article/list', { ...params, ...formData });
};

export const postDeleteArticle = (params: Api.postDeleteArticle['params']) => {
  return Http.post<Api.postDeleteArticle>('/article/delete', params);
};

export const getTodoList = (params?: Api.getTodoList['params']) => {
  return Http.get<Api.getTodoList>('/todo/list', params);
};

export const postChangeTodoStatus = (data: Api.postChangeTodoStatus['params']) => {
  return Http.post<Api.postChangeTodoStatus>('/todo/changeStatus', data);
};

export const postDeleteTodo = (params: Api.postDeleteTodo['params']) => {
  return Http.post<Api.postDeleteTodo>('/todo/delete', params);
};

export const postUpdateTodo = (data: Api.postUpdateTodo['params']) => {
  return Http.post<Api.postUpdateTodo>('/todo/update', data);
};

export const postAddTodo = (data: Api.postAddTodo['params']) => {
  return Http.post<Api.postAddTodo>('/todo/create', data);
};


