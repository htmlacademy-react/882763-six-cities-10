import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {BACKEND_URL, REQUEST_TIMEOUT} from '../const';
import {getToken} from './token';
import {StatusCodes} from 'http-status-codes';

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = getToken();

      if (token) {
        config.headers['x-token'] = token;
      }

      return config;
    },
  );

  api.interceptors.request.use(
    (response) => response,
    (error) => {
      if (error.response && shouldDisplayError(error.response)) {
        throw error;
      }

      throw error;
    }
  );

  return api;
};
