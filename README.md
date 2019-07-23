# GAQL Builder - javascript version

![build](https://travis-ci.com/yo8568/js-gaql-builder.svg?branch=master)

Generating GAQL (Google Ads Query Language) tool, this is ***not official library***.
If you want to build GAQL string much easier, you can use this tool, but it would not be validated entirely for all of posible combinations.

Please follow the building rule via [official documentation](https://developers.google.com/google-ads/api/docs/query/overview).

### Installation

```bash
$ npm install js-gaql-builder
```

### Usage

***Import library***

```javascript
// node.js or es5
const GAQLB = require('js-gaql-builder').default

// react.js or es6
import GAQLB from 'js-gaql-builder'
```

***Syntax***

```javascript
 const result = new GAQLB()
  .select([
    'ad_group.id', 'ad_group_criterion.type', 'ad_group_criterion.criterion_id',
    'ad_group_criterion.keyword.text', 'ad_group_criterion.keyword.match_type'])
  .from('ad_group_criterion')
  .where('metrics.clicks > 135')
  .parameters(['include_drafts = true'])
  .orderBy('ASC')
  .limit(2)
  .toString()
```

***Result***

```javascript
  SELECT
    ad_group.id,
    ad_group_criterion.type,
    ad_group_criterion.criterion_id,
    ad_group_criterion.keyword.text,
    ad_group_criterion.keyword.match_type
  FROM
    ad_group_criterion
  WHERE
    metrics.clicks > 135
  ORDER BY
    ASC
  LIMIT
    2
  PARAMETERS
    include_drafts = true
```

### Run Test

***Test***

```bash
  $ npm run test
```

***Converage***

```bash
  $ npm run cov
```

### Licence

MIT
