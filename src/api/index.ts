// apiService.ts

import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'https://api.example.com'; // 替换为你的API基本URL

interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

class ApiService {
    private apiService: AxiosInstance;

    constructor() {
        this.apiService = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                // 其他自定义的请求头信息
            },
        });
    }

    public async fetchData<T>(endpoint: string, params = {}): Promise<T> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.apiService.get(endpoint, { params });
            return response.data.data;
        } catch (error) {
            // 处理错误，例如打印错误信息、显示通知等
            console.error('请求出错:', error);
            throw error;
        }
    }

    public async postData<T>(endpoint: string, data = {}): Promise<T> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.apiService.post(endpoint, data);
            return response.data.data;
        } catch (error) {
            // 处理错误，例如打印错误信息、显示通知等
            console.error('请求出错:', error);
            throw error;
        }
    }

    // 可以根据需要添加其他请求方法，比如putData、deleteData等
}

const apiService = new ApiService();
export default apiService;
