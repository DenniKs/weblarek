/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 
/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const categoryMap: Record<string, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
};

export const EVENTS = {
	CATALOG_CHANGED: 'catalog:changed',
	PREVIEW_CHANGED: 'preview:changed',
	BASKET_CHANGED: 'basket:changed',
	BUYER_CHANGED: 'buyer:changed',
	CARD_SELECTED: 'card:selected',
	CARD_BUY_TOGGLED: 'card:buy-toggle',
	BASKET_OPENED: 'basket:open',
	BASKET_CHECKOUT: 'basket:checkout',
	BASKET_ITEM_REMOVED: 'basket:item-remove',
	ORDER_FIELD_CHANGED: 'order:field-change',
	ORDER_SUBMIT: 'order:submit',
	CONTACTS_FIELD_CHANGED: 'contacts:field-change',
	CONTACTS_SUBMIT: 'contacts:submit',
	MODAL_CLOSED: 'modal:close',
	SUCCESS_CLOSED: 'success:close',
} as const;
