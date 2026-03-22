import { IEvents } from '../base/Events';
import { IBuyer, TPayment } from '../../types';
import { EVENTS } from '../../utils/constants';

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
	private data: Partial<IBuyer> = {};

	constructor(private readonly events: IEvents) {}

	setData(data: Partial<IBuyer>): void {
		this.data = {
			...this.data,
			...data,
		};
		this.events.emit(EVENTS.BUYER_CHANGED);
	}

	setPayment(payment: TPayment): void {
		this.setData({ payment });
	}

	setAddress(address: string): void {
		this.setData({ address });
	}

	setEmail(email: string): void {
		this.setData({ email });
	}

	setPhone(phone: string): void {
		this.setData({ phone });
	}

	getData(): Partial<IBuyer> {
		return { ...this.data };
	}

	clear(): void {
		this.data = {};
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
