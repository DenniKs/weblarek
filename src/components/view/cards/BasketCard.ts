import { IEvents } from '../../base/Events';
import { IBasketItemViewData } from '../../../types';
import { EVENTS } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { ProductCard } from './ProductCard';

export class BasketCard extends ProductCard<IBasketItemViewData> {
	private readonly indexElement: HTMLElement;
	private readonly removeButton: HTMLButtonElement;

	constructor(container: HTMLElement, private readonly events: IEvents, itemId: string) {
		super(container);
		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this.removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		this.removeButton.addEventListener('click', () => {
			this.events.emit<{ id: string }>(EVENTS.BASKET_ITEM_REMOVED, { id: itemId });
		});
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}
}
