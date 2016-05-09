Feature: Handling CORS Requests

  As a user of Mockingjays
  I need to proxy CORS preflight request
  So that I can make requests to the proxy from the browser

  @TestServer
  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE                 |
      | cacheDir      | ./temp/               |
      | serverBaseUrl | http://localhost:9001 |
      | cacheHeader   | content-type, origin   |
    And I serve
    And I see no error
    And I wait
    When I make a "OPTIONS" request to "/aPostEndpoint" with headers:
      | HEADER                        | VALUE            |
      | Origin                        | http://localhost |
      | Access-Control-Request-Method | POST, OPTIONS    |
    Then I see a cache file for "/aPostEndpoint" with the following headers:
      | HEADER                       | VALUE                        |
      | Access-Control-Allow-Headers | origin, content-type, accept |
