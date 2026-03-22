import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export abstract class ProductCard<T extends IProduct> extends Component<T> {
	protected readonly titleElement: HTMLElement;
	protected readonly priceElement: HTMLElement;
	protected readonly categoryElement?: HTMLElement;
	protected readonly imageElement?: HTMLImageElement;
	private currentCategoryClass = '';

	protected constructor(container: HTMLElement) {
		super(container);
		this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
		this.categoryElement = this.container.querySelector<HTMLElement>('.card__category') ?? undefined;
		this.imageElement = this.container.querySelector<HTMLImageElement>('.card__image') ?? undefined;
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
	}

	set category(value: string) {
		if (!this.categoryElement) {
			return;
		}

		this.categoryElement.textContent = value;
		if (this.currentCategoryClass) {
			this.categoryElement.classList.remove(this.currentCategoryClass);
		}

		const modifier = categoryMap[value] ?? 'other';
		this.currentCategoryClass = `card__category_${modifier}`;
		this.categoryElement.classList.add(this.currentCategoryClass);
	}

	set image(value: string) {
		if (!this.imageElement) {
			return;
		}

		this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? 'Товар');
	}
}
