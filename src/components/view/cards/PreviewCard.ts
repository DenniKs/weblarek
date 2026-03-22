import { IEvents } from '../../base/Events';
import { IPreviewCardViewData } from '../../../types';
import { EVENTS } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { ProductCard } from './ProductCard';

export class PreviewCard extends ProductCard<IPreviewCardViewData> {
	private readonly descriptionElement: HTMLElement;
	private readonly actionButton: HTMLButtonElement;

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
		this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this.actionButton.addEventListener('click', () => {
			if (this.actionButton.disabled) {
				return;
			}

			this.events.emit<{ id: string }>(EVENTS.CARD_BUY_TOGGLED, { id: this.container.dataset.id ?? '' });
		});
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	set inBasket(value: boolean) {
		this.container.dataset.inBasket = String(value);
		if (this.actionButton.disabled) {
			return;
		}
		this.actionButton.textContent = value ? 'Удалить из корзины' : 'Купить';
	}

	override set price(value: number | null) {
		super.price = value;
		const isAvailable = value !== null;
		this.actionButton.disabled = !isAvailable;
		if (!isAvailable) {
			this.actionButton.textContent = 'Недоступно';
			return;
		}

		this.actionButton.textContent =
			this.container.dataset.inBasket === 'true' ? 'Удалить из корзины' : 'Купить';
	}
}
