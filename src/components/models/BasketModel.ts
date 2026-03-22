import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { EVENTS } from '../../utils/constants';

export class BasketModel {
	private items: IProduct[] = [];

	constructor(private readonly events: IEvents) {}

	getItems(): IProduct[] {
		return [...this.items];
	}

	addItem(item: IProduct): void {
		if (!this.hasItem(item.id)) {
			this.items.push(item);
			this.events.emit(EVENTS.BASKET_CHANGED);
		}
	}

	removeItem(item: IProduct): void {
		this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
		this.events.emit(EVENTS.BASKET_CHANGED);
	}

	clear(): void {
		this.items = [];
		this.events.emit(EVENTS.BASKET_CHANGED);
	}

	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	getCount(): number {
		return this.items.length;
	}

	hasItem(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}
}
