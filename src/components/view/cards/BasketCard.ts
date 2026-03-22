import { IEvents } from '../../base/Events';
import { IBasketItemViewData, IProduct } from '../../../types';
import { EVENTS } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { ProductCard } from './ProductCard';

interface IBasketCardData extends IProduct {
	index: number;
}

export class BasketCard extends ProductCard<IBasketCardData> {
	private readonly indexElement: HTMLElement;
	private readonly removeButton: HTMLButtonElement;

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this.removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		this.removeButton.addEventListener('click', () => {
			this.events.emit<{ id: string }>(EVENTS.BASKET_ITEM_REMOVED, { id: this.container.dataset.id ?? '' });
		});
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}

	render(data?: Partial<IBasketItemViewData>): HTMLElement {
		const mappedData = data
			? {
				...data,
				category: '',
				image: '',
				description: '',
			  }
			: undefined;

		return super.render(mappedData);
	}
}
