import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccessViewData } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<ISuccessViewData> {
	private readonly descriptionElement: HTMLElement;
	private readonly closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

		this.closeButton.addEventListener('click', () => {
			this.events.emit(EVENTS.SUCCESS_CLOSED);
		});
	}

	set total(value: number) {
		this.descriptionElement.textContent = `Списано ${value} синапсов`;
	}
}
