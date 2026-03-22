import { IEvents } from '../../base/Events';
import { ICatalogCardViewData } from '../../../types';
import { EVENTS } from '../../../utils/constants';
import { ProductCard } from './ProductCard';

export class CatalogCard extends ProductCard<ICatalogCardViewData> {
	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);

		this.container.addEventListener('click', () => {
			this.events.emit<{ id: string }>(EVENTS.CARD_SELECTED, { id: this.container.dataset.id ?? '' });
		});
	}
}
