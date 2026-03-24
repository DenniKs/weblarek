import { IEvents } from '../base/Events';
import { IBuyer, TPayment } from '../../types';
import { EVENTS } from '../../utils/constants';

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;
type TBuyerData = Omit<IBuyer, 'payment'> & { payment: TPayment | '' };

export class BuyerModel {
	private readonly initialData: TBuyerData = {
		payment: '',
		email: '',
		phone: '',
		address: '',
	};
	private data: TBuyerData = { ...this.initialData };

	constructor(private readonly events: IEvents) {}

	setPayment(payment: TPayment): void {
		this.data.payment = payment;
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	setAddress(address: string): void {
		this.data.address = address;
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	setEmail(email: string): void {
		this.data.email = email;
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	setPhone(phone: string): void {
		this.data.phone = phone;
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	getData(): TBuyerData {
		return { ...this.data };
	}

	clear(): void {
		this.data = { ...this.initialData };
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	validate(): TBuyerValidationErrors {
		const errors: TBuyerValidationErrors = {};

		if (!this.data.payment) {
			errors.payment = 'Способ оплаты обязателен';
		}

		if (!this.data.address?.trim()) {
			errors.address = 'Адрес обязателен';
		}

		if (!this.data.email?.trim()) {
			errors.email = 'Email обязателен';
		}

		if (!this.data.phone?.trim()) {
			errors.phone = 'Телефон обязателен';
		}

		return errors;
	}
}
