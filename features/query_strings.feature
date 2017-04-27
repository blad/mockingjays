Feature: Form Data Proxy

  Assert that Mockingjays handles the Query String for a Request Correctly.

    - Query Strings Do Not Remain in the Path
    - Query Strings Affect the Hash Value
    - Query String Values Can Be Ignored for a Particular Key. (No Effect on Hash Value)

  @TestServer @Skip
  Scenario: Serving with Basic Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION             | VALUE                 |
      | cacheDir           | ./temp/               |
      | serverBaseUrl      | http://localhost:9001 |
      | logLevel           | warn                  |
    And I serve
    And I make a GET request to "/queryStringRequest" with the query strings:
      | KEY      | VALUE    |
      | testKey1 | valueXYZ |
      | testKey2 | 234      |
    Then I can see 1 cache files for "/queryStringRequest"



  @TestServer @Skip
  Scenario: Serving with Ignore Key Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION             | VALUE                 |
      | cacheDir           | ./temp/               |
      | serverBaseUrl      | http://localhost:9001 |
      | logLevel           | warn                  |
      | queryStringIgnore  | testKey1              |
    And I serve
    When I make a GET request to "/queryStringRequest" with the query strings:
      | KEY      | VALUE    |
      | testKey1 | valueXYZ |
      | testKey2 | 234      |
    And I make a GET request to "/queryStringRequest" with the query strings:
      | KEY      | VALUE    |
      | testKey2 | 234      |
    Then I can see 2 cache files for "/queryStringRequest"
