import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketViewData } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<IBasketViewData> {
	private readonly listElement: HTMLElement;
	private readonly totalElement: HTMLElement;
	private readonly checkoutButton: HTMLButtonElement;

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

		this.checkoutButton.addEventListener('click', () => {
			this.events.emit(EVENTS.BASKET_CHECKOUT);
		});
	}

	set items(value: HTMLElement[]) {
		if (value.length === 0) {
			const emptyMessage = document.createElement('li');
			emptyMessage.className = 'basket__item';
			emptyMessage.textContent = 'Корзина пуста';
			this.listElement.replaceChildren(emptyMessage);
			return;
		}

		this.listElement.replaceChildren(...value);
	}

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}

	set canCheckout(value: boolean) {
		this.checkoutButton.disabled = !value;
	}
}
