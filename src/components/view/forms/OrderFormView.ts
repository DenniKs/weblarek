import { IEvents } from '../../base/Events';
import { IOrderFieldChange, IOrderFormViewData, TPayment } from '../../../types';
import { EVENTS } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { FormView } from './FormView';

export class OrderFormView extends FormView<IOrderFormViewData> {
	private readonly paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.paymentButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('.button_alt'));
		ensureElement<HTMLInputElement>('input[name="address"]', this.container);

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.events.emit<IOrderFieldChange>(EVENTS.ORDER_FIELD_CHANGED, {
					field: 'payment',
					value: button.name,
				});
			});
		});
	}

	set payment(value: TPayment | '') {
		this.paymentButtons.forEach((button) => {
			const isActive = button.name === value;
			button.classList.toggle('button_alt-active', isActive);
		});
	}

	set address(value: string) {
		this.setInputValue('address', value);
	}

	protected handleFieldChange(name: string, value: string): void {
		if (name !== 'address') {
			return;
		}

		this.events.emit<IOrderFieldChange>(EVENTS.ORDER_FIELD_CHANGED, {
			field: 'address',
			value,
		});
	}

	protected handleSubmit(): void {
		this.events.emit(EVENTS.ORDER_SUBMIT);
	}
}
