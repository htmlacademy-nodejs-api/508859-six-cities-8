import request from 'axios';
import {toast} from 'react-toastify';
import {ErrorType, ValidationErrorField} from '../types/error';
import { HttpCode } from '../const';

export const errorHandle = (error: ErrorType): void => {
  if (!request.isAxiosError(error)) {
    throw error;
  }
  const {response} = error;

  if (response) {
    switch (response.status) {
      case HttpCode.BAD_REQUEST:
        (response.data.details)
          ? response.data.details
            .forEach(
              (message: string) => toast.info(message),
              (detail: ValidationErrorField) =>
                detail.messages
                  .forEach(
                    (message: string) => toast.info(message),
                  ),
            )
          : toast.info(response.data.message);
        break;
      case HttpCode.UNAUTHORIZED:
        toast.info(response.data.message);
        break;
      case HttpCode.NOT_FOUND:
        toast.info(response.data.message);
        break;
      case HttpCode.CONFLICT:
        toast.info(response.data.message);
        break;
    }
  };
}