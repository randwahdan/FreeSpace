import {
  CommonModule,
  NgForOf,
  NgIf,
  NgStyle,
  isPlatformBrowser
} from "./chunk-4AHF5A45.js";
import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-XNH7GWCF.js";
import "./chunk-BQTYKBYB.js";
import "./chunk-WI6LBH4V.js";
import "./chunk-KDOJNZN6.js";
import "./chunk-OXCW2X5T.js";

// node_modules/ngx-bootstrap/utils/fesm2022/ngx-bootstrap-utils.mjs
var win = typeof window !== "undefined" && window || {};
var document = win.document;
var location = win.location;
var gc = win.gc ? () => win.gc() : () => null;
var performance = win.performance ? win.performance : null;
var Event = win.Event;
var MouseEvent = win.MouseEvent;
var KeyboardEvent = win.KeyboardEvent;
var EventTarget = win.EventTarget;
var History = win.History;
var Location = win.Location;
var EventListener = win.EventListener;
var BsVerions;
(function(BsVerions2) {
  BsVerions2["isBs4"] = "bs4";
  BsVerions2["isBs5"] = "bs5";
})(BsVerions || (BsVerions = {}));
var guessedVersion;
function _guessBsVersion() {
  const spanEl = win.document.createElement("span");
  spanEl.innerText = "testing bs version";
  spanEl.classList.add("d-none");
  spanEl.classList.add("pl-1");
  win.document.head.appendChild(spanEl);
  const checkPadding = win.getComputedStyle(spanEl).paddingLeft;
  if (checkPadding && parseFloat(checkPadding)) {
    win.document.head.removeChild(spanEl);
    return "bs4";
  }
  win.document.head.removeChild(spanEl);
  return "bs5";
}
function isBs4() {
  if (guessedVersion)
    return guessedVersion === "bs4";
  guessedVersion = _guessBsVersion();
  return guessedVersion === "bs4";
}
function isBs5() {
  if (guessedVersion)
    return guessedVersion === "bs5";
  guessedVersion = _guessBsVersion();
  return guessedVersion === "bs5";
}
function getBsVer() {
  return {
    isBs4: isBs4(),
    isBs5: isBs5()
  };
}
var LinkedList = class {
  constructor() {
    this.length = 0;
    this.asArray = [];
  }
  get(position) {
    if (this.length === 0 || position < 0 || position >= this.length) {
      return void 0;
    }
    let current = this.head;
    for (let index = 0; index < position; index++) {
      current = current?.next;
    }
    return current?.value;
  }
  add(value, position = this.length) {
    if (position < 0 || position > this.length) {
      throw new Error("Position is out of the list");
    }
    const node = {
      value,
      next: void 0,
      previous: void 0
    };
    if (this.length === 0) {
      this.head = node;
      this.tail = node;
      this.current = node;
    } else {
      if (position === 0 && this.head) {
        node.next = this.head;
        this.head.previous = node;
        this.head = node;
      } else if (position === this.length && this.tail) {
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
      } else {
        const currentPreviousNode = this.getNode(position - 1);
        const currentNextNode = currentPreviousNode?.next;
        if (currentPreviousNode && currentNextNode) {
          currentPreviousNode.next = node;
          currentNextNode.previous = node;
          node.previous = currentPreviousNode;
          node.next = currentNextNode;
        }
      }
    }
    this.length++;
    this.createInternalArrayRepresentation();
  }
  remove(position = 0) {
    if (this.length === 0 || position < 0 || position >= this.length) {
      throw new Error("Position is out of the list");
    }
    if (position === 0 && this.head) {
      this.head = this.head.next;
      if (this.head) {
        this.head.previous = void 0;
      } else {
        this.tail = void 0;
      }
    } else if (position === this.length - 1 && this.tail?.previous) {
      this.tail = this.tail.previous;
      this.tail.next = void 0;
    } else {
      const removedNode = this.getNode(position);
      if (removedNode?.next && removedNode.previous) {
        removedNode.next.previous = removedNode.previous;
        removedNode.previous.next = removedNode.next;
      }
    }
    this.length--;
    this.createInternalArrayRepresentation();
  }
  set(position, value) {
    if (this.length === 0 || position < 0 || position >= this.length) {
      throw new Error("Position is out of the list");
    }
    const node = this.getNode(position);
    if (node) {
      node.value = value;
      this.createInternalArrayRepresentation();
    }
  }
  toArray() {
    return this.asArray;
  }
  findAll(fn) {
    let current = this.head;
    const result = [];
    if (!current) {
      return result;
    }
    for (let index = 0; index < this.length; index++) {
      if (!current) {
        return result;
      }
      if (fn(current.value, index)) {
        result.push({ index, value: current.value });
      }
      current = current.next;
    }
    return result;
  }
  // Array methods overriding start
  push(...args) {
    args.forEach((arg) => {
      this.add(arg);
    });
    return this.length;
  }
  pop() {
    if (this.length === 0) {
      return void 0;
    }
    const last = this.tail;
    this.remove(this.length - 1);
    return last?.value;
  }
  unshift(...args) {
    args.reverse();
    args.forEach((arg) => {
      this.add(arg, 0);
    });
    return this.length;
  }
  shift() {
    if (this.length === 0) {
      return void 0;
    }
    const lastItem = this.head?.value;
    this.remove();
    return lastItem;
  }
  forEach(fn) {
    let current = this.head;
    for (let index = 0; index < this.length; index++) {
      if (!current) {
        return;
      }
      fn(current.value, index);
      current = current.next;
    }
  }
  indexOf(value) {
    let current = this.head;
    let position = -1;
    for (let index = 0; index < this.length; index++) {
      if (!current) {
        return position;
      }
      if (current.value === value) {
        position = index;
        break;
      }
      current = current.next;
    }
    return position;
  }
  some(fn) {
    let current = this.head;
    let result = false;
    while (current && !result) {
      if (fn(current.value)) {
        result = true;
        break;
      }
      current = current.next;
    }
    return result;
  }
  every(fn) {
    let current = this.head;
    let result = true;
    while (current && result) {
      if (!fn(current.value)) {
        result = false;
      }
      current = current.next;
    }
    return result;
  }
  toString() {
    return "[Linked List]";
  }
  find(fn) {
    let current = this.head;
    for (let index = 0; index < this.length; index++) {
      if (!current) {
        return;
      }
      if (fn(current.value, index)) {
        return current.value;
      }
      current = current.next;
    }
  }
  findIndex(fn) {
    let current = this.head;
    for (let index = 0; index < this.length; index++) {
      if (!current) {
        return -1;
      }
      if (fn(current.value, index)) {
        return index;
      }
      current = current.next;
    }
    return -1;
  }
  getNode(position) {
    if (this.length === 0 || position < 0 || position >= this.length) {
      throw new Error("Position is out of the list");
    }
    let current = this.head;
    for (let index = 0; index < position; index++) {
      current = current?.next;
    }
    return current;
  }
  createInternalArrayRepresentation() {
    const outArray = [];
    let current = this.head;
    while (current) {
      outArray.push(current.value);
      current = current.next;
    }
    this.asArray = outArray;
  }
};
var _hideMsg = typeof console === "undefined" || !("warn" in console);

