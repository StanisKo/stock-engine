export class ServiceResponse {
    success: boolean;

    message: string;
}

export class DataServiceResponse<T> extends ServiceResponse {
    data: T;
}
