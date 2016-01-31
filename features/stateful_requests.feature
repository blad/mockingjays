Feature: Stateful Requests Options
  As a user of Mockingjays
  I want to be able to define a set of routes that have sideffects
  So that I can accurately mock a stateful http interaction

  Background:
    Given I have a source server running on:
      | HOST      | PORT |
      | localhost | 9001 |
    And I have a cache directory at "./temp/"

  @TestServer
  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE                 |
      | cacheDir      | ./temp/               |
      | port          | 9000                  |
      | serverBaseUrl | http://localhost:9001 |
      | logLevel      | warn                  |
    And I provide the following transition config
      """
      {
        "/increment": {
          "method": "GET",
          "status": 200,
          "links": [
            {
              "path": "/getCount",
              "method": "GET"
            }
          ]
        }
      }
      """
    And I serve
    When I make a "GET" request to "/getCount"
    Then I see the result "0"
    When I make a "GET" request to "/increment"
    Then I make a "GET" request to "/getCount"
    And I see the result "1"
    And I can see 2 cache files for "/getCount"
