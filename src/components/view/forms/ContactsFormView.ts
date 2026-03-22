import { IEvents } from '../../base/Events';
import { IContactsFormViewData } from '../../../types';
import { EVENTS } from '../../../utils/constants';
import { FormView } from './FormView';

export class ContactsFormView extends FormView<IContactsFormViewData> {
	constructor(container: HTMLElement, private readonly events: IEvents) {
		super(container);
	}

	set email(value: string | undefined) {
		this.setInputValue('email', value ?? '');
	}

	set phone(value: string | undefined) {
		this.setInputValue('phone', value ?? '');
	}

	protected handleFieldChange(name: string, value: string): void {
		if (name !== 'email' && name !== 'phone') {
			return;
		}

		this.events.emit<{ field: 'email' | 'phone'; value: string }>(EVENTS.CONTACTS_FIELD_CHANGED, {
			field: name,
			value,
		});
	}

	protected handleSubmit(): void {
		this.events.emit(EVENTS.CONTACTS_SUBMIT);
	}
}
