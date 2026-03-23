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

	private updateField<K extends keyof TBuyerData>(field: K, value: TBuyerData[K]): void {
		this.data[field] = value;
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	setPayment(payment: TPayment): void {
		this.updateField('payment', payment);
	}

	setAddress(address: string): void {
		this.updateField('address', address);
	}

	setEmail(email: string): void {
		this.updateField('email', email);
	}

	setPhone(phone: string): void {
		this.updateField('phone', phone);
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
