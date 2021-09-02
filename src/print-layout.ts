import fs from 'fs';
import { layoutToPrint } from './options';
import { GetLayoutResponse, LayerKey, Revision } from './types';
import { padCenter, moonlanderAsciiMapWidth, moonlanderAsciiMap } from './utils';
import { KeyData } from './key-data';

const stripRegex = /^KC_(AUDIO_)?|_T$/g;

function isLayerKey(key: LayerKey) {
  return [
    'LM',
    'LOWER_OSL',
    'LOWER_TG',
    'LOWER_TT',
    'LOWER',
    'LT',
    'MO',
    'OSL',
    'RAISE_OSL',
    'RAISE_TG',
    'RAISE_TT',
    'TG',
    'TO',
    'TT',
  ].includes(key.code);
}

const createKeyLabel = (revision: Revision, layerIdx: number, keyIdx: number) => {
  const key = revision.layers[layerIdx].keys[keyIdx];
  const isDualFuncModifier = key.code.endsWith('_T');

  let label: string;
  if (key.customLabel) {
    label = key.customLabel;
  } else {
    outer: switch (key.code) {
      case 'KC_TRANSPARENT':
        if (key.dance) {
          label = 'dance';
          break;
        } else if (layerIdx > 0) {
          // BUG: the fallthrough key depends on the activated layer beneath, not the layer directly beneath
          for (let idx = layerIdx - 1; idx != -1; idx--) {
            const keyBelow = revision.layers[idx].keys[keyIdx];
            if (keyBelow.code) {
              // HACKY
              label = `${createKeyLabel(revision, idx, keyIdx)}*`.replace(/\*+$/, '*');
              break outer;
            }
          }
        }
      default:
        label = KeyData[key.code]?.label ?? key.code.replace(stripRegex, '');
    }
  }

  if (isLayerKey(key) && typeof key.layer === 'number') {
    label += `-${key.layer}`;
  }
  if (isDualFuncModifier && key.command) {
    label += `/${key.command.replace(stripRegex, '')}`;
  }

  return label;
};
const generateLayerMaps = (revision: Revision) =>
  revision.layers.map(
    (layer, layerIdx) =>
      padCenter(layer.title, moonlanderAsciiMapWidth) +
      '\n' +
      layer.keys.reduce(
        (s, _, keyIdx) =>
          s.replace(new RegExp(`(\\s+#)${keyIdx}(\\s+)`), (match) =>
            padCenter(createKeyLabel(revision, layerIdx, keyIdx).slice(0, match.length), match.length)
          ),
        moonlanderAsciiMap
      )
  );

(async function () {
  const layouts: GetLayoutResponse[] = JSON.parse(await fs.promises.readFile('layouts.json', 'utf-8'));
  const layout = layouts.find((layout) => layout.Layout.hashId == layoutToPrint);
  if (!layout) {
    throw new Error(`Failed to find layout with hash id: ${layoutToPrint}!`);
  }

  generateLayerMaps(layout.Layout.revision)
    .reverse()
    .forEach((map) => console.log(map));
})();
