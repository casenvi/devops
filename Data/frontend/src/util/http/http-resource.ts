import { AxiosInstance, AxiosResponse, AxiosRequestConfig, CancelTokenSource } from 'axios';
import axios from 'axios';

export default class HttpResource {

  private cancelList: CancelTokenSource | null = null;

  constructor(protected http: AxiosInstance, protected resource: any) {

  }

  list<T = any>(options?: { queryParams?:any}): Promise<AxiosResponse<T>> {
    if (this.cancelList) {
      this.cancelList?.cancel('list cancelled');
    }
    this.cancelList = axios.CancelToken.source();
    const config: AxiosRequestConfig = {
      cancelToken: this.cancelList.token
    };
    if (options && options.queryParams) {
      config.params = options.queryParams
    }

    return this.http.get<T>(this.resource, config);
  }

  get<T = any>(id:string) {
    return this.http.get<T>(`${this.resource}/${id}`);
  }

  create<T = any>(data:any) {
    return this.http.post<T>(this.resource, data);
  }

  update<T = any>(id:string, data:any) {
    return this.http.put<T>(`${this.resource}/${id}`, data);
  }

  delete<T = any>(id:string) {
    return this.http.delete<T>(`${this.resource}/${id}`);
  }

  isCancelRequest(error:any) {
    return axios.isCancel(error);
  }
}
