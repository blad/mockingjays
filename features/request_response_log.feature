Feature: Request Response Log
  As a user of Mockingjays
  I want to be able to log my request and reponses to a log file
  So that I can inspect the requests after they have happened.

  @TestServer
  Scenario: Serving with a path for 'requestResponseLogFile'
    Given I want to create a Mockingjay instance with the following options
      | OPTION                 | VALUE                 |
      | cacheDir               | ./temp/               |
      | serverBaseUrl          | http://localhost:9001 |
      | logLevel               | warn                  |
      | requestResponseLogFile | ./temp/req.log        |
    And I serve
    When I make a "GET" request to "/getCount"
    And I can see 1 cache files for "/getCount"
    And I can see the log file "req.log"