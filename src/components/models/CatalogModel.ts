import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { EVENTS } from '../../utils/constants';

export class CatalogModel {
	private items: IProduct[] = [];
	private previewItem: IProduct | null = null;

	constructor(private readonly events: IEvents) {}

	setItems(items: IProduct[]): void {
		this.items = [...items];
		this.events.emit(EVENTS.CATALOG_CHANGED);
	}

	getItems(): IProduct[] {
		return [...this.items];
	}

	getItemById(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	setPreviewItem(item: IProduct | null): void {
		this.previewItem = item;
		this.events.emit(EVENTS.PREVIEW_CHANGED);
	}

	getPreviewItem(): IProduct | null {
		return this.previewItem;
	}
}
