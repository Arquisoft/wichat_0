Feature: Registering a new user

  Scenario: The user is not registered in the site
    Given A user with name "Pablo" and password "PabloASW"
    When I fill the data in the form and press submit
    Then The confirmation message "User added successfully" should be shown in the screen