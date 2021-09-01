import { SearchLayoutsByTagsVariables } from './types';

// NOTE: modify this to alter how many layouts are fetched at once
export const layoutFetchBatchSize: number = 20;

// NOTE: modify these to alter which layouts are downloaded
export const searchLatoutsByTagsVariables: SearchLayoutsByTagsVariables = {
  tags: ['qwerty'],
  start: 0,
  limit: 3000,
  withTour: false,
  anonymous: true,
  geometry: 'moonlander',
};

// NOTE: modify this to change which key is chosen for the heat map
export const keyCodeToAggregate: string = 'KC_ENTER';

// NOTE: modify this to change which layout is printed for `yarn print-layout`
export const layoutToPrint: string = 'xbJpL';
