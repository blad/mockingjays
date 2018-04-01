Feature: Stateful Requests Options
  As a user of Mockingjays
  I want to be able to define when we are in readOnly mode
  So that no new fixtures are generated at inapporpriate times

  @TestServer
  Scenario: Serving with the readOnly = true
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE                 |
      | cacheDir      | ./temp/               |
      | serverBaseUrl | http://localhost:9001 |
      | logLevel      | error                 |
      | readOnly      | true                  |
    And I serve
    When I make a "GET" request to "/getCount"
    Then I see the result "Error:Read Only Mode."
    And I can see 0 cache files for "/getCount"


  @TestServer
  Scenario: Serving with the readOnly = false
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE                 |
      | cacheDir      | ./temp/               |
      | serverBaseUrl | http://localhost:9001 |
      | logLevel      | error                 |
      | readOnly      | false                 |
    And I serve
    When I make a "GET" request to "/getCount"
    Then I see the result "0"
    And I can see 1 cache files for "/getCount"