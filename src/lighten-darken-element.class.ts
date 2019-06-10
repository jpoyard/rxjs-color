import { revertColor, lightenDarkenColor } from './tools.function';
import { Color } from './color.interface';

export class LightenDarkenElement {
  constructor(public element: HTMLDivElement) {}

  public update(color: Color) {
    this.element.innerHTML = null;
    new Array(21)
      .fill(1)
      .map((_v, i) => 100 - i * 10)
      .filter(i => i !== 0)
      .forEach(amt => {
        const sampleElt = document.createElement('div');
        const lightenDarkenColorValue = lightenDarkenColor(
          color.value,
          amt
        ).toUpperCase();
        if (lightenDarkenColorValue.length === 7) {
          sampleElt.style.backgroundColor = lightenDarkenColorValue;
          sampleElt.style.color = revertColor(lightenDarkenColorValue);
          sampleElt.classList.add(
            'd-flex',
            'flex-row',
            'justify-content-around'
          );
          sampleElt.innerHTML = `<i>${amt.toString()}</i><i>${lightenDarkenColorValue}</i>`;
        }
        this.element.appendChild(sampleElt);
      });
  }
}
