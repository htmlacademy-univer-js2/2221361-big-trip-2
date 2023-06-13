import { nanoid } from 'nanoid';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createOffers } from '../mock/mocks.js';
import { changeDateFormat, getOffersByPointType, getPhotosByDestination } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const BLANK_POINT = {
	basePrice: 0,
    dateFrom: new Date(),
    dateTo: new Date(),
    destination: {
		id: nanoid(),
    	description: 'Great place to visit!',
    	name: 'Washington',
    	pictures: [
      		...getPhotosByDestination('Washington')
    	]
	},
    id: nanoid(),
    isFavorite: false,
    offers: [0, 1],
    type: 'taxi',
};

const getOffers = (offers) => {
	const tripOffers = createOffers(offers);
	let offersWrapper = '<div class="event__available-offers">';
	  for (let j = 0; j < tripOffers.length; j++) {
		  offersWrapper += `
				  <div class="event__offer-selector">
					  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${tripOffers[j].title.toLowerCase().split(' ').join('')}-${tripOffers[j].id}"
					   type="checkbox" name="event-offer-${tripOffers[j].title.toLowerCase().split(' ').join('')}">
					  <label class="event__offer-label" for="event-offer-${tripOffers[j].title.toLowerCase().split(' ').join('')}-${tripOffers[j].id}">
							<span class="event__offer-title">${tripOffers[j].title}</span>
							&plus;&euro;&nbsp;
						<span class="event__offer-price">${tripOffers[j].price}</span>
					  </label>
				  </div>`;
		}
	offersWrapper += '</div>';
	return offersWrapper;
};

const getImages = (pictures) => {
	let imageMarkup = ``;
	for (let i = 0; i < pictures.length; i++) {
		imageMarkup += `<img class="event__photo" src="${pictures[i].src}" alt="Event photo">`
	}
	return imageMarkup;
};

const createEditMenu = (state) => {
  const { basePrice, dateFrom, dateTo, destination, offers, type, isOffers, isDescription, isPhotos } = state;
  return (
    `<form class="event event--edit" action="#" method="post">
	<header class="event__header">
	  <div class="event__type-wrapper">
		<label class="event__type  event__type-btn" for="event-type-toggle-1">
		  <span class="visually-hidden">Choose event type</span>
		  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
		</label>
		<input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

		<div class="event__type-list">
		  <fieldset class="event__type-group">
			<legend class="visually-hidden">Event type</legend>

			<div class="event__type-item">
			  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi"
			   ${type === 'taxi' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus"
			  ${type === 'bus' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train"
			  ${type === 'train' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship"
			  ${type === 'ship' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive"
			  ${type === 'drive' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight"
			  ${type === 'flight' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in"
			  ${type === 'check-in' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing"
			  ${type === 'sightseeing' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
			</div>

			<div class="event__type-item">
			  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant"
			  ${type === 'restaurant' ? 'checked': ''}>
			  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
			</div>
		  </fieldset>
		</div>
	  </div>

	  <div class="event__field-group  event__field-group--destination">
		<label class="event__label  event__type-output" for="event-destination-1">
		${type.slice(0,1).toUpperCase() + type.slice(1)}
		</label>
		<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isDescription ? he.encode(destination.name) : ''}" list="destination-list-1">
		<datalist id="destination-list-1">
		  <option value="New York"></option>
		  <option value="Washington"></option>
		  <option value="San Francisco"></option>
		  <option value="Boston"></option>
		  <option value="Los Angeles"></option>
		</datalist>
	  </div>

	  <div class="event__field-group  event__field-group--time">
		<label class="visually-hidden" for="event-start-time-1">From</label>
		<input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${changeDateFormat(dateFrom)}">
		&mdash;
		<label class="visually-hidden" for="event-end-time-1">To</label>
		<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${changeDateFormat(dateTo)}">
	  </div>

	  <div class="event__field-group  event__field-group--price">
		<label class="event__label" for="event-price-1">
		  <span class="visually-hidden">Price</span>
		  &euro;
		</label>
		<input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
	  </div>

	  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
	  <button class="event__reset-btn" type="reset">Delete</button>
	  <button class="event__rollup-btn" type="button">
		<span class="visually-hidden">Open event</span>
	  </button>
	</header>
	<section class="event__details">
	  ${isOffers ? `
	  <section class="event__section  event__section--offers">
	  	<h3 class="event__section-title  event__section-title--offers">Offers</h3>
	  	${getOffers(offers)}
	  </section>`: ''}
	  ${isDescription || isPhotos ? `
	  <section class="event__section  event__section--destination">
	  	<h3 class="event__section-title  event__section-title--destination">Destination</h3>
	  	<p class="event__destination-description">${isDescription? destination.description : ``}</p>
	  	<div class="event__photos-tape">
		  ${getImages(isPhotos ? destination.pictures : ``)}
	  	</div>
	  </section>`: ''}
	</section>
  </form>`
  );
};

