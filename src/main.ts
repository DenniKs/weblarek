import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { CatalogModel } from './components/models/CatalogModel';
import { IOrderRequest } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

catalogModel.setItems(apiProducts.items);
console.log('Каталог: все товары', catalogModel.getItems());

const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

if (firstProduct) {
	console.log('Каталог: товар по id', catalogModel.getItemById(firstProduct.id));
	catalogModel.setPreviewItem(firstProduct);
	console.log('Каталог: товар для предпросмотра', catalogModel.getPreviewItem());
}

if (firstProduct && secondProduct) {
	basketModel.addItem(firstProduct);
	basketModel.addItem(secondProduct);
	basketModel.addItem(secondProduct);

	console.log('Корзина: товары', basketModel.getItems());
	console.log('Корзина: количество', basketModel.getCount());
	console.log('Корзина: итоговая сумма', basketModel.getTotalPrice());
	console.log('Корзина: есть первый товар', basketModel.hasItem(firstProduct.id));

	basketModel.removeItem(firstProduct);
	console.log('Корзина: после удаления первого товара', basketModel.getItems());

	basketModel.clear();
	console.log('Корзина: после очистки', basketModel.getItems());
}

console.log('Покупатель: пустые данные', buyerModel.getData());
console.log('Покупатель: валидация', buyerModel.validate());

buyerModel.setAddress('Тест город, Тест улица 1');
buyerModel.setPayment('card');
buyerModel.setEmail('buyer@example.com');
buyerModel.setPhone('+79990000000');

console.log('Покупатель: заполненные данные', buyerModel.getData());
console.log('Покупатель: валидация', buyerModel.validate());

buyerModel.clear();
console.log('Покупатель: после очистки', buyerModel.getData());

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi
	.getProducts()
	.then((response) => {
		catalogModel.setItems(response.items);
		console.log('Каталог с сервера: сохранённые товары', catalogModel.getItems());
	})
	.catch((error: unknown) => {
		console.error('Ошибка загрузки каталога', error);
	});

const demoOrder: IOrderRequest = {
	payment: 'card',
	email: 'buyer@example.com',
	phone: '+79990000000',
	address: 'Тест город, Тест улица 1',
	items: apiProducts.items.map((item) => item.id),
	total: apiProducts.items.reduce((sum, item) => sum + (item.price ?? 0), 0),
};

console.log('Тестовые данные заказа для /order/', demoOrder);
