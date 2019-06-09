import { Color } from './color.interface';
import { ColorsMap } from './colors.data';
import { of, Observable } from 'rxjs';

interface ActiveColor {
  index: number;
  color: Color;
}

export class ColorsList {
  private colors: Observable<Color[]>;
  private active: ActiveColor = { color: null, index: null };

  constructor(
    private ulElement: HTMLUListElement,
    private colorsMap: Map<string, Color>
  ) {
    this.colors = new Observable<Color[]>(observer => {
      observer.next(Array.from(this.colorsMap.values()));
      observer.complete();
    });
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
      li.onclick = () => {
        this.setColor(color);
      };
      this.ulElement.appendChild(li);
    });
    liActiveColor.scrollIntoView();
  }

  /**
   * filter color according to given term
   * @param term
   */
  public filter(term: string) {
    this.colors = new Observable<Color[]>(observer => {
      observer.next(
        Array.from(ColorsMap.values()).filter((color: Color) =>
          color.name.toLocaleLowerCase().includes(term)
        )
      );
      observer.complete();
    });
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
    this.colors.subscribe(colors => this.update(colors));

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
