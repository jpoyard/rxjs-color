import { BehaviorSubject, from, fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil, toArray } from 'rxjs/operators';
import { Color } from './color.interface';

interface ActiveColor {
  index: number;
  color: Color;
}

export class ColorsList {
  private source: Observable<Color>;
  private colors = new BehaviorSubject<Color[]>([]);
  private active: ActiveColor = { color: null, index: null };
  private color$ = new Subject<Color>();

  constructor(
    private ulElement: HTMLUListElement,
    private colorsMap: Map<string, Color>
  ) {
    this.source = from(Array.from(this.colorsMap.values()));
    this.filter(null);
  }

  /**
   * initialize component
   */
  public init() {
    this.colors.subscribe(colors => {
      if (colors && colors.length > 0) {
        this.setColor(colors[0]);
      } else {
        this.update(colors);
      }
    });
  }

  /**
   * Select color by index
   * @param index
   */
  private setColorByIndex(index: number) {
    this.colors.subscribe(colors => {
      try {
        const color = colors[index];
        if (color) {
          this.setColor(color);
        }
      } catch (e) {}
    });
  }

  /**
   * update list of colors
   */
  private update(colors: Color[]) {
    let liActiveColor: HTMLLIElement = null;
    this.ulElement.innerHTML = null;
    colors.forEach((color, index) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      if (color.active) {
        this.active.index = index;
        li.classList.add('active');
        liActiveColor = li;
      }
      li.innerHTML = color.name;
      fromEvent(li, 'click')
        .pipe(takeUntil(this.color))
        .subscribe(() => this.setColor(color));
      this.ulElement.appendChild(li);
    });

    if (liActiveColor) {
      liActiveColor.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * filter color according to given term
   * @param term
   */
  public filter(term: string) {
    this.source
      .pipe(
        filter(color => !term || color.name.toLocaleLowerCase().includes(term)),
        toArray()
      )
      .subscribe(colors => this.colors.next(colors));
  }

  /**
   * notify when color changed
   */
  public get color(): Observable<Color> {
    return this.color$.asObservable();
  }

  /**
   * Define selected color
   * @param color
   */
  public setColor(color: Color) {
    if (this.active.color) {
      this.active.color.active = false;
    }
    this.active.color = color;
    this.active.color.active = true;

    this.color$.next(this.active.color);

    this.colors.subscribe(colors => this.update(colors));
  }

  /**
   * Select previous color
   */
  public previousColor() {
    this.setColorByIndex(this.active.index - 1);
  }

  /**
   * Select next color
   */
  public nextColor() {
    this.setColorByIndex(this.active.index + 1);
  }
}
