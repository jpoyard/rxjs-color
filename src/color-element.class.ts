import { revertColor } from './tools.function';
import { Color } from './color.interface';

export class ColorElement {
  constructor(public element: HTMLDivElement) {}

  public update(color: Color) {
    this.element.style.backgroundColor = color.value;
    this.element.style.color = revertColor(color.value);
    this.element.textContent = color.value;
  }
}
