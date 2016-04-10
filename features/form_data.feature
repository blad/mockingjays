Feature: Form Data Proxy

  As a user of Mockingjays
  I want to be able to proxy from data requests
  So that I can handle form inputs

  @TestServer
  Scenario: Serving with Required Options
    Given I want to create a Mockingjay instance with the following options
      | OPTION        | VALUE                 |
      | cacheDir      | ./temp/               |
      | serverBaseUrl | http://localhost:9001 |
      | cacheHeader   | content-type          |
      | logLevel      | warn                  |
      And I serve
      When I make a form data request to "/formData"
      Then the boundary is a mockingjays boundary
