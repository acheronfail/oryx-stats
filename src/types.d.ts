// Thanks to https://app.quicktype.io/

export interface SearchLayoutsByTagsVariables {
  start:     number;
  tags:      string[];
  limit:     number;
  withTour:  boolean;
  anonymous: boolean;
  geometry:  string;
}


export interface SearchLayoutsByTagsResponse {
  searchLayoutsByTags: SearchLayoutsByTags;
}

export interface SearchLayoutsByTags {
  totalCount: number;
  layouts:    LayoutSummary[];
}

export interface LayoutSummary {
  geometry:      string;
  hashId:        string;
  tags:          string[];
  title:         string;
  hasTour:       boolean;
  lastUpdate:    Date;
  commitMessage: string;
  aboutIntro:    null;
  username:      string;
  __typename:    string;
}


export interface GetLayoutResponse {
  Layout: Layout;
}

export interface Layout {
  __typename: string;
  privacy:    boolean;
  geometry:   string;
  hashId:     string;
  parent:     Parent;
  tags:       Tag[];
  title:      string;
  user:       User;
  revision:   Revision;
}

export interface Parent {
  hashId:     string;
  __typename: string;
}

export interface Revision {
  __typename:  string;
  aboutIntro:  null;
  aboutOutro:  null;
  createdAt:   string;
  hashId:      string;
  hexUrl:      string;
  model:       string;
  title:       string;
  config:      Config;
  swatch:      null;
  zipUrl:      string;
  qmkVersion:  string;
  qmkUptodate: boolean;
  layers:      Layer[];
}

export interface Config {
  russian:                boolean;
  rgbTimeout:             number;
  autoshiftEnableTab:     boolean;
  autoshiftEnableAlpha:   boolean;
  autoshiftEnableNumeric: boolean;
  autoshiftEnableSpecial: boolean;
}

export interface Layer {
  builtIn:    null;
  hashId:     string;
  keys:       LayerKey[];
  position:   number;
  title:      string;
  color:      null | string;
  __typename: string;
}

export interface LayerKey {
  os:            null | string;
  code:          string;
  about:         null;
  color:         null;
  dance?:        Dance | null;
  layer:         number | null;
  command:       null | string;
  glowColor:     null | string;
  modifiers:     { [key: string]: boolean } | null;
  customLabel:   null | string;
  staticMacro:   StaticMacro | null;
  aboutPosition: null;
}

export interface Dance {
  tap:        Tap;
  hold:       Tap | null;
  secondTap:  Tap | null;
  secondHold: null;
}

export interface Tap {
  os:          null;
  code:        string;
  layer:       number | null;
  modifiers:   { [key: string]: boolean } | null;
  description: null | string;
}

export interface StaticMacro {
  keys:     StaticMacroKey[];
  name:     null;
  applyAlt: boolean;
  endEnter: boolean;
}

export interface StaticMacroKey {
  code:      string;
  modifiers: { [key: string]: boolean } | null;
}

export interface Tag {
  id:         string;
  hashId:     string;
  name:       string;
  __typename: string;
}

export interface User {
  annotationPublic: boolean;
  name:             string;
  hashId:           string;
  pictureUrl:       string;
  __typename:       string;
}
