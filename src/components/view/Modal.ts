import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface IModalViewData {
	content: HTMLElement;
}

export class Modal extends Component<IModalViewData> {
	private readonly closeButton: HTMLButtonElement;
	private readonly contentElement: HTMLElement;
	private readonly pageWrapper: HTMLElement;

	constructor(container: HTMLElement, pageWrapper: HTMLElement, private readonly events: IEvents) {
		super(container);
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
		this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
		this.pageWrapper = pageWrapper;

		this.closeButton.addEventListener('click', () => this.handleClose());
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.handleClose();
			}
		});
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open(content: HTMLElement): void {
		this.render({ content });
		this.container.classList.add('modal_active');
		this.pageWrapper.classList.add('page__wrapper_locked');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.contentElement.replaceChildren();
		this.pageWrapper.classList.remove('page__wrapper_locked');
	}

	private handleClose(): void {
		if (!this.container.classList.contains('modal_active')) {
			return;
		}

		this.close();
		this.events.emit(EVENTS.MODAL_CLOSED);
	}
}
