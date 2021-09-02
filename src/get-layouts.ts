import { request, gql } from 'graphql-request';
import fs from 'fs';
import { GetLayoutResponse, SearchLayoutsByTagsResponse } from './types';
import { layoutFetchBatchSize } from './options';

const gqlGetLayoutQuery = gql`
  query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
    Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
      ...LayoutData
      __typename
    }
  }

  fragment LayoutData on Layout {
    privacy
    geometry
    hashId
    parent {
      hashId
      __typename
    }
    tags {
      id
      hashId
      name
      __typename
    }
    title
    user {
      annotationPublic
      name
      hashId
      pictureUrl
      __typename
    }
    revision {
      ...RevisionData
      __typename
    }
    __typename
  }

  fragment RevisionData on Revision {
    aboutIntro
    aboutOutro
    createdAt
    hashId
    hexUrl
    model
    title
    config
    swatch
    zipUrl
    qmkVersion
    qmkUptodate
    layers {
      builtIn
      hashId
      keys
      position
      title
      color
      __typename
    }
    __typename
  }
`;
(async function () {
  const {
    searchLayoutsByTags: { layouts: layoutSummaries },
  }: SearchLayoutsByTagsResponse = JSON.parse(await fs.promises.readFile('layout-summaries.json', 'utf-8'));

  if (await fs.promises.stat('layouts.json').catch(() => false)) {
    console.log('Looks like you have already downloaded the layouts, so skipping redownloading them');
    console.log('If you want to redownload them again, just delete the layouts.json file!');
    return;
  }

  // Fetch in batches
  const layouts: GetLayoutResponse[] = [
    // NOTE: add in the default one as a special one
    await request('https://oryx.zsa.io/graphql', gqlGetLayoutQuery, {
      hashId: 'default',
      revisionId: 'latest',
      geometry: 'moonlander'
    }),
  ];
  for (let pos = 0; pos < layoutSummaries.length; pos += layoutFetchBatchSize) {
    layouts.push(
      ...(await Promise.all(
        layoutSummaries.slice(pos, pos + layoutFetchBatchSize).map(({ hashId }) =>
          request('https://oryx.zsa.io/graphql', gqlGetLayoutQuery, {
            hashId,
            revisionId: 'latest',
          })
        )
      ))
    );

    console.log(`Fetched: ${layouts.length}/${layoutSummaries.length}`);

    // Defensively save the layouts in case we get rate limited or there are other errors, etc
    await fs.promises.writeFile('layouts.json', JSON.stringify(layouts, null, 2));
  }
})();
