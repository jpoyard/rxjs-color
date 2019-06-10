import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ColorElement } from './color-element.class';
import { ColorSimpleElement } from './color-simple-element.class';
import { Color } from './color.interface';
import { ColorsList } from './colors-list.class';
import { ColorsMap } from './colors.data';
import { LightenDarkenElement } from './lighten-darken-element.class';

const colorsList = new ColorsList(
  document.querySelector('.list-colors'),
  ColorsMap
);

const colorElement = new ColorElement(document.querySelector('.color'));
const colorSimpleELement = new ColorSimpleElement(
  document.querySelector('.simple-color')
);
const lightenDarkenElement = new LightenDarkenElement(
  document.querySelector('.lighten-darken')
);

colorsList.color.subscribe((color: Color) => {
  colorElement.update(color);
  colorSimpleELement.update(color);
  lightenDarkenElement.update(color);
});

document.onkeydown = (event: KeyboardEvent) => {
  if (event.code === 'ArrowUp') {
    colorsList.previousColor();
  } else if (event.code === 'ArrowDown') {
    colorsList.nextColor();
  }
};

const inputFilter: HTMLInputElement = document.querySelector('#inputFilter');

fromEvent(inputFilter, 'input')
  .pipe(
    map(event => (event.target as HTMLInputElement).value.toLocaleLowerCase()),
    debounceTime(300),
    distinctUntilChanged(),
    tap(console.info)
  )
  .subscribe(term => colorsList.filter(term));

colorsList.init();
