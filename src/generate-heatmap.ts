import chalk from 'chalk';
import fs from 'fs';
import { keyCodeToAggregate } from './options';
import { GetLayoutResponse } from './types';
import { padCenter, moonlanderAsciiMap, moonlanderAsciiMapWidth } from './utils';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const ordinalify = (n: number) => {
  const digit = n % 10;
  const tens = n % 100;
  return `${n}${
    digit == 1 && tens != 11 ? 'st' : digit == 2 && tens != 12 ? 'nd' : digit == 3 && tens != 13 ? 'rd' : 'th'
  }`;
};

(async function () {
  const layouts: GetLayoutResponse[] = JSON.parse(await fs.promises.readFile('layouts.json', 'utf-8'));

  const popularityMap = [
    ...layouts
      .flatMap((layout) =>
        layout.Layout.revision.layers.flatMap((layer) =>
          layer.keys
            .map((key, i) => (key.code === keyCodeToAggregate ? i : null))
            .filter((x): x is number => typeof x === 'number')
        )
      )
      .reduce<Map<number, number>>((map, pos) => (map.set(pos, (map.get(pos) ?? 0) + 1), map), new Map())
      .entries(),
  ]
    .sort((a, b) => b[1] - a[1])
    .reduce(
      (s, [pos, count], i, arr) =>
        s.replace(new RegExp(`(\\s+#)${pos}(\\s+)`), (match) => {
          const place = i + 1;
          const s = padCenter(`${ordinalify(place)}-${count}`, match.length);

          const step = 255 / arr.length;
          const r = clamp(Math.floor(place * step) + 128, 0, 255);
          const g = clamp(128 + Math.floor(384 - (i > arr.length / 2 ? place * 2 : place) * step), 0, 255);

          const ss = chalk.rgb(r, g, 0)(s);
          if (place <= 3) {
            return chalk.inverse(ss);
          }

          return ss;
        }),
      moonlanderAsciiMap
    )
    .replace(/#\d+/g, (m) => ' '.repeat(m.length));

  console.log(padCenter(`Heat map for: ${keyCodeToAggregate}`, moonlanderAsciiMapWidth));
  console.log(popularityMap);
})();
