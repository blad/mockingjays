Feature: Ignored Content Types

  As a user of Mockingjays
  I want to be able to ignore certain content types
  So that they do not get cached or logged

  @TestServer
  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION            | VALUE                 |
      | cacheDir          | ./temp/               |
      | serverBaseUrl     | http://localhost:9001 |
      | cacheHeader       | content-type          |
      | ignoreContentType | image/*               |
      | logLevel          | error                 |
    And I serve
    And I see no error
    When I make a "GET" request to "/image" with headers:
      | HEADER       | VALUE            |
      | accept       | image/*          |


  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION            | VALUE                 |
      | cacheDir          | ./temp/               |
      | serverBaseUrl     | http://localhost:9001 |
      | cacheHeader       | content-type          |
      | ignoreContentType | image/*               |
      | logLevel          | error                 |
    And I serve
    And I see no error
    When I make a "GET" request to "/image" with headers:
      | HEADER       | VALUE            |
      | accept       | image/*          |