// node_modules/ngx-bootstrap/carousel/fesm2022/ngx-bootstrap-carousel.mjs
function CarouselComponent_ng_container_1_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "li", 7);
    ɵɵlistener("click", function CarouselComponent_ng_container_1_li_2_Template_li_click_0_listener() {
      const restoredCtx = ɵɵrestoreView(_r8);
      const i_r6 = restoredCtx.index;
      const ctx_r7 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r7.selectSlide(i_r6));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const slide_r5 = ctx.$implicit;
    ɵɵclassProp("active", slide_r5.active === true);
  }
}
function CarouselComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelementStart(1, "ol", 5);
    ɵɵtemplate(2, CarouselComponent_ng_container_1_li_2_Template, 1, 2, "li", 6);
    ɵɵelementEnd();
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵproperty("ngForOf", ctx_r0.indicatorsSlides());
  }
}
function CarouselComponent_ng_container_2_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 9);
    ɵɵlistener("click", function CarouselComponent_ng_container_2_button_2_Template_button_click_0_listener() {
      const restoredCtx = ɵɵrestoreView(_r13);
      const i_r11 = restoredCtx.index;
      const ctx_r12 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r12.selectSlide(i_r11));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const slide_r10 = ctx.$implicit;
    const i_r11 = ctx.index;
    const ctx_r9 = ɵɵnextContext(2);
    ɵɵclassProp("active", slide_r10.active === true);
    ɵɵattribute("data-bs-target", "#carousel" + ctx_r9.currentId)("data-bs-slide-to", i_r11);
  }
}
function CarouselComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelementStart(1, "div", 5);
    ɵɵtemplate(2, CarouselComponent_ng_container_2_button_2_Template, 1, 4, "button", 8);
    ɵɵelementEnd();
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵproperty("ngForOf", ctx_r1.indicatorsSlides());
  }
}
function CarouselComponent_a_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 10);
    ɵɵlistener("click", function CarouselComponent_a_5_Template_a_click_0_listener() {
      ɵɵrestoreView(_r15);
      const ctx_r14 = ɵɵnextContext();
      return ɵɵresetView(ctx_r14.previousSlide());
    });
    ɵɵelement(1, "span", 11);
    ɵɵelementStart(2, "span", 12);
    ɵɵtext(3, "Previous");
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassProp("disabled", ctx_r2.checkDisabledClass("prev"));
    ɵɵattribute("data-bs-target", "#carousel" + ctx_r2.currentId);
  }
}
function CarouselComponent_a_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 13);
    ɵɵlistener("click", function CarouselComponent_a_6_Template_a_click_0_listener() {
      ɵɵrestoreView(_r17);
      const ctx_r16 = ɵɵnextContext();
      return ɵɵresetView(ctx_r16.nextSlide());
    });
    ɵɵelement(1, "span", 14);
    ɵɵelementStart(2, "span", 12);
    ɵɵtext(3, "Next");
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = ɵɵnextContext();
    ɵɵclassProp("disabled", ctx_r3.checkDisabledClass("next"));
    ɵɵattribute("data-bs-target", "#carousel" + ctx_r3.currentId);
  }
}
var _c0 = (a0) => ({
  "display": a0
});
var _c1 = ["*"];
var _CarouselConfig = class _CarouselConfig {
  constructor() {
    this.interval = 5e3;
    this.noPause = false;
    this.noWrap = false;
    this.showIndicators = true;
    this.pauseOnFocus = false;
    this.indicatorsByChunk = false;
    this.itemsPerSlide = 1;
    this.singleSlideOffset = false;
  }
};
_CarouselConfig.ɵfac = function CarouselConfig_Factory(t) {
  return new (t || _CarouselConfig)();
};
_CarouselConfig.ɵprov = ɵɵdefineInjectable({
  token: _CarouselConfig,
  factory: _CarouselConfig.ɵfac,
  providedIn: "root"
});
var CarouselConfig = _CarouselConfig;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function findLastIndex(array, predicate) {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) {
      return l;
    }
  }
  return -1;
}
function chunkByNumber(array, size) {
  const out = [];
  const n = Math.ceil(array.length / size);
  let i = 0;
  while (i < n) {
    const chunk = array.splice(0, i === n - 1 && size < array.length ? array.length : size);
    out.push(chunk);
    i++;
  }
  return out;
}
function isNumber(value) {
  return typeof value === "number" || Object.prototype.toString.call(value) === "[object Number]";
}
var Direction;
(function(Direction2) {
  Direction2[Direction2["UNKNOWN"] = 0] = "UNKNOWN";
  Direction2[Direction2["NEXT"] = 1] = "NEXT";
  Direction2[Direction2["PREV"] = 2] = "PREV";
})(Direction || (Direction = {}));
var _currentId = 1;
var _CarouselComponent = class _CarouselComponent {
  /** Index of currently displayed slide(started for 0) */
  set activeSlide(index) {
    if (this.multilist) {
      return;
    }
    if (isNumber(index)) {
      this.customActiveSlide = index;
    }
    if (this._slides.length && index !== this._currentActiveSlide) {
      this._select(index);
    }
  }
  get activeSlide() {
    return this._currentActiveSlide || 0;
  }
  /**
   * Delay of item cycling in milliseconds. If false, carousel won't cycle
   * automatically.
   */
  get interval() {
    return this._interval;
  }
  set interval(value) {
    this._interval = value;
    this.restartTimer();
  }
  get slides() {
    return this._slides.toArray();
  }
  get isFirstSlideVisible() {
    const indexes = this.getVisibleIndexes();
    if (!indexes || indexes instanceof Array && !indexes.length) {
      return false;
    }
    return indexes.includes(0);
  }
  get isLastSlideVisible() {
    const indexes = this.getVisibleIndexes();
    if (!indexes || indexes instanceof Array && !indexes.length) {
      return false;
    }
    return indexes.includes(this._slides.length - 1);
  }
  get _bsVer() {
    return getBsVer();
  }
  constructor(config, ngZone, platformId) {
    this.ngZone = ngZone;
    this.platformId = platformId;
    this.noWrap = false;
    this.noPause = false;
    this.showIndicators = true;
    this.pauseOnFocus = false;
    this.indicatorsByChunk = false;
    this.itemsPerSlide = 1;
    this.singleSlideOffset = false;
    this.isAnimated = false;
    this.activeSlideChange = new EventEmitter(false);
    this.slideRangeChange = new EventEmitter();
    this.startFromIndex = 0;
    this._interval = 5e3;
    this._slides = new LinkedList();
    this._currentVisibleSlidesIndex = 0;
    this.isPlaying = false;
    this.destroyed = false;
    this.currentId = 0;
    this.getActive = (slide) => slide.active;
    this.makeSlidesConsistent = (slides) => {
      slides.forEach((slide, index) => slide.item.order = index);
    };
    Object.assign(this, config);
    this.currentId = _currentId++;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.singleSlideOffset) {
        this.indicatorsByChunk = false;
      }
      if (this.multilist) {
        this._chunkedSlides = chunkByNumber(this.mapSlidesAndIndexes(), this.itemsPerSlide);
        this.selectInitialSlides();
      }
      if (this.customActiveSlide && !this.multilist) {
        this._select(this.customActiveSlide);
      }
    }, 0);
  }
  ngOnDestroy() {
    this.destroyed = true;
  }
  /**
   * Adds new slide. If this slide is first in collection - set it as active
   * and starts auto changing
   * @param slide
   */
  addSlide(slide) {
    this._slides.add(slide);
    if (this.multilist && this._slides.length <= this.itemsPerSlide) {
      slide.active = true;
    }
    if (!this.multilist && this.isAnimated) {
      slide.isAnimated = true;
    }
    if (!this.multilist && this._slides.length === 1) {
      this._currentActiveSlide = void 0;
      if (!this.customActiveSlide) {
        this.activeSlide = 0;
      }
      this.play();
    }
    if (this.multilist && this._slides.length > this.itemsPerSlide) {
      this.play();
    }
  }
  /**
   * Removes specified slide. If this slide is active - will roll to another
   * slide
   * @param slide
   */
  removeSlide(slide) {
    const remIndex = this._slides.indexOf(slide);
    if (this._currentActiveSlide === remIndex) {
      let nextSlideIndex;
      if (this._slides.length > 1) {
        nextSlideIndex = !this.isLast(remIndex) ? remIndex : this.noWrap ? remIndex - 1 : 0;
      }
      this._slides.remove(remIndex);
      setTimeout(() => {
        this._select(nextSlideIndex);
      }, 0);
    } else {
      this._slides.remove(remIndex);
      const currentSlideIndex = this.getCurrentSlideIndex();
      setTimeout(() => {
        this._currentActiveSlide = currentSlideIndex;
        this.activeSlideChange.emit(this._currentActiveSlide);
      }, 0);
    }
  }
  nextSlideFromInterval(force = false) {
    this.move(Direction.NEXT, force);
  }
  /**
   * Rolling to next slide
   * @param force: {boolean} if true - will ignore noWrap flag
   */
  nextSlide(force = false) {
    if (this.isPlaying) {
      this.restartTimer();
    }
    this.move(Direction.NEXT, force);
  }
  /**
   * Rolling to previous slide
   * @param force: {boolean} if true - will ignore noWrap flag
   */
  previousSlide(force = false) {
    if (this.isPlaying) {
      this.restartTimer();
    }
    this.move(Direction.PREV, force);
  }
  getFirstVisibleIndex() {
    return this.slides.findIndex(this.getActive);
  }
  getLastVisibleIndex() {
    return findLastIndex(this.slides, this.getActive);
  }
  move(direction, force = false) {
    const firstVisibleIndex = this.getFirstVisibleIndex();
    const lastVisibleIndex = this.getLastVisibleIndex();
    if (this.noWrap) {
      if (direction === Direction.NEXT && this.isLast(lastVisibleIndex) || direction === Direction.PREV && firstVisibleIndex === 0) {
        return;
      }
    }
    if (!this.multilist) {
      this.activeSlide = this.findNextSlideIndex(direction, force) || 0;
    } else {
      this.moveMultilist(direction);
    }
  }
  /**
   * Swith slides by enter, space and arrows keys
   * @internal
   */
  keydownPress(event) {
    if (event.keyCode === 13 || event.key === "Enter" || event.keyCode === 32 || event.key === "Space") {
      this.nextSlide();
      event.preventDefault();
      return;
    }
    if (event.keyCode === 37 || event.key === "LeftArrow") {
      this.previousSlide();
      return;
    }
    if (event.keyCode === 39 || event.key === "RightArrow") {
      this.nextSlide();
      return;
    }
  }
  /**
   * Play on mouse leave
   * @internal
   */
  onMouseLeave() {
    if (!this.pauseOnFocus) {
      this.play();
    }
  }
  /**
   * Play on mouse up
   * @internal
   */
  onMouseUp() {
    if (!this.pauseOnFocus) {
      this.play();
    }
  }
  /**
   * When slides on focus autoplay is stopped(optional)
   * @internal
   */
  pauseFocusIn() {
    if (this.pauseOnFocus) {
      this.isPlaying = false;
      this.resetTimer();
    }
  }
  /**
   * When slides out of focus autoplay is started
   * @internal
   */
  pauseFocusOut() {
    this.play();
  }
  /**
   * Rolling to specified slide
   * @param index: {number} index of slide, which must be shown
   */
  selectSlide(index) {
    if (this.isPlaying) {
      this.restartTimer();
    }
    if (!this.multilist) {
      this.activeSlide = this.indicatorsByChunk ? index * this.itemsPerSlide : index;
    } else {
      this.selectSlideRange(this.indicatorsByChunk ? index * this.itemsPerSlide : index);
    }
  }
  /**
   * Starts a auto changing of slides
   */
  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.restartTimer();
    }
  }
  /**
   * Stops a auto changing of slides
   */
  pause() {
    if (!this.noPause) {
      this.isPlaying = false;
      this.resetTimer();
    }
  }
  /**
   * Finds and returns index of currently displayed slide
   */
  getCurrentSlideIndex() {
    return this._slides.findIndex(this.getActive);
  }
  /**
   * Defines, whether the specified index is last in collection
   * @param index
   */
  isLast(index) {
    return index + 1 >= this._slides.length;
  }
  /**
   * Defines, whether the specified index is first in collection
   * @param index
   */
  isFirst(index) {
    return index === 0;
  }
  indicatorsSlides() {
    return this.slides.filter((slide, index) => !this.indicatorsByChunk || index % this.itemsPerSlide === 0);
  }
  selectInitialSlides() {
    const startIndex = this.startFromIndex <= this._slides.length ? this.startFromIndex : 0;
    this.hideSlides();
    if (this.singleSlideOffset) {
      this._slidesWithIndexes = this.mapSlidesAndIndexes();
      if (this._slides.length - startIndex < this.itemsPerSlide) {
        const slidesToAppend = this._slidesWithIndexes.slice(0, startIndex);
        this._slidesWithIndexes = [...this._slidesWithIndexes, ...slidesToAppend].slice(slidesToAppend.length).slice(0, this.itemsPerSlide);
      } else {
        this._slidesWithIndexes = this._slidesWithIndexes.slice(startIndex, startIndex + this.itemsPerSlide);
      }
      this._slidesWithIndexes.forEach((slide) => slide.item.active = true);
      this.makeSlidesConsistent(this._slidesWithIndexes);
    } else {
      this.selectRangeByNestedIndex(startIndex);
    }
    this.slideRangeChange.emit(this.getVisibleIndexes());
  }
  /**
   * Defines next slide index, depending of direction
   * @param direction: Direction(UNKNOWN|PREV|NEXT)
   * @param force: {boolean} if TRUE - will ignore noWrap flag, else will
   *   return undefined if next slide require wrapping
   */
  findNextSlideIndex(direction, force) {
    let nextSlideIndex = 0;
    if (!force && this.isLast(this.activeSlide) && direction !== Direction.PREV && this.noWrap) {
      return;
    }
    switch (direction) {
      case Direction.NEXT:
        if (typeof this._currentActiveSlide === "undefined") {
          nextSlideIndex = 0;
          break;
        }
        if (!this.isLast(this._currentActiveSlide)) {
          nextSlideIndex = this._currentActiveSlide + 1;
          break;
        }
        nextSlideIndex = !force && this.noWrap ? this._currentActiveSlide : 0;
        break;
      case Direction.PREV:
        if (typeof this._currentActiveSlide === "undefined") {
          nextSlideIndex = 0;
          break;
        }
        if (this._currentActiveSlide > 0) {
          nextSlideIndex = this._currentActiveSlide - 1;
          break;
        }
        if (!force && this.noWrap) {
          nextSlideIndex = this._currentActiveSlide;
          break;
        }
        nextSlideIndex = this._slides.length - 1;
        break;
      default:
        throw new Error("Unknown direction");
    }
    return nextSlideIndex;
  }
  mapSlidesAndIndexes() {
    return this.slides.slice().map((slide, index) => {
      return {
        index,
        item: slide
      };
    });
  }
  selectSlideRange(index) {
    if (this.isIndexInRange(index)) {
      return;
    }
    this.hideSlides();
    if (!this.singleSlideOffset) {
      this.selectRangeByNestedIndex(index);
    } else {
      const startIndex = this.isIndexOnTheEdges(index) ? index : index - this.itemsPerSlide + 1;
      const endIndex = this.isIndexOnTheEdges(index) ? index + this.itemsPerSlide : index + 1;
      this._slidesWithIndexes = this.mapSlidesAndIndexes().slice(startIndex, endIndex);
      this.makeSlidesConsistent(this._slidesWithIndexes);
      this._slidesWithIndexes.forEach((slide) => slide.item.active = true);
    }
    this.slideRangeChange.emit(this.getVisibleIndexes());
  }
  selectRangeByNestedIndex(index) {
    if (!this._chunkedSlides) {
      return;
    }
    const selectedRange = this._chunkedSlides.map((slidesList, i) => {
      return {
        index: i,
        list: slidesList
      };
    }).find((slidesList) => {
      return slidesList.list.find((slide) => slide.index === index) !== void 0;
    });
    if (!selectedRange) {
      return;
    }
    this._currentVisibleSlidesIndex = selectedRange.index;
    this._chunkedSlides[selectedRange.index].forEach((slide) => {
      slide.item.active = true;
    });
  }
  isIndexOnTheEdges(index) {
    return index + 1 - this.itemsPerSlide <= 0 || index + this.itemsPerSlide <= this._slides.length;
  }
  isIndexInRange(index) {
    if (this.singleSlideOffset && this._slidesWithIndexes) {
      const visibleIndexes = this._slidesWithIndexes.map((slide) => slide.index);
      return visibleIndexes.indexOf(index) >= 0;
    }
    return index <= this.getLastVisibleIndex() && index >= this.getFirstVisibleIndex();
  }
  hideSlides() {
    this.slides.forEach((slide) => slide.active = false);
  }
  isVisibleSlideListLast() {
    if (!this._chunkedSlides) {
      return false;
    }
    return this._currentVisibleSlidesIndex === this._chunkedSlides.length - 1;
  }
  isVisibleSlideListFirst() {
    return this._currentVisibleSlidesIndex === 0;
  }
  moveSliderByOneItem(direction) {
    let firstVisibleIndex;
    let lastVisibleIndex;
    let indexToHide;
    let indexToShow;
    if (this.noWrap) {
      firstVisibleIndex = this.getFirstVisibleIndex();
      lastVisibleIndex = this.getLastVisibleIndex();
      indexToHide = direction === Direction.NEXT ? firstVisibleIndex : lastVisibleIndex;
      indexToShow = direction !== Direction.NEXT ? firstVisibleIndex - 1 : !this.isLast(lastVisibleIndex) ? lastVisibleIndex + 1 : 0;
      const slideToHide = this._slides.get(indexToHide);
      if (slideToHide) {
        slideToHide.active = false;
      }
      const slideToShow = this._slides.get(indexToShow);
      if (slideToShow) {
        slideToShow.active = true;
      }
      const slidesToReorder = this.mapSlidesAndIndexes().filter((slide) => slide.item.active);
      this.makeSlidesConsistent(slidesToReorder);
      if (this.singleSlideOffset) {
        this._slidesWithIndexes = slidesToReorder;
      }
      this.slideRangeChange.emit(this.getVisibleIndexes());
      return;
    }
    if (!this._slidesWithIndexes || !this._slidesWithIndexes[0]) {
      return;
    }
    let index;
    firstVisibleIndex = this._slidesWithIndexes[0].index;
    lastVisibleIndex = this._slidesWithIndexes[this._slidesWithIndexes.length - 1].index;
    if (direction === Direction.NEXT) {
      this._slidesWithIndexes.shift();
      index = this.isLast(lastVisibleIndex) ? 0 : lastVisibleIndex + 1;
      const item = this._slides.get(index);
      if (item) {
        this._slidesWithIndexes.push({
          index,
          item
        });
      }
    } else {
      this._slidesWithIndexes.pop();
      index = this.isFirst(firstVisibleIndex) ? this._slides.length - 1 : firstVisibleIndex - 1;
      const item = this._slides.get(index);
      if (item) {
        this._slidesWithIndexes = [{
          index,
          item
        }, ...this._slidesWithIndexes];
      }
    }
    this.hideSlides();
    this._slidesWithIndexes.forEach((slide) => slide.item.active = true);
    this.makeSlidesConsistent(this._slidesWithIndexes);
    this.slideRangeChange.emit(this._slidesWithIndexes.map((slide) => slide.index));
  }
  moveMultilist(direction) {
    if (this.singleSlideOffset) {
      this.moveSliderByOneItem(direction);
    } else {
      this.hideSlides();
      if (this.noWrap) {
        this._currentVisibleSlidesIndex = direction === Direction.NEXT ? this._currentVisibleSlidesIndex + 1 : this._currentVisibleSlidesIndex - 1;
      } else if (direction === Direction.NEXT) {
        this._currentVisibleSlidesIndex = this.isVisibleSlideListLast() ? 0 : this._currentVisibleSlidesIndex + 1;
      } else {
        if (this.isVisibleSlideListFirst()) {
          this._currentVisibleSlidesIndex = this._chunkedSlides ? this._chunkedSlides.length - 1 : 0;
        } else {
          this._currentVisibleSlidesIndex = this._currentVisibleSlidesIndex - 1;
        }
      }
      if (this._chunkedSlides) {
        this._chunkedSlides[this._currentVisibleSlidesIndex].forEach((slide) => slide.item.active = true);
      }
      this.slideRangeChange.emit(this.getVisibleIndexes());
    }
  }
  getVisibleIndexes() {
    if (!this.singleSlideOffset && this._chunkedSlides) {
      return this._chunkedSlides[this._currentVisibleSlidesIndex].map((slide) => slide.index);
    }
    if (this._slidesWithIndexes) {
      return this._slidesWithIndexes.map((slide) => slide.index);
    }
  }
  /**
   * Sets a slide, which specified through index, as active
   * @param index
   */
  _select(index) {
    if (isNaN(index)) {
      this.pause();
      return;
    }
    if (!this.multilist && typeof this._currentActiveSlide !== "undefined") {
      const currentSlide = this._slides.get(this._currentActiveSlide);
      if (typeof currentSlide !== "undefined") {
        currentSlide.active = false;
      }
    }
    const nextSlide = this._slides.get(index);
    if (typeof nextSlide !== "undefined") {
      this._currentActiveSlide = index;
      nextSlide.active = true;
      this.activeSlide = index;
      this.activeSlideChange.emit(index);
    }
  }
  /**
   * Starts loop of auto changing of slides
   */
  restartTimer() {
    this.resetTimer();
    const interval = +this.interval;
    if (!isNaN(interval) && interval > 0 && isPlatformBrowser(this.platformId)) {
      this.currentInterval = this.ngZone.runOutsideAngular(() => {
        return window.setInterval(() => {
          const nInterval = +this.interval;
          this.ngZone.run(() => {
            if (this.isPlaying && !isNaN(this.interval) && nInterval > 0 && this.slides.length) {
              this.nextSlideFromInterval();
            } else {
              this.pause();
            }
          });
        }, interval);
      });
    }
  }
  get multilist() {
    return this.itemsPerSlide > 1;
  }
  /**
   * Stops loop of auto changing of slides
   */
  resetTimer() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = void 0;
    }
  }
  checkDisabledClass(buttonType) {
    if (buttonType === "prev") {
      return this.activeSlide === 0 && this.noWrap && !this.multilist || this.isFirstSlideVisible && this.noWrap && this.multilist;
    }
    return this.isLast(this.activeSlide) && this.noWrap && !this.multilist || this.isLastSlideVisible && this.noWrap && this.multilist;
  }
};
_CarouselComponent.ɵfac = function CarouselComponent_Factory(t) {
  return new (t || _CarouselComponent)(ɵɵdirectiveInject(CarouselConfig), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(PLATFORM_ID));
};
_CarouselComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselComponent,
  selectors: [["carousel"]],
  inputs: {
    noWrap: "noWrap",
    noPause: "noPause",
    showIndicators: "showIndicators",
    pauseOnFocus: "pauseOnFocus",
    indicatorsByChunk: "indicatorsByChunk",
    itemsPerSlide: "itemsPerSlide",
    singleSlideOffset: "singleSlideOffset",
    isAnimated: "isAnimated",
    activeSlide: "activeSlide",
    startFromIndex: "startFromIndex",
    interval: "interval"
  },
  outputs: {
    activeSlideChange: "activeSlideChange",
    slideRangeChange: "slideRangeChange"
  },
  ngContentSelectors: _c1,
  decls: 7,
  vars: 8,
  consts: [["tabindex", "0", 1, "carousel", "slide", 3, "id", "mouseenter", "mouseleave", "mouseup", "keydown", "focusin", "focusout"], [4, "ngIf"], [1, "carousel-inner", 3, "ngStyle"], ["class", "left carousel-control carousel-control-prev", "href", "javascript:void(0);", "tabindex", "0", "role", "button", 3, "disabled", "click", 4, "ngIf"], ["class", "right carousel-control carousel-control-next", "href", "javascript:void(0);", "tabindex", "0", "role", "button", 3, "disabled", "click", 4, "ngIf"], [1, "carousel-indicators"], [3, "active", "click", 4, "ngFor", "ngForOf"], [3, "click"], ["type", "button", "aria-current", "true", 3, "active", "click", 4, "ngFor", "ngForOf"], ["type", "button", "aria-current", "true", 3, "click"], ["href", "javascript:void(0);", "tabindex", "0", "role", "button", 1, "left", "carousel-control", "carousel-control-prev", 3, "click"], ["aria-hidden", "true", 1, "icon-prev", "carousel-control-prev-icon"], [1, "sr-only", "visually-hidden"], ["href", "javascript:void(0);", "tabindex", "0", "role", "button", 1, "right", "carousel-control", "carousel-control-next", 3, "click"], ["aria-hidden", "true", 1, "icon-next", "carousel-control-next-icon"]],
  template: function CarouselComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "div", 0);
      ɵɵlistener("mouseenter", function CarouselComponent_Template_div_mouseenter_0_listener() {
        return ctx.pause();
      })("mouseleave", function CarouselComponent_Template_div_mouseleave_0_listener() {
        return ctx.onMouseLeave();
      })("mouseup", function CarouselComponent_Template_div_mouseup_0_listener() {
        return ctx.onMouseUp();
      })("keydown", function CarouselComponent_Template_div_keydown_0_listener($event) {
        return ctx.keydownPress($event);
      })("focusin", function CarouselComponent_Template_div_focusin_0_listener() {
        return ctx.pauseFocusIn();
      })("focusout", function CarouselComponent_Template_div_focusout_0_listener() {
        return ctx.pauseFocusOut();
      });
      ɵɵtemplate(1, CarouselComponent_ng_container_1_Template, 3, 1, "ng-container", 1)(2, CarouselComponent_ng_container_2_Template, 3, 1, "ng-container", 1);
      ɵɵelementStart(3, "div", 2);
      ɵɵprojection(4);
      ɵɵelementEnd();
      ɵɵtemplate(5, CarouselComponent_a_5_Template, 4, 3, "a", 3)(6, CarouselComponent_a_6_Template, 4, 3, "a", 4);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵproperty("id", "carousel" + ctx.currentId);
      ɵɵadvance(1);
      ɵɵproperty("ngIf", !ctx._bsVer.isBs5 && ctx.showIndicators && ctx.slides.length > 1);
      ɵɵadvance(1);
      ɵɵproperty("ngIf", ctx._bsVer.isBs5 && ctx.showIndicators && ctx.slides.length > 1);
      ɵɵadvance(1);
      ɵɵproperty("ngStyle", ɵɵpureFunction1(6, _c0, ctx.multilist ? "flex" : "block"));
      ɵɵadvance(2);
      ɵɵproperty("ngIf", ctx.slides.length > 1);
      ɵɵadvance(1);
      ɵɵproperty("ngIf", ctx.slides.length > 1);
    }
  },
  dependencies: [NgForOf, NgIf, NgStyle],
  encapsulation: 2
});
var CarouselComponent = _CarouselComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselComponent, [{
    type: Component,
    args: [{
      selector: "carousel",
      template: `<div (mouseenter)="pause()"
     (mouseleave)="onMouseLeave()"
     (mouseup)="onMouseUp()"
     (keydown)="keydownPress($event)"
     (focusin)="pauseFocusIn()"
     (focusout)="pauseFocusOut()"
     [id]="'carousel' + currentId"
     class="carousel slide" tabindex="0">
  <ng-container *ngIf="!_bsVer.isBs5 && showIndicators && slides.length > 1">
    <ol class="carousel-indicators">
      <li *ngFor="let slide of indicatorsSlides(); let i = index;"
          [class.active]="slide.active === true"
          (click)="selectSlide(i)">
      </li>
    </ol>
  </ng-container>
  <ng-container *ngIf="_bsVer.isBs5 && showIndicators && slides.length > 1">
    <div class="carousel-indicators">
      <button
        *ngFor="let slide of indicatorsSlides(); let i = index;"
        [class.active]="slide.active === true"
        (click)="selectSlide(i)"
        type="button"
        [attr.data-bs-target]="'#carousel' + currentId"
        [attr.data-bs-slide-to]="i" aria-current="true"
      >
      </button>
    </div>
  </ng-container>
  <div class="carousel-inner" [ngStyle]="{'display': multilist ? 'flex' : 'block'}">
    <ng-content></ng-content>
  </div>
  <a class="left carousel-control carousel-control-prev"
     href="javascript:void(0);"
     [class.disabled]="checkDisabledClass('prev')"
     [attr.data-bs-target]="'#carousel' + currentId"
     *ngIf="slides.length > 1"
     (click)="previousSlide()"
     tabindex="0" role="button">
    <span class="icon-prev carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only visually-hidden">Previous</span>
  </a>

  <a class="right carousel-control carousel-control-next"
     href="javascript:void(0);"
     *ngIf="slides.length > 1"
     (click)="nextSlide()"
     [class.disabled]="checkDisabledClass('next')"
     [attr.data-bs-target]="'#carousel' + currentId"
     tabindex="0" role="button">
    <span class="icon-next carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only visually-hidden">Next</span>
  </a>
</div>
`
    }]
  }], () => [{
    type: CarouselConfig
  }, {
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], {
    noWrap: [{
      type: Input
    }],
    noPause: [{
      type: Input
    }],
    showIndicators: [{
      type: Input
    }],
    pauseOnFocus: [{
      type: Input
    }],
    indicatorsByChunk: [{
      type: Input
    }],
    itemsPerSlide: [{
      type: Input
    }],
    singleSlideOffset: [{
      type: Input
    }],
    isAnimated: [{
      type: Input
    }],
    activeSlideChange: [{
      type: Output
    }],
    slideRangeChange: [{
      type: Output
    }],
    activeSlide: [{
      type: Input
    }],
    startFromIndex: [{
      type: Input
    }],
    interval: [{
      type: Input
    }]
  });
})();
var _SlideComponent = class _SlideComponent {
  constructor(carousel) {
    this.active = false;
    this.itemWidth = "100%";
    this.order = 0;
    this.isAnimated = false;
    this.addClass = true;
    this.multilist = false;
    this.carousel = carousel;
  }
  /** Fires changes in container collection after adding a new slide instance */
  ngOnInit() {
    this.carousel.addSlide(this);
    this.itemWidth = `${100 / this.carousel.itemsPerSlide}%`;
    this.multilist = this.carousel?.itemsPerSlide > 1;
  }
  /** Fires changes in container collection after removing of this slide instance */
  ngOnDestroy() {
    this.carousel.removeSlide(this);
  }
};
_SlideComponent.ɵfac = function SlideComponent_Factory(t) {
  return new (t || _SlideComponent)(ɵɵdirectiveInject(CarouselComponent));
};
_SlideComponent.ɵcmp = ɵɵdefineComponent({
  type: _SlideComponent,
  selectors: [["slide"]],
  hostVars: 15,
  hostBindings: function SlideComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-hidden", !ctx.active);
      ɵɵstyleProp("width", ctx.itemWidth)("order", ctx.order);
      ɵɵclassProp("multilist-margin", ctx.multilist)("active", ctx.active)("carousel-animation", ctx.isAnimated)("item", ctx.addClass)("carousel-item", ctx.addClass);
    }
  },
  inputs: {
    active: "active"
  },
  ngContentSelectors: _c1,
  decls: 2,
  vars: 2,
  consts: [[1, "item"]],
  template: function SlideComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "div", 0);
      ɵɵprojection(1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵclassProp("active", ctx.active);
    }
  },
  styles: [".carousel-animation[_nghost-%COMP%]{transition:opacity .6s ease,visibility .6s ease;float:left}.carousel-animation.active[_nghost-%COMP%]{opacity:1;visibility:visible}.carousel-animation[_nghost-%COMP%]:not(.active){display:block;position:absolute;opacity:0;visibility:hidden}.multilist-margin[_nghost-%COMP%]{margin-right:auto}.carousel-item[_nghost-%COMP%]{perspective:1000px}"]
});
var SlideComponent = _SlideComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SlideComponent, [{
    type: Component,
    args: [{
      selector: "slide",
      template: `
    <div [class.active]="active" class="item">
      <ng-content></ng-content>
    </div>
  `,
      host: {
        "[attr.aria-hidden]": "!active",
        "[class.multilist-margin]": "multilist"
      },
      styles: [":host.carousel-animation{transition:opacity .6s ease,visibility .6s ease;float:left}:host.carousel-animation.active{opacity:1;visibility:visible}:host.carousel-animation:not(.active){display:block;position:absolute;opacity:0;visibility:hidden}:host.multilist-margin{margin-right:auto}:host.carousel-item{perspective:1000px}\n"]
    }]
  }], () => [{
    type: CarouselComponent
  }], {
    active: [{
      type: HostBinding,
      args: ["class.active"]
    }, {
      type: Input
    }],
    itemWidth: [{
      type: HostBinding,
      args: ["style.width"]
    }],
    order: [{
      type: HostBinding,
      args: ["style.order"]
    }],
    isAnimated: [{
      type: HostBinding,
      args: ["class.carousel-animation"]
    }],
    addClass: [{
      type: HostBinding,
      args: ["class.item"]
    }, {
      type: HostBinding,
      args: ["class.carousel-item"]
    }]
  });
})();
var _CarouselModule = class _CarouselModule {
  static forRoot() {
    return {
      ngModule: _CarouselModule,
      providers: []
    };
  }
};
_CarouselModule.ɵfac = function CarouselModule_Factory(t) {
  return new (t || _CarouselModule)();
};
_CarouselModule.ɵmod = ɵɵdefineNgModule({
  type: _CarouselModule,
  declarations: [SlideComponent, CarouselComponent],
  imports: [CommonModule],
  exports: [SlideComponent, CarouselComponent]
});
_CarouselModule.ɵinj = ɵɵdefineInjector({
  imports: [CommonModule]
});
var CarouselModule = _CarouselModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [SlideComponent, CarouselComponent],
      exports: [SlideComponent, CarouselComponent]
    }]
  }], null, null);
})();
export {
  CarouselComponent,
  CarouselConfig,
  CarouselModule,
  SlideComponent
};
/*! Bundled license information:

ngx-bootstrap/utils/fesm2022/ngx-bootstrap-utils.mjs:
  (**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   *)
*/
//# sourceMappingURL=ngx-bootstrap_carousel.js.map
