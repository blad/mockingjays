Feature: Stateful Requests Options
  As a user of Mockingjays
  I want to be able to define a set of routes that have sideffects
  So that I can accurately mock a stateful http interaction

  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE           |
      | cacheDir      | ./temp/         |
      | serverBaseUrl | http://swapi.co |
      | logLevel      | warn            |
    And I provide the following transition definitions
      """
      {
        "/api/": {
          "method": "GET",
          "status": 200,
          "links": [
            {
              "path": "/api/people/1/",
              "method": "GET"
            }
          ]
        }
      }
      """
    And I serve
    When I make a "GET" request to "/api/people/1/"
    When I make a "GET" request to "/api/"
    When I make a "GET" request to "/api/people/1/"
    And I can see 2 cache files for "/api/people/1/"
