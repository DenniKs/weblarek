import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketView } from './components/view/BasketView';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { SuccessView } from './components/view/SuccessView';
import { BasketCard } from './components/view/cards/BasketCard';
import { CatalogCard } from './components/view/cards/CatalogCard';
import { PreviewCard } from './components/view/cards/PreviewCard';
import { ContactsFormView } from './components/view/forms/ContactsFormView';
import { OrderFormView } from './components/view/forms/OrderFormView';
import { IOrderRequest, TPayment } from './types';
import { API_URL, EVENTS } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

type ModalState = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null;

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const pageWrapper = ensureElement<HTMLElement>('.page__wrapper', document.body);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), pageWrapper, events);
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const previewCard = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), events);
const orderForm = new OrderFormView(cloneTemplate<HTMLElement>('#order'), events);
const contactsForm = new ContactsFormView(cloneTemplate<HTMLElement>('#contacts'), events);
const successView = new SuccessView(cloneTemplate<HTMLElement>('#success'), events);

let modalState: ModalState = null;

const isPayment = (value: string): value is TPayment => value === 'card' || value === 'cash';

const collectOrderErrors = (): string[] => {
	const validationErrors = buyerModel.validate();
	return [validationErrors.payment, validationErrors.address].filter(
		(error): error is string => Boolean(error)
	);
};

const collectContactsErrors = (): string[] => {
	const validationErrors = buyerModel.validate();
	return [validationErrors.email, validationErrors.phone].filter(
		(error): error is string => Boolean(error)
	);
};

const isOrderValid = (): boolean => {
	const data = buyerModel.getData();
	return Boolean(data.payment && data.address?.trim() && collectOrderErrors().length === 0);
};

const isContactsValid = (): boolean => {
	const data = buyerModel.getData();
	return Boolean(data.email?.trim() && data.phone?.trim() && collectContactsErrors().length === 0);
};

const renderCatalog = (): void => {
	const cards = catalogModel.getItems().map((item) => {
		const card = new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), {
			onClick: () => catalogModel.setPreviewItem(item),
		});
		return card.render(item);
	});

	page.render({
		catalog: cards,
		counter: basketModel.getCount(),
	});
};

const openBasket = (): void => {
	const basketItems = basketModel.getItems().map((item, index) => {
		const basketCard = new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), events, item.id);
		return basketCard.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	const basketElement = basketView.render({
		items: basketItems,
		total: basketModel.getTotalPrice(),
		canCheckout: basketModel.getCount() > 0,
	});

	modalState = 'basket';
	modal.open(basketElement);
};

const openPreview = (): void => {
	const previewItem = catalogModel.getPreviewItem();
	if (!previewItem) {
		return;
	}

	const previewElement = previewCard.render(previewItem);
	const isAvailable = previewItem.price !== null;
	const isInBasket = basketModel.hasItem(previewItem.id);
	const buttonText = !isAvailable ? 'Недоступно' : isInBasket ? 'Удалить из корзины' : 'Купить';
	previewCard.setActionButton(buttonText, !isAvailable);

	modalState = 'preview';
	modal.open(previewElement);
};

const openOrderForm = (): void => {
	const buyerData = buyerModel.getData();
	const orderElement = orderForm.render({
		payment: buyerData.payment,
		address: buyerData.address,
		isValid: isOrderValid(),
		errors: collectOrderErrors(),
	});

	modalState = 'order';
	modal.open(orderElement);
};

const openContactsForm = (): void => {
	const buyerData = buyerModel.getData();
	const contactsElement = contactsForm.render({
		email: buyerData.email,
		phone: buyerData.phone,
		isValid: isContactsValid(),
		errors: collectContactsErrors(),
	});

	modalState = 'contacts';
	modal.open(contactsElement);
};

const openSuccess = (total: number): void => {
	const successElement = successView.render({ total });
	modalState = 'success';
	modal.open(successElement);
};

const submitOrder = (): void => {
	const data = buyerModel.getData();
	const order: IOrderRequest = {
		payment: data.payment as TPayment,
		address: data.address,
		email: data.email,
		phone: data.phone,
		items: basketModel.getItems().map((item) => item.id),
		total: basketModel.getTotalPrice(),
	};

	webLarekApi
		.createOrder(order)
		.then((response) => {
			openSuccess(response.total);
			basketModel.clear();
			buyerModel.clear();
		})
		.catch((error: unknown) => {
			console.error('Ошибка оформления заказа', error);
		});
};

events.on(EVENTS.CATALOG_CHANGED, () => {
	renderCatalog();
});

events.on(EVENTS.BASKET_CHANGED, () => {
	renderCatalog();
	if (modalState === 'basket') {
		openBasket();
	}

	if (modalState === 'preview') {
		openPreview();
	}
});

events.on(EVENTS.BUYER_CHANGED, () => {
	if (modalState === 'order') {
		openOrderForm();
	}

	if (modalState === 'contacts') {
		openContactsForm();
	}
});

events.on(EVENTS.PREVIEW_CHANGED, () => {
	const previewItem = catalogModel.getPreviewItem();
	if (previewItem) {
		openPreview();
	}
});

events.on(EVENTS.CARD_BUY_TOGGLED, () => {
	const item = catalogModel.getPreviewItem();
	if (!item || item.price === null) {
		return;
	}

	if (basketModel.hasItem(item.id)) {
		basketModel.removeItem(item);
	} else {
		basketModel.addItem(item);
	}

	modal.close();
	modalState = null;
	catalogModel.setPreviewItem(null);
});

events.on(EVENTS.BASKET_OPENED, () => {
	openBasket();
});

events.on<{ id: string }>(EVENTS.BASKET_ITEM_REMOVED, ({ id }) => {
	const item = catalogModel.getItemById(id);
	if (!item) {
		return;
	}

	basketModel.removeItem(item);
});

events.on(EVENTS.BASKET_CHECKOUT, () => {
	openOrderForm();
});

events.on<{ field: 'address' | 'payment'; value: string }>(EVENTS.ORDER_FIELD_CHANGED, ({ field, value }) => {
	if (field === 'address') {
		buyerModel.setAddress(value);
	}

	if (field === 'payment' && isPayment(value)) {
		buyerModel.setPayment(value);
	}
});

events.on(EVENTS.ORDER_SUBMIT, () => {
	openContactsForm();
});

events.on<{ field: 'email' | 'phone'; value: string }>(EVENTS.CONTACTS_FIELD_CHANGED, ({ field, value }) => {
	if (field === 'email') {
		buyerModel.setEmail(value);
	}

	if (field === 'phone') {
		buyerModel.setPhone(value);
	}
});

events.on(EVENTS.CONTACTS_SUBMIT, () => {
	submitOrder();
});

events.on(EVENTS.MODAL_CLOSED, () => {
	if (modalState === 'preview') {
		catalogModel.setPreviewItem(null);
	}

	modalState = null;
});

events.on(EVENTS.SUCCESS_CLOSED, () => {
	modal.close();
	modalState = null;
});

page.render({ catalog: [], counter: 0 });

webLarekApi
	.getProducts()
	.then((response) => {
		catalogModel.setItems(response.items);
	})
	.catch((error: unknown) => {
		console.error('Ошибка загрузки каталога', error);
	});
