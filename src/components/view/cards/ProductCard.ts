import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

type TProductCardBaseData = {
	title: string;
	price: number | null;
};

export abstract class ProductCard<T extends TProductCardBaseData> extends Component<T> {
	protected readonly titleElement: HTMLElement;
	protected readonly priceElement: HTMLElement;

	protected constructor(container: HTMLElement) {
		super(container);
		this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
	}
}
