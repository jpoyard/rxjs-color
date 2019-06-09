import { ColorsMap } from './colors.const';
import { Color } from './color.interface';
import { revertColor, lightenDarkenColor } from './tools.function';

let colors = Array.from(ColorsMap.values());

let activeColor: Color = null;
let activeIndex: number = null;

function updateColorsList() {
  // Initialise list of colors
  activeIndex = null;
  let liActiveColor: HTMLLIElement = null;
  const ul: HTMLUListElement = document.querySelector('.list-colors');
  ul.innerHTML = null;
  colors.forEach((color, index) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    if (color.active) {
      activeIndex = index;
      li.classList.add('active');
      liActiveColor = li;
    }
    li.innerHTML = color.name;
    li.onclick = () => {
      setColor(color);
    };
    ul.appendChild(li);
  });
  liActiveColor.scrollIntoView();
}

function setColor(color: Color) {
  if (activeColor) {
    activeColor.active = false;
  }
  activeColor = color;
  activeColor.active = true;
  updateColorsList();

  const colorElt: HTMLDivElement = document.querySelector('.color');
  colorElt.style.backgroundColor = color.value;
  colorElt.style.color = revertColor(color.value);
  colorElt.textContent = color.value;

  const simpleColor =
    '#' +
    color.value
      .slice(1)
      .split('')
      .filter((_v, i) => !(i % 2))
      .join('');
  const simpleColorElt: HTMLDivElement = document.querySelector(
    '.simple-color'
  );
  simpleColorElt.style.backgroundColor = simpleColor;
  simpleColorElt.style.color = revertColor(simpleColor);
  simpleColorElt.textContent = simpleColor;

  const lightenDarkenElt: HTMLDivElement = document.querySelector(
    '.lighten-darken'
  );
  lightenDarkenElt.innerHTML = null;
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
      sampleElt.style.backgroundColor = lightenDarkenColorValue;
      sampleElt.style.color = revertColor(lightenDarkenColorValue);
      sampleElt.classList.add('d-flex', 'flex-row', 'justify-content-around');
      sampleElt.innerHTML = `<i>${amt.toString()}</i><i>${lightenDarkenColorValue}</i>`;
      lightenDarkenElt.appendChild(sampleElt);
    });
}

setColor(colors[0]);

function setColorByIndex(index: number) {
  try {
    const color = colors[index];
    if (color) {
      setColor(color);
    }
  } catch (e) {}
}

document.onkeydown = (event: KeyboardEvent) => {
  if (event.code === 'ArrowUp') {
    setColorByIndex(activeIndex - 1);
  } else if (event.code === 'ArrowDown') {
    setColorByIndex(activeIndex + 1);
  }
};

const inputFilter: HTMLInputElement = document.querySelector('#inputFilter');
let term: string = '';
inputFilter.onkeyup = () => {
  if (term !== inputFilter.value.toLocaleLowerCase()) {
    term = inputFilter.value.toLocaleLowerCase();
    colors = Array.from(ColorsMap.values()).filter((color: Color) =>
      color.name.toLocaleLowerCase().includes(term)
    );
    if (colors && colors.length > 0) {
      setColor(colors[0]);
    } else {
      updateColorsList();
    }
  }
};
