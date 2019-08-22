#!/bin/bash
json="$(curl -X POST https://api.twitter.com/oauth2/token -H 'Accept: */*' -H 'Authorization: Basic '"$BASIC_AUTH_DATA" -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' -H 'Host: api.twitter.com' -H 'cache-control: no-cache' -d grant_type=client_credentials)"
token=$( jq -r ".access_token" <<<"$json" )
curl -X POST https://api.twitter.com/1.1/tweets/search/30day/wand.json -H 'Accept: */*' -H 'Authorization: Bearer '"$token" -H 'Content-Type: text/plain' -H 'Host: api.twitter.com' -d '{"query": "#wmhb", "maxResults": 10}' >| $WAND_SERVER/tweets-db.json
