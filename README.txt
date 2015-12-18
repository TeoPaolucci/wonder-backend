I Wonder backend server

GitHub repo: https://github.com/TeoPaolucci/wonder-backend

Routes:

'/'
  GET: Returns a JSON object with the current user's username, or of no one is logged in, "Nobody"

/signup
  POST: Body needs "username" and "password" keys w/strings, creates a new user with those credentials. Returns 200 OK if successful.

/login
  POST: Body needs "username" and "password" keys w/strings corresponding to a user already created with those credentials, creates a cookie session that keeps a user logged in for 60 mins. Redirects to route '/'.

/logout
  Any method: Removes the session with the currently logged in user if any. Returns 200 OK if successful.

/changePassword
  POST: body needs "pssword" key w/string and a user needs to be logged in, changes the current user's password to the new password sent. Returns 200 OK if successful.

/profile
  GET: If a user is logged in and has a profile, returns the profile information of the current user in a JSON object.
  POST: If a user is logged in and does not already have a profile, creates a new profile with the body profided. Can have "first_name", "last_name", "dob" (date of birth), and "email". Returns the new profile.
  PATCH: If a user is logged in and has a profile, using information in the body, updates information in the profile with the new information. Returns the updated profile.

/profile/trust
  GET: If a user is logged in and has a profile, based on an array of IDs in the profile, returns a list of profiles matching those IDs. If none, returns {message: "No trusted users"}.
  POST: If a user is logged in, has a profile, and the body contains an ID of a user aside from their own or one already in the list of IDs in their profile, this adds that ID to the array. Returns 200 OK.
  DELETE: If a user is logged in, has a profile, and the body contains an ID of a user not in the list of IDs in their profile, this removes that ID from the list. Returns 200 OK.
