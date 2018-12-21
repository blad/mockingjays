Feature: Cache Header Option

  As a user of Mockingjays
  I want to be able to specify cache headers
  So that I track what specific headers

  @TestServer
  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE                 |
      | cacheDir      | ./temp/               |
      | serverBaseUrl | http://localhost:9001 |
      | cacheHeader   | content-type          |
      | logLevel      | error                 |
    And I serve
    And I see no error
    When I make a "POST" request to "/cacheHeader" with headers:
      | HEADER       | VALUE            |
      | content-type | application/json |
    Then I see a cache file for "/cacheheader" with the following headers:
      | HEADER       | VALUE            |
      | content-type | application/json |
