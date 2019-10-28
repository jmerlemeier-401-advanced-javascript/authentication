# Authentication

- Authentication: Asks client, "Who are you?"
- Authorization: "Are you allowed to do what you are trying to do (based on who you are)?"

#### String based authentication:
- We have the user make a user object.
  - username {string}
  - password {string}
  - sent to our service as encrypted strings (base64) from user.
- Then we need to parse the sting and decide. Is this a new user or an existing?
- Creating a one way encrypted token (cannot unencrypt), which the user can store and use for all auth requests. 