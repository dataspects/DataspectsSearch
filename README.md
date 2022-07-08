# dataspects Search for MediaWiki

dataspects Search for MediaWiki is based on [Meilisearch](https://www.meilisearch.com) and [instant-meilisearch](https://github.com/meilisearch/instant-meilisearch).

```mermaid
flowchart LR

  subgraph Docker on server
    mediawiki("<b>MediaWiki</b>
    - LocalSettings.php")
    meilisearch("<b>Meilisearch</b>")
    tika("<b>Tika</b>")
  end

  subgraph Internet
    userAgent("<b>User Agent</b>")
    DataspectsSearchCLI("<b><a href='https://github.com/dataspects/DataspectsSearchCLI'>DataspectsSearchCLI</a></b>
    - export MEILI_MASTER_KEY=
    - export INDEX=")
  end

  DataspectsSearchCLI-->|configure/manage|meilisearch
  userAgent<-->|<b>search content</b><br/>wgDataspectsSearchSearchKey|meilisearch
  userAgent<-->mediawiki
  mediawiki<-->|<b>update content</b><br/>wgDataspectsSearchWriteKey|meilisearch
  mediawiki<-->|analyze content|tika
  
classDef default text-align:left;
linkStyle 0,3 stroke:#ff0000
linkStyle 1,4 stroke:#00ff00
```

## **PENDING**

* onPageSave index CRUD hooks
* Logging
* Testing
* Delete docs from indexes?

## LocalSettings.php

```php
wfLoadExtension( 'DataspectsSearch' );
$wgDataspectsSearchTikaURL = "http://tika:9998";
$wgDataspectsSearchWriteURL = "http://meili:7700";
$wgDataspectsSearchSearchURL = "http://localhost:7700";

# See later section "Keys" about how to set these keys
$wgDataspectsSearchSearchKey = "";       # Used by class SpecialDataspectsSearch
$wgDataspectsSearchWriteKey = "";        # Used by class DataspectsSearchFeed

# See later section "Keys" about how to create/configure this index
$wgDataspectsSearchIndex = "mediawiki";
$wgDataspectsSearchSourcesForAnonymous = [];
$wgDataspectsSearchSourcesForAuthenticated = [];
$wgDataspectsSearchMediaWikiID = "dscan"; # together with the page ID, this represents the index doc id

# This will direct full text searches to dataspects Search
$wgDisableTextSearch = true;
$wgSearchForwardUrl = "/wiki/Special:DataspectsSearch?q=$1";
```

## Keys

See https://github.com/dataspects/DataspectsSearchCLI

* `create-mediawiki-keys.sh`
* `get-all-keys.sh`

## Indexes

See https://github.com/dataspects/DataspectsSearchCLI

* `create-mediawiki-indexes.sh`
* `list-all-indexes.sh`
* `update-mediawiki-indexes-settings.sh`
* `mediawiki-settings.sh`

## Manual indexing

Allows per-MediaWiki-namespace indexing
`sudo docker exec canasta-dockercompose_web_1 bash -c 'php extensions/DataspectsSearch/maintenance/feedAll.php'`

## Example: configure dataspects Search for [Canasta](https://canasta.wiki/)

### Fixme

1. Add to Canasta MediaWiki container: `composer require meilisearch/meilisearch-php guzzlehttp/guzzle http-interop/http-factory-guzzle:^1.0`

## Test
```bash
sudo docker exec -it canasta-dockercompose_web_1 /bin/bash
root@95e3ef5ecc17:/var/www/mediawiki/w# php tests/phpunit/phpunit.php \
  extensions/DataspectsSearch/tests/phpunit/unit/DataspectsSearchTest.php
```


## Develop

See https://github.com/dataspects/DataspectsSearchCLI/tree/main/Development

```bash
sudo docker exec -it canasta-dockercompose_web_1 /bin/bash
root@95e3ef5ecc17:/var/www/mediawiki/w# clear; php extensions/DataspectsSearch/maintenance/feedOne.php
```

### Tika

```bash
#!/bin/bash

# https://cwiki.apache.org/confluence/display/TIKA/TikaServerEndpointsCompared
curl \
    -T /home/lex/python-regular-expressions-cheat-sheet.pdf \
    http://localhost:9998/rmeta
```

## Logs

```bash
sudo docker exec -it canasta-dockercompose_web_1 /bin/bash
tail -f  apache2/error_log.current
```

## See also
* https://www.digitalocean.com/community/tutorials/how-to-run-a-meilisearch-frontend-using-instantsearch-on-ubuntu-22-04

