import { IProduct } from '../../types';

export class CatalogModel {
	private items: IProduct[] = [];
	private previewItem: IProduct | null = null;

	setItems(items: IProduct[]): void {
		this.items = [...items];
	}

	getItems(): IProduct[] {
		return [...this.items];
	}

	getItemById(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	setPreviewItem(item: IProduct | null): void {
		this.previewItem = item;
	}

	getPreviewItem(): IProduct | null {
		return this.previewItem;
	}
}
