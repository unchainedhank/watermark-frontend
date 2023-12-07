namespace Model {
    interface CommonFields {
        create_time: S;
        update_time?: S;
        delete_time?: S;
    }

    interface User extends CommonFields {
        id: N;
        userName: S;
        fullName: string;
        avatar: S;
        department: string;
        create_time?: S;
        password?: S;
        email?: S;
        phoneNumber?: string;
        fingerPrint: string;
    }

    interface Article extends CommonFields {
        id: N;
        title: S;
        description: S;
        author: S;
        cover: S;
        category_id: N;
        content: S;
        sort_value: N;
        status: N;
        source: S;
        tags: S[];
        comment_control: N;
    }

    interface LoginHistory extends CommonFields {
        id: N;
        userId: User['id'];
        loginIp: S;
        nickname: User['nickname'];
    }

    interface TodoList extends CommonFields {
        id: N;
        name: S;
        status: TodoItemEnum;
    }
}
