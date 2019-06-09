import { revertColor } from './tools.function';
import { Color } from './color.interface';

export class ColorSimpleElement {
  constructor(public element: HTMLDivElement) {}

  public update(color: Color) {
    const simpleColor =
      '#' +
      color.value
        .slice(1)
        .split('')
        .filter((_v, i) => !(i % 2))
        .join('');

    this.element.style.backgroundColor = simpleColor;
    this.element.style.color = revertColor(simpleColor);
    this.element.textContent = simpleColor;
  }
}
