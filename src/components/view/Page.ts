import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface IPageViewData {
	catalog: HTMLElement[];
	counter: number;
}

export class Page extends Component<IPageViewData> {
	private readonly galleryElement: HTMLElement;
	private readonly basketCounterElement: HTMLElement;
	private readonly basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.galleryElement = ensureElement<HTMLElement>('.gallery', this.container);
		this.basketCounterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit(EVENTS.BASKET_OPENED);
		});
	}

	set catalog(value: HTMLElement[]) {
		this.galleryElement.replaceChildren(...value);
	}

	set counter(value: number) {
		this.basketCounterElement.textContent = String(value);
	}
}
