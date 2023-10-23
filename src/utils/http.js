import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建一个独立的axios实例
const http = axios.create({
    // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
    baseURL: '/',
    // 定义统一的请求头部
    headers: {
        "Content-Type": "application/json;charset=UTF-8"
    },
    // 配置请求超时时间
    timeout: 10000,
    // 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
    withCredentials: true
});
// 请求拦截
http.interceptors.request.use(config => {
    // 自定义header，可添加项目token
    config.headers.token = 'token';
    return config;
});
// 返回拦截
http.interceptors.response.use((response) => {
    // 获取接口返回结果
    const res = response.data;
    // code为0，直接把结果返回回去，这样前端代码就不用在获取一次data.
    if (res.code == 200) {
        //调用message 发送通知
        if (res.message !== "success") {
            ElMessage.success({
                message: res.message,
                customClass: 'api-message',
                duration: 8000,
            });
        }
        return res;
    } else if (res.code >= 500) {
        ElMessage.error({
            message: res.message,
            customClass: 'api-message',
            duration: 0,
            showClose: true,
        });
    }
});
export default http;
