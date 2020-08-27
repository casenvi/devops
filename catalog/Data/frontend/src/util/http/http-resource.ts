import { AxiosInstance, AxiosResponse, AxiosRequestConfig, CancelTokenSource } from 'axios';
import axios from 'axios';
import { serialize as objectToFormData } from 'object-to-formdata';

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

  create<T = any>(data:any): Promise<AxiosResponse<T>> {
    let sendData = this.makeSendData(data);
    return this.http.post<T>(this.resource, sendData);
  }

  update<T = any>(id:string, data:any, options?:{http?:{usePost: boolean}, config?: AxiosRequestConfig}): Promise<AxiosResponse<T>> {
    let sendData = data
    if (this.containsFile(data)){
      sendData = this.getFormData(data);
    }    
    const{http, config} = (options ||{}) as any;
    return !options || !http || !http.usePost ?
      this.http.put<T>(`${this.resource}/${id}`, sendData, config):
      this.http.post<T>(`${this.resource}/${id}`, sendData, config)
  }

  partialUpdate<T = any>(id:string, data:any, options?:{http?:{usePost: boolean}, config?: AxiosRequestConfig}): Promise<AxiosResponse<T>> {
    let sendData = data
    if (this.containsFile(data)){
      sendData = this.getFormData(data);
    }    
    const{http, config} = (options ||{}) as any;
    return !options || !http || !http.usePost ?
      this.http.patch<T>(`${this.resource}/${id}`, sendData, config):
      this.http.post<T>(`${this.resource}/${id}`, sendData, config)
  }

  delete<T = any>(id:string) {
    return this.http.delete<T>(`${this.resource}/${id}`);
  }

  deleteCollection<T = any>(queryParams): Promise<AxiosResponse<T>> {
    const config:AxiosRequestConfig = {};
    if(queryParams){
      config['params'] = queryParams;
    }
    return this.http.delete<T>(`${this.resource}`, config);
  }

  isCancelRequest(error:any) {
    return axios.isCancel(error);
  }

  private makeSendData(data) {
    return this.containsFile(data)? this.getFormData(data): data;
  }
  private getFormData(data) {
    return objectToFormData(data, {booleansAsIntegers: true});
    
  }
  private containsFile(data) {
    return Object.values(data).filter(el => el instanceof File).length !== 0
  }
}