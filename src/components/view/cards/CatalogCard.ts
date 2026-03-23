import { ICatalogCardViewData } from '../../../types';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { ProductCard } from './ProductCard';

interface ICatalogCardActions {
	onClick: () => void;
}

export class CatalogCard extends ProductCard<ICatalogCardViewData> {
	private readonly categoryElement: HTMLElement;
	private readonly imageElement: HTMLImageElement;
	private currentCategoryClass = '';

	constructor(container: HTMLElement, actions: ICatalogCardActions) {
		super(container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

		this.container.addEventListener('click', actions.onClick);
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
}
