import { IEvents } from '../../base/Events';
import { IPreviewCardViewData } from '../../../types';
import { EVENTS, categoryMap, CDN_URL } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { ProductCard } from './ProductCard';

export class PreviewCard extends ProductCard<IPreviewCardViewData> {
	private readonly categoryElement: HTMLElement;
	private readonly imageElement: HTMLImageElement;
	private readonly descriptionElement: HTMLElement;
	private readonly actionButton: HTMLButtonElement;
	private currentCategoryClass = '';

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
		this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this.actionButton.addEventListener('click', () => {
			this.events.emit(EVENTS.CARD_BUY_TOGGLED);
		});
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		if (this.currentCategoryClass) {
			this.categoryElement.classList.remove(this.currentCategoryClass);
		}

		const modifier = categoryMap[value] ?? 'other';
		this.currentCategoryClass = `card__category_${modifier}`;
		this.categoryElement.classList.add(this.currentCategoryClass);
	}

	set image(value: string) {
		this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? 'Товар');
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	setActionButton(text: string, disabled: boolean): void {
		this.actionButton.textContent = text;
		this.actionButton.disabled = disabled;
	}
}
