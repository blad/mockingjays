Feature: Form Data Proxy

  As a user of Mockingjays
  I want to be able to ignore certain JSON key paths from affecting the
  uniqueness of the cache file.

  @TestServer
  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION             | VALUE                 |
      | cacheDir           | ./temp/               |
      | serverBaseUrl      | http://localhost:9001 |
      | logLevel           | warn                  |
      | ignoreJsonBodyPath | keys.pathA            |
    And I serve
    And I make a POST request to "/jsonRequest" with the JSON body:
      """
      {
        "keys": {
          "pathA": "unique-every-single-request-because-X-Y-Z"
        },
        "pathB": "This key will be considered as part of uniqueness determindation"
      }
      """
    Then I make a POST request to "/jsonRequest" with the JSON body:
      """
      {
        "keys": {
          "pathA": "unique-every-single-request-because-X-Y-Z-----and some other reason..."
        },
        "pathB": "This key will be considered as part of uniqueness determindation"
      }
      """
    Then I can see 1 cache files for "/jsonRequest"
