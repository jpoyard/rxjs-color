import { Observable } from 'rxjs';
import { Color } from './color.interface';
import { ColorsMap } from './colors.data';

interface ActiveColor {
  index: number;
  color: Color;
}

export class ColorsList {
  private source: Observable<Color[]>;
  private colors: Color[];
  private active: ActiveColor = { color: null, index: null };

  constructor(
    private ulElement: HTMLUListElement,
    private colorsMap: Map<string, Color>
  ) {
    this.source = new Observable<Color[]>(observer => {
      observer.next(Array.from(this.colorsMap.values()));
      observer.complete();
    });
    this.source.subscribe(colors => (this.colors = colors));
  }

  /**
   * initialize component
   */
  public init() {
    const colors = this.colors;

    if (colors && colors.length > 0) {
      this.setColor(colors[0]);
    } else {
      this.update(colors);
    }
  }

  /**
   * Select color by index
   * @param index
   */
  private setColorByIndex(index: number) {
    const colors = this.colors;
    try {
      const color = colors[index];
      if (color) {
        this.setColor(color);
      }
    } catch (e) {}
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
      li.onclick = () => {
        this.setColor(color);
      };
      this.ulElement.appendChild(li);
    });
    if (liActiveColor) {
      liActiveColor.scrollIntoView();
    }
  }

  /**
   * filter color according to given term
   * @param term
   */
  public filter(term: string) {
    this.source.subscribe(colors => {
      this.colors = colors.filter((color: Color) =>
        color.name.toLocaleLowerCase().includes(term)
      );
    });
    this.update(this.colors);
  }

  /**
   * Call when color change
   * @param color
   */
  public onColorChange(color: Color) {}

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
    this.update(this.colors);

    this.onColorChange(this.active.color);
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
