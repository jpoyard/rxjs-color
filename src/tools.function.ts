const RevertValue = new Array(16)
  .fill(1)
  .map((_v, i) => i)
  .reverse();

export function revertColor(color: string): string {
  return color
    .split('')
    .map(item => {
      if (item === '#') {
        return item;
      } else {
        const hexValue = Number.parseInt(item, 16);
        return RevertValue[hexValue].toString(16);
      }
    })
    .join('');
}

export function lightenDarkenColor(color: string, amt: number) {
  let usePound = false;

  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}
