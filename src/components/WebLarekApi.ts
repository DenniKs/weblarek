import { IApi, IOrderRequest, IOrderResponse, IProductsResponse } from '../types';

export class WebLarekApi {
	constructor(private readonly api: IApi) {}

	getProducts() {
		return this.api.get<IProductsResponse>('/product/');
	}

	createOrder(order: IOrderRequest) {
		return this.api.post<IOrderResponse>('/order/', order);
	}
}
