import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IFormViewData {
	isValid: boolean;
	errors: string[];
}

export abstract class FormView<T extends IFormViewData> extends Component<T> {
	protected readonly submitButton: HTMLButtonElement;
	private readonly errorsElement: HTMLElement;
	private readonly inputs: HTMLInputElement[];

	protected constructor(container: HTMLElement) {
		super(container);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
		this.inputs = Array.from(this.container.querySelectorAll<HTMLInputElement>('.form__input'));

		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.handleSubmit();
		});

		this.container.addEventListener('input', (event) => {
			const target = event.target;
			if (!(target instanceof HTMLInputElement)) {
				return;
			}

			this.handleFieldChange(target.name, target.value);
		});
	}

	set isValid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string[]) {
		this.errorsElement.textContent = value.join('; ');
	}

	protected setInputValue(name: string, value: string): void {
		const input = this.inputs.find((inputElement) => inputElement.name === name);
		if (input) {
			input.value = value;
		}
	}

	protected abstract handleFieldChange(name: string, value: string): void;
	protected abstract handleSubmit(): void;
}
