# Репозиторий
https://github.com/DenniKs/weblarek

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


## Данные

В приложении используются две основные сущности: товар и покупатель.

### Интерфейс товара

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Назначение:
- Описывает карточку товара, получаемую с API и используемую в каталоге и корзине.
- Поле `price` может быть `null`, что обозначает недоступность товара для покупки.

### Тип способа оплаты

```ts
type TPayment = 'card' | 'cash';
```

Назначение:
- Ограничивает допустимые значения способа оплаты на этапе оформления заказа.

### Интерфейс покупателя

```ts
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

Назначение:
- Описывает данные покупателя, заполняемые на форме оформления.

### Интерфейс ответа каталога

```ts
interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```

Назначение:
- Описывает ответ API при загрузке каталога товаров.

### Интерфейс запроса заказа

```ts
interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}
```

Назначение:
- Описывает payload, отправляемый на эндпоинт `/order/`.
- Содержит данные покупателя, id выбранных товаров и итоговую сумму заказа.

### Интерфейс ответа заказа

```ts
interface IOrderResponse {
  id: string;
  total: number;
}
```

Назначение:
- Описывает успешный ответ сервера после создания заказа.

## Модели данных

Модели данных отвечают только за хранение и обработку данных. Они не рендерят интерфейс и не зависят от классов представления.

### `CatalogModel`

Зона ответственности:
- Хранит массив всех товаров каталога.
- Хранит товар, выбранный для детального просмотра.

Конструктор:
- `constructor(events: IEvents)`.

Поля:
- `items: IProduct[]` хранит все товары каталога.
- `previewItem: IProduct | null` хранит товар для модального предпросмотра.

Методы:
- `setItems(items: IProduct[]): void` сохраняет массив товаров и эмитит `catalog:changed`.
- `getItems(): IProduct[]` возвращает массив товаров каталога.
- `getItemById(id: string): IProduct | undefined` возвращает товар по id.
- `setPreviewItem(item: IProduct | null): void` сохраняет товар для предпросмотра и эмитит `preview:changed`.
- `getPreviewItem(): IProduct | null` возвращает выбранный товар предпросмотра.

### `BasketModel`

Зона ответственности:
- Хранит товары, добавленные в корзину.
- Считает итоговую стоимость и количество товаров.

Конструктор:
- `constructor(events: IEvents)`.

Поля:
- `items: IProduct[]` хранит товары в корзине.

Методы:
- `getItems(): IProduct[]` возвращает товары корзины.
- `addItem(item: IProduct): void` добавляет товар, если его еще нет в корзине, и эмитит `basket:changed`.
- `removeItem(item: IProduct): void` удаляет товар из корзины и эмитит `basket:changed`.
- `clear(): void` очищает корзину и эмитит `basket:changed`.
- `getTotalPrice(): number` возвращает сумму корзины (`null`-цена считается как `0`).
- `getCount(): number` возвращает количество товаров в корзине.
- `hasItem(id: string): boolean` проверяет наличие товара в корзине по id.

### `BuyerModel`

Зона ответственности:
- Хранит данные покупателя для оформления заказа.
- Валидирует поля формы оформления.

Конструктор:
- `constructor(events: IEvents)`.

Поля:
- `data: Partial<IBuyer>` хранит текущие данные покупателя.

Методы:
- `setData(data: Partial<IBuyer>): void` обновляет часть данных без потери уже заполненных полей и эмитит `buyer:changed`.
- `setPayment(payment: TPayment): void` сохраняет способ оплаты.
- `setAddress(address: string): void` сохраняет адрес.
- `setEmail(email: string): void` сохраняет email.
- `setPhone(phone: string): void` сохраняет телефон.
- `getData(): Partial<IBuyer>` возвращает данные покупателя.
- `clear(): void` очищает данные покупателя и эмитит `buyer:changed`.
- `validate(): Partial<Record<keyof IBuyer, string>>` валидирует все поля оформления и возвращает объект ошибок.

Пример объекта ошибок валидации:

```ts
{
  payment: 'Способ оплаты обязателен',
  email: 'Email обязателен'
}
```

## Слой коммуникации

### `WebLarekApi`

Зона ответственности:
- Работает с API через композицию с базовым классом `Api`.
- Получает товары и отправляет заказ.

Конструктор:
- `constructor(api: IApi)`
- `api: IApi` — объект, реализующий методы `get` и `post`.

Поля:
- `api: IApi` хранит зависимость для HTTP-запросов.

Методы:
- `getProducts(): Promise<IProductsResponse>` выполняет `GET /product/`.
- `createOrder(order: IOrderRequest): Promise<IOrderResponse>` выполняет `POST /order/`.

## Слой представления (View)

Компоненты слоя View не хранят бизнес-данные. Они получают данные через `render(...)`, изменяют разметку и эмитят пользовательские события через `EventEmitter`.

### `Page`
Назначение:
- Управляет главным экраном: каталог товаров и счётчик корзины в шапке.
- Обрабатывает клик по иконке корзины.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `galleryElement: HTMLElement` — контейнер каталога.
- `basketCounterElement: HTMLElement` — счётчик на иконке корзины.
- `basketButton: HTMLButtonElement` — кнопка открытия корзины.

Методы/сеттеры:
- `set catalog(value: HTMLElement[])` — рендер карточек каталога.
- `set counter(value: number)` — обновление счётчика корзины.
- Клик по `basketButton` эмитит событие `basket:open`.

### `Modal`
Назначение:
- Универсальное модальное окно приложения.
- Закрывается по клику на крестик и по клику на оверлей.
- Переключает модификатор `modal_active`.
- Блокирует прокрутку подложки через `page__wrapper_locked`.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `closeButton: HTMLButtonElement` — кнопка закрытия.
- `contentElement: HTMLElement` — контейнер контента модалки.
- `pageWrapper?: HTMLElement` — блок страницы, который фиксируется при открытии.

Методы:
- `open(content: HTMLElement): void` — открывает модалку с контентом.
- `close(): void` — закрывает модалку и очищает контент.
- `set content(value: HTMLElement)` — замена содержимого.

События:
- При пользовательском закрытии эмитит `modal:close`.

### Базовый класс карточек `ProductCard<T extends IProduct>`
Назначение:
- Содержит общий код для трёх шаблонов карточек (`card-catalog`, `card-preview`, `card-basket`).
- Управляет общими полями: id, название, цена, категория, изображение.

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `idValue: string`
- `titleElement: HTMLElement`
- `priceElement: HTMLElement`
- `categoryElement?: HTMLElement`
- `imageElement?: HTMLImageElement`

Методы/сеттеры:
- `set id(value: string)`
- `set title(value: string)`
- `set price(value: number | null)` (`null` отображается как `Бесценно`)
- `set category(value: string)` — применяет модификатор из `categoryMap`
- `set image(value: string)` — собирает URL на основе `CDN_URL`

### `CatalogCard`
Назначение:
- Карточка товара в каталоге на главной странице.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

События:
- Клик по карточке эмитит `card:selected` с `id`.

### `PreviewCard`
Назначение:
- Карточка детального просмотра товара в модальном окне.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `descriptionElement: HTMLElement`
- `actionButton: HTMLButtonElement`

Методы/сеттеры:
- `set description(value: string)`
- `set inBasket(value: boolean)` — переключает подпись кнопки `Купить`/`Удалить из корзины`
- `set price(value: number | null)` — при `null` кнопка блокируется и меняет подпись на `Недоступно`

События:
- Клик по кнопке покупки/удаления эмитит `card:buy-toggle` с `id`.

### `BasketCard`
Назначение:
- Компактная карточка товара внутри корзины.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `indexElement: HTMLElement`
- `removeButton: HTMLButtonElement`

Методы/сеттеры:
- `set index(value: number)` — отображает номер позиции.
- `render(data?: Partial<IBasketItemViewData>): HTMLElement`

События:
- Клик по кнопке удаления эмитит `basket:item-remove` с `id`.

### `BasketView`
Назначение:
- Компонент корзины: список товаров, итоговая цена, кнопка оформления.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `listElement: HTMLElement`
- `totalElement: HTMLElement`
- `checkoutButton: HTMLButtonElement`

Методы/сеттеры:
- `set items(value: HTMLElement[])` — при пустом массиве выводит `Корзина пуста`
- `set total(value: number)`
- `set canCheckout(value: boolean)` — активирует/деактивирует кнопку оформления

События:
- Клик по кнопке оформления эмитит `basket:checkout`.

### Базовый класс форм `FormView<T>`
Назначение:
- Общий функционал форм оформления (`order`, `contacts`):
  - подписка на `submit` и `input`;
  - управление кнопкой submit;
  - отображение ошибок.

Конструктор:
- `constructor(container: HTMLElement)`

Поля:
- `submitButton: HTMLButtonElement`
- `errorsElement: HTMLElement`
- `inputs: HTMLInputElement[]`

Методы/сеттеры:
- `set isValid(value: boolean)`
- `set errors(value: string[])`
- `setInputValue(name: string, value: string): void`
- `handleFieldChange(...)` и `handleSubmit()` — абстрактные, реализуются в наследниках.

### `OrderFormView`
Назначение:
- Первый шаг оформления: способ оплаты и адрес.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `paymentButtons: HTMLButtonElement[]`

Методы/сеттеры:
- `set payment(value: TPayment | undefined)` — выделяет активную кнопку оплаты классом `button_alt-active`
- `set address(value: string | undefined)`

События:
- Изменение адреса эмитит `order:field-change`.
- Выбор оплаты эмитит `order:field-change`.
- Сабмит формы эмитит `order:submit`.

### `ContactsFormView`
Назначение:
- Второй шаг оформления: email и телефон.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Методы/сеттеры:
- `set email(value: string | undefined)`
- `set phone(value: string | undefined)`

События:
- Изменения полей эмитят `contacts:field-change`.
- Сабмит формы эмитит `contacts:submit`.

### `SuccessView`
Назначение:
- Экран успешного оформления заказа.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Поля:
- `descriptionElement: HTMLElement`
- `closeButton: HTMLButtonElement`

Методы/сеттеры:
- `set total(value: number)` — обновляет текст `Списано N синапсов`

События:
- Клик по кнопке закрытия эмитит `success:close`.

## Событийная модель

### События, генерируемые моделями данных
- `catalog:changed` — изменён массив товаров каталога.
- `preview:changed` — изменён выбранный товар для просмотра.
- `basket:changed` — изменён состав корзины.
- `buyer:changed` — изменены данные покупателя.

### События, генерируемые представлением
- `card:selected` — выбрана карточка для просмотра.
- `card:buy-toggle` — нажата кнопка купить/удалить в превью товара.
- `basket:open` — нажата кнопка открытия корзины.
- `basket:item-remove` — нажата кнопка удаления товара из корзины.
- `basket:checkout` — нажата кнопка перехода к оформлению.
- `order:field-change` — изменено поле формы первого шага.
- `order:submit` — отправлена форма первого шага.
- `contacts:field-change` — изменено поле формы второго шага.
- `contacts:submit` — отправлена форма второго шага.
- `modal:close` — пользователь закрыл модальное окно.
- `success:close` — нажата кнопка закрытия успешного заказа.

## Презентер

Презентер реализован в `src/main.ts` (без отдельного класса), так как приложение одностраничное.

Зона ответственности презентера:
- Создание и связывание всех экземпляров моделей, API-классов и компонентов View.
- Подписка на все события от моделей и View.
- Реализация бизнес-сценариев:
  - загрузка каталога с сервера;
  - открытие предпросмотра товара;
  - добавление/удаление товара в корзине;
  - отображение корзины и подсчёт итога;
  - двухшаговое оформление заказа;
  - отправка заказа на сервер;
  - показ экрана успешной оплаты;
  - очистка корзины и данных покупателя после успешной покупки.

Принцип перерендера:
- Перерисовка происходит при обработке событий моделей (`catalog:changed`, `basket:changed`, `buyer:changed`, `preview:changed`) либо при открытии модальных окон в обработчиках пользовательских событий.
- В презентере не генерируются события вручную, он только обрабатывает события, пришедшие от моделей и View.
