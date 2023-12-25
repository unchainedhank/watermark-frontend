namespace Api {
  interface Base {
    params: KV;
    response: KV;
  }

  type ResponseData<T = Base> = {
    code: number;
    message: string;
    data: T extends Base ? T['response'] : T;
  };

  // 分页参数
  interface PaginateParams {
    current?: number;
    pageSize?: number;
  }

  interface PaginateResponse<T> {
    total: number;
    list: T extends Base ? T['response'][] : T[];
  }

  interface UserInfo {
    uid: string;
    username: string;
    phone: string;
    email: string;
    department: string;
    role: string;
  }

  // -----------------------------------------------------------------------------------------------



  interface PostLogin extends Base {
    params: Required<Pick<Model.User, 'userName' | 'password'>>;
    response: {
      user: UserInfo;
      token: string;
      statusCode:string;
      statusContent:string;
    };
  }

  interface GetUserInfo extends Base {
    response: Model.User & {
      roles: (string | number)[];
    };
  }


  interface postCreateUser extends Base {
    params: Omit<Model.User, 'id'>;
    response: {
      id: number;
    };
  }

  interface postUpdateUser extends Base {
    params: Partial<Model.User> & Pick<Model.User, 'id'>;
  }


  interface getArticleList extends Base {
    params: PaginateParams & KV;
    response: PaginateResponse<Model.Article>;
  }

  interface postDeleteArticle extends Base {
    params: { id: number };
    response: any;
  }

  interface getTodoList extends Base {
    params: PaginateParams;
    response: PaginateResponse<Model.TodoList>;
  }
  interface postChangeTodoStatus extends Base {
    params: Pick<Model.TodoList, 'id' | 'status'>;
  }
  interface postDeleteTodo extends Base {
    params: Pick<Model.TodoList, 'id'>;
  }
  interface postUpdateTodo extends Base {
    params: Pick<Model.TodoList, 'id' | 'status' | 'name'>;
  }
  interface postAddTodo extends Base {
    params: Pick<Model.TodoList, 'name'>;
    response: Model.TodoList;
  }


}