export default class EditPointView extends AbstractStatefulView {
  #dateFromPicker = null;
  #dateToPicker = null;
  #stateCopy = null;

  constructor(point = BLANK_POINT) {
	super();
	this.#stateCopy = point;
    this._state = EditPointView.parsePointToState(point);
	this.#setInnerHandlers();
	this.#setDatePicker();
  }

  get template() {
    return createEditMenu(this._state);
  };

  removeElement = () => {
	super.removeElement();

	if (this.#dateFromPicker) {
		this.#dateFromPicker.destroy();
		this.#dateFromPicker = null;
	}

	if (this.#dateToPicker) {
		this.#dateToPicker.destroy();
		this.#dateToPicker = null;
	}
  };

  static parsePointToState = (point) => ({
		...point,
		isOffers: point.offers.length !== 0,
		isDescription: point.destination !== null,
		isPhotos: (point.destination ? point.destination.pictures.length !== 0 : false),
  	});

  static parseStateToPoint = (state) => {
	const point = {...state};

	if (!state.isOffers) {
		point.offers = [];
	}

	if (!state.isDescription) {
		point.destination = null;
	}

	if (!state.isPhotos) {
		(point.destination ? point.destination.pictures = [] : point.destination = null);
	}

	delete point.isOffers;
	delete point.isDescription;
	delete point.isPhotos;

	return point;
  };

  _restoreHandlers = () => {
	this.#setInnerHandlers();
	this.#setDatePicker();
	this.setClickHandler(this._callback.rollUp);
	this.setFormSubmitHandler(this._callback.saveCard);
	this.setDeletePointHandler(this._callback.deleteCard);
  };

  setClickHandler = (callback) => {
	this._callback.rollUp = callback;
	this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpCard);
  };

  setFormSubmitHandler = (callback) => {
	this._callback.saveCard = callback;
	this.element.querySelector('.event__save-btn').addEventListener('click', this.#saveForm);
  };

  setDeletePointHandler = (callback) => {
	this._callback.deleteCard = callback;
	this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteCard);
  };

  #rollUpCard = (evt) => {
	evt.preventDefault();
	this._callback.rollUp(this.#stateCopy);
  };

  #saveForm = (evt) => {
	evt.preventDefault();
	this._callback.saveCard(EditPointView.parseStateToPoint(this._state));
  };

  #deleteCard = (evt) => {
	evt.preventDefault();
	this._callback.deleteCard(EditPointView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([newDateFrom]) => {
	this.updateElement({
		dateFrom: newDateFrom,
	});
  };

  #dateToChangeHandler = ([newDateTo])=> {
	this.updateElement({
		dateTo: newDateTo,
	});
  };

  #setDatePicker = () => {
	if (this._state.dateFrom) {
		this.#dateFromPicker = flatpickr(
			this.element.querySelector('input[name=event-start-time]'),
			{
				dateFormat: 'd/m/y h:i',
				defaultDate: this._state.dateFrom,
				minDate: 'today',
				maxDate: this._state.dateTo,
				onChange: this.#dateFromChangeHandler,
			}
		);
	}

	if (this._state.dateTo) {
		this.#dateToPicker = flatpickr(
			this.element.querySelector('input[name=event-end-time]'),
			{
				dateFormat: 'd/m/y h:i',
				defaultDate: this._state.dateTo,
				minDate: this._state.dateFrom,
				onChange: this.#dateToChangeHandler,
			}
		);
	}
  };

  #setInnerHandlers = () => {
	this.element.querySelector('.event__type-list').addEventListener('click', this.#swapTypeHandler);
	this.element.querySelector('.event__input--destination').addEventListener('input', this.#changeDestinationHandler)
	this.element.querySelector('.event__input--price').addEventListener('input', this.#changePriceHandler);
  };

  #swapTypeHandler = (evt) => {
	evt.preventDefault();
	if (evt.target.classList.contains('event__type-label')) {
		this.updateElement({
			isOffers: getOffersByPointType(evt.target.previousElementSibling.value).length !== 0,
			offers: getOffersByPointType(evt.target.previousElementSibling.value),
			type: evt.target.previousElementSibling.value,
		});
	}
  };

  #changeDestinationHandler = (evt) => {
	const isNewPhotos = getPhotosByDestination(evt.target.value).length !== 0;
	if (isNewPhotos) {
		this.updateElement(
		{
			destination: {
				...this._state.destination,
				name: evt.target.value, 
				pictures: [...getPhotosByDestination(evt.target.value)],
			},
			isDescription: true,
			isPhotos: isNewPhotos,
		});
	}
  };

  #changePriceHandler = (evt) => {
	if (!isNaN(evt.target.value)){
		this.updateElement ({
			basePrice: evt.target.value,
		});
	}
  };
}
