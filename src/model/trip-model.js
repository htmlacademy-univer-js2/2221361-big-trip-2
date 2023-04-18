import { createPointDescription } from '../mock/mocks.js';

export default class TripModel {
  constructor() {
    this._points = Array.from({length:3}, createPointDescription);
  }

  get points() {
    return this._points;
  }
}