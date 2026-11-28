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
POST  /request/send/:status/:userId

status : interested, ignored can be dynamic


POST  /request/send/:status/:requestId

Status:  accepted, rejected


### --userRouter--
GET   /user/connections
GET   /user/requests/received
GET   /user/feed
 
### pagination feed ===>> using skip() and limit()
/feed?page=1&limit=10 => 1-10   ===>>  .skip(00) & .limit(10)
/feed?page=2&limit=10 => 11-20  ===>>  .skip(10) & .limit(10)
/feed?page=3&limit=10 => 21-30  ===>>  .skip(20) & .limit(10)
