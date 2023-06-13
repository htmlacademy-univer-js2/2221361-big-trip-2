import dayjs from 'dayjs';
import { POINTS_DESCRIPTIONS, OffersByType, PhotosByDestination, FilterType } from './mock/constants';

const getRandomNumber = (minimum, maximum) => {
  minimum = Math.ceil(Math.min(Math.abs(minimum), Math.abs(maximum)));
  maximum = Math.floor(Math.max(Math.abs(minimum), Math.abs(maximum)));
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
};

const isPointFuture = (point) => point.dateFrom >= dayjs(new Date());

const isPointPast= (point) => point.dateTo < dayjs(new Date());

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

const changeDateFormat = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');
const changeDateFormatToMonth = (dueDate) => dayjs(dueDate).format('MMM D');
const changeDateFormatToHours = (dueDate) => dayjs(dueDate).format('HH:mm');
const getMinutesFromDate = (dueDate) => dayjs(dueDate).format('m');
const getHoursFromDate = (dueDate) => dayjs(dueDate).format('h');

const getOffersByPointType = (type) => {
  if (type !== 'check-in') {
    const offersByType = OffersByType[type.split()[0].toUpperCase()];
    return offersByType;
  }
  return OffersByType.CHECKIN;
};

const getPhotosByDestination = (name) => {
  const destinationPhotos = [];
  const destinationName = name.split(' ').join('').toUpperCase();
  if (!(destinationName in PhotosByDestination)) {
    return [];
  }
  const photos = PhotosByDestination[destinationName];
  for (let i = 0; i < photos.length; i++) {
    destinationPhotos[i] = {
      src: `http://dummyimage.com/${photos[0]}`,
      description: POINTS_DESCRIPTIONS[getRandomNumber(0, POINTS_DESCRIPTIONS.length - 1)]
    };
  }
  return destinationPhotos;
};

const updatePoint = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortPointByDateUp = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  return (weight) ? weight : dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortPointsByTime = (pointA, pointB) =>
//Возможно нужна проверка на null, проверить, когда будет сервер.
  dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom), 'd') - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom), 'd');
export {getRandomNumber, filter, changeDateFormat, changeDateFormatToMonth, changeDateFormatToHours, getMinutesFromDate, getHoursFromDate, getOffersByPointType,
  getPhotosByDestination, updatePoint, sortPointByDateUp, sortPointsByPrice, sortPointsByTime};
