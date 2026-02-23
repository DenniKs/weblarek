import { IBuyer, TPayment } from '../../types';

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

const EMPTY_BUYER: Partial<IBuyer> = {};

export class BuyerModel {
	private data: Partial<IBuyer> = { ...EMPTY_BUYER };

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
		this.data = { ...EMPTY_BUYER };
	}

	validateOrderStep(): TBuyerValidationErrors {
		const errors: TBuyerValidationErrors = {};

		if (!this.data.payment) {
			errors.payment = 'Способ оплаты обязателен';
		}

		if (!this.data.address?.trim()) {
			errors.address = 'Адрес обязателен';
		}

		return errors;
	}

	validateContactsStep(): TBuyerValidationErrors {
		const errors: TBuyerValidationErrors = {};

		if (!this.data.email?.trim()) {
			errors.email = 'Email обязателен';
		}

		if (!this.data.phone?.trim()) {
			errors.phone = 'Телефон обязателен';
		}

		return errors;
	}

	validateAll(): TBuyerValidationErrors {
		return {
			...this.validateOrderStep(),
			...this.validateContactsStep(),
		};
	}
}
