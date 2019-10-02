# Vulnerabilities

## MongoDB Injection

## Excessive information returned by API
`GET /post` returns all posts and the client filters out private posts from displaying.

## Username leakage
If running on HTTP usernames might be logged to network infrastucture such as proxies and routers since the URL contains usernames. eg. http://hackmean/user/Alice

## User Enumeration
Different message for username not found and password incorrect errors