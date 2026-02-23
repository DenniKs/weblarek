import { IBuyer, TPayment } from '../../types';

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
	private data: Partial<IBuyer> = {};

	setData(data: Partial<IBuyer>): void {
		this.data = {
			...this.data,
			...data,
		};
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
