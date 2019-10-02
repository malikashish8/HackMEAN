# Vulnerabilities

## MongoDB Injection
No SQL Injection refers to injection vulnerabilities in non SQL databases such as Mongo. In NoSQLi, queries are sent instead of actual strings for matching conditions. For example send the following request:
```
POST /login HTTP/1.1
Host: 127.0.0.1:8888
Content-Type: application/json
Content-Length: 51

{"username":{"$gt":"doesnotexit"},"password":"foo"}
```

The response discloses user name:
```
{"error":"   incorrect password for j0ker"}
```
### Mitigation
This issue can be mitigated by ensuring that the user parameters that are being sent are of string type. See Pull Request: TODO

## Lack of function level authorization checks
`GET /post` returns all posts and the client filters out private posts from displaying.

Also `GET /comments`
### Mitigation
Implement function level authorization checks at the server end. Do not depend on client side validation and filtering.

## Username leakage
If SSL/TLS is not configured usernames might be logged to network infrastucture such as proxies and routers since the URL contains usernames. eg. http://hackmean/user/Alice

Restful APIs require subject name/id to be a part of the URL. 

### Mitigation
Make sure that SSL/TLS is enabled. Also do not refer to confidential object names by using REST symantics for GET request. Use post instead.

## User Enumeration
Different message for username not found and password incorrect errors. This class of vulnerability is not specific to MEAN stack.

### Mitigation
1. Send generic message for all authentication errors to the client.
2. To prevent username enumeration using timing based attacks implement 
encryption of a dummy value when username is incorrect so that the response time remains similar for all authentication requests.
