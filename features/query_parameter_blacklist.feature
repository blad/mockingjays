Feature: Query String Blacklist

  As a user of Mockingjays,
  I want to be able to ignore specified query string keys,
  So they do not get cached or logged.

  @TestServer
  Scenario: Serving with ignored query string keys
    Given I want to create a Mockingjay instance with the following options
      | OPTION                  | VALUE                 |
      | cacheDir                | ./temp/               |
      | logLevel                | error                 |
      | queryParameterBlacklist | token, woot           |
      | serverBaseUrl           | http://localhost:9001 |
    And I serve
    And I see no error
    And I make a GET request to "/queryStringRequest" with the query parameters:
      | token | super-secret-codez |
      | woot  | Yeah!              |
      | value | spoon              |
    Then I can see one cache file for "/queryStringRequest"
    And the "/queryStringRequest" cache file doesn't contain the following query parameters:
      | token |
      | woot  |
