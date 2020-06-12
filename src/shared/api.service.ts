import { ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators';

const BASE_PATH="https://msc-tellco-user-management-api.herokuapp.com";
const ENDPOINT = 'api';
import axios from 'axios';

class ApiService {

    public signIn(data: any): Promise<{}> {
        return axios.post(BASE_PATH + '/' + ENDPOINT + '/auth/signin', data);
    }

    public signUp(data: any): Promise<{}> {
        return axios.post(BASE_PATH + '/' + ENDPOINT + '/auth/signup', data);
    }

    public getLoggedUser():  Promise<{}> {
        return axios.get(BASE_PATH + '/' + ENDPOINT + '/loggedUser', { headers: { 'x-access-token' : ''} });
    }
}

export const apiService = new ApiService();
