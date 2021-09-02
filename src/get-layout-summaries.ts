import { request, gql } from 'graphql-request';
import fs from 'fs';
import { SearchLayoutsByTagsResponse, SearchLayoutsByTagsVariables } from './types';
import { searchLatoutsByTagsVariables } from './options';

(async function () {
  if (await fs.promises.stat('layout-summaries.json').catch(() => false)) {
    console.log('Looks like you have already downloaded the layout summaries, so skipping redownloading them');
    console.log('If you want to redownload them again, just delete the layout-summaries.json file!');
    return;
  }

  const layoutSummaries = await request<SearchLayoutsByTagsResponse, SearchLayoutsByTagsVariables>(
    'https://oryx.zsa.io/graphql',
    gql`
      query (
        $start: Int!
        $limit: Int!
        $tags: [String!]!
        $geometry: String
        $anonymous: Boolean
        $withTour: Boolean
      ) {
        searchLayoutsByTags(
          start: $start
          tags: $tags
          limit: $limit
          geometry: $geometry
          anonymous: $anonymous
          withTour: $withTour
        ) {
          totalCount
          layouts {
            geometry
            hashId
            tags
            title
            hasTour
            lastUpdate
            commitMessage
            aboutIntro
            username
            __typename
          }
          __typename
        }
      }
    `,
    searchLatoutsByTagsVariables
  );

  await fs.promises.writeFile('layout-summaries.json', JSON.stringify(layoutSummaries, null, 2));
})();
