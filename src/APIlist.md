# DevTinder APIs

### --authRouter--
POST  /signup
POST  /login
POST  /logout


### --profileRouter--
GET   /profile/view
PATCH /profile/edit
PATCH /profile/password


### --connectionRouter--
POST  /request/send/ignored/:userId
POST  /request/send/interested/:userId
POST  /request/send/accepted/:userId
POST  /request/send/rejected/:userId

Status: ignored, interested, accepted, rejected


### --userRouter--
GET   /user/connections
GET   /user/requests
GET   /user/feed