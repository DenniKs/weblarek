export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export type TBuyerStep = 'order' | 'contacts';
export type TOrderField = 'address' | 'payment';
export type TContactsField = 'email' | 'phone';

export interface IOrderFieldChange {
    field: TOrderField;
    value: string;
}

export interface IContactsFieldChange {
    field: TContactsField;
    value: string;
}

export interface IAppEvents {
    'catalog:changed': void;
    'preview:changed': void;
    'basket:changed': void;
    'buyer:changed': void;
    'card:selected': { id: string };
    'card:buy-toggle': void;
    'basket:open': void;
    'basket:checkout': void;
    'basket:item-remove': { id: string };
    'order:field-change': IOrderFieldChange;
    'order:submit': void;
    'contacts:field-change': IContactsFieldChange;
    'contacts:submit': void;
    'modal:close': void;
    'success:close': void;
}

export interface ICatalogCardViewData extends IProduct {}

export interface IPreviewCardViewData extends IProduct {
}

export interface IBasketItemViewData extends Pick<IProduct, 'id' | 'title' | 'price'> {
    index: number;
}

export interface IBasketViewData {
    items: HTMLElement[];
    total: number;
    canCheckout: boolean;
}

export interface IOrderFormViewData {
    payment: TPayment | '';
    address: string;
    isValid: boolean;
    errors: string[];
}

export interface IContactsFormViewData {
    email: string;
    phone: string;
    isValid: boolean;
    errors: string[];
}

export interface ISuccessViewData {
    total: number;
}
