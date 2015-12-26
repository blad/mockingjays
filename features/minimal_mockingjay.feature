Feature: Minimal Mockingjay Instance
  As a user of Mockingjays
  I want to be able to start a mockingjay instance with minial options
  So that I can quickly start testing my application with the default options

  Scenario: Serving without Require Options
    Given I want to create a Mockingjay instance with no options
    When I serve
    Then I see an error asking me to specify missing options

  Scenario: Serving without Base Server URL
    Given I want to create a Mockingjay instance with the following options
      | OPTION   | VALUE   |
      | cacheDir | ./temp/ |
    When I serve
    Then I see an error asking me to specify missing options

  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE           |
      | cacheDir      | ./temp/         |
      | serverBaseUrl | http://swapi.co |
    When I serve
    Then I see no error
