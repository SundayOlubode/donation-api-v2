# donation-api-v2
Donation API

## Stack
*Language : Javascript(nodejs)*
*Framework : Expressjs*
*Database: MongoDB, Mongoose*

## Features
- Signup (JWT in cookie)
- Login (JWT in cookie)

### Users
- Notify Admin
- See Own Donations
- Get All donations
- Verify Donations
- Reject Donations with note
- Disburse Donations
- Get Breakdown
- Get Own Donations


# Routes
## Auth Routes
### Signup User
- Route: api/v2/auth/signup
- Method: POST
- Body: 
```
{
    "email": "testing@gmail.com",
    "password": "testing",
    "confirmPassword": "testing",
    "firstname": "Testing",
    "lastname": "Surname"
}
```
- Response:
```
{
    "status": "Success",
    "data": {
        "user": {
            "email": "testing@gmail.com",
            "firstname": "Testing",
            "lastname": "Surname",
            "role": "admin",
            "_id": "6476fb24b108c9f663fd8e3f",
            "__v": 0
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ3NmZiMjRiMTA4YzlmNjYzZmQ4ZTNmIiwiaWF0IjoxNjg1NTE5MTQxLCJleHAiOjE2OTMyOTUxNDF9.sFnfo9UNHO_ycxwGbfwz-ZmktwijhxKR8vdGc4I5cso",
        "pendingDonations": [] || undefined (if not admin)
    }
}
```

### Login
- Route: api/v2/auth/login
- Method: POST
- Body: 
```
{
    "email": "testing@gmail.com",
    "password": "testing"
}
```

- Response:
```
{
    "status": "Success",
    "data": {
        "user": {
            "_id": "6476fb24b108c9f663fd8e3f",
            "email": "testing@gmail.com",
            "firstname": "Testing",
            "lastname": "Surname",
            "role": "admin",
            "__v": 0
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ3NmZiMjRiMTA4YzlmNjYzZmQ4ZTNmIiwiaWF0IjoxNjg1NTMxMzE5LCJleHAiOjE2OTMzMDczMTl9.-v59eYhbwUVwYFnxApqs1fO2CKCupL29z5XGtKMHuto",

        "pendingDonations": [] || undefined (if not admin)
    }
}
```
### Forget Password
- Route: api/v2/auth/forgotPassword
- Method: PATCH
- Body: 
```
{
    "email": "testing@gmail.com"
}
```

- Response:
```
{
    "status": "success",
    "message": "Token sent to mail http://localhost:4040/api/v2/auth/resetpassword/13ead9591bb6040f378ff9ce778372f2487e771b7b82ce5d7b8ccf871b3c5c1e"
}
```

### Reset Password
- Route: api/v2/auth/resetpassword/13ead9591bb6040f378ff9ce778372f2487e771b7b82ce5d7b8ccf871b3c5c1e
- Method: PATCH
- Body: 
```
{
    "password": "zuzu",
    "confirmPassword": "zuzu"
}
```

- Response:
```
{
    "status": "Success",
    "data": {
        "user": {
            "_id": "6476fb24b108c9f663fd8e3f",
            "email": "testing@gmail.com",
            "firstname": "Testing",
            "lastname": "Surname",
            "role": "admin",
            "__v": 0,
            "passwordResetExpiry": null,
            "passwordToken": null
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ3NmZiMjRiMTA4YzlmNjYzZmQ4ZTNmIiwiaWF0IjoxNjg1NTM5MjEwLCJleHAiOjE2OTMzMTUyMTB9.BhhP-cj4al2wMQNwYzNtvha8KcmAXbBjMWCvMeSpFDk",
        "pendingDonations": donation[]
    }
}
```
## User Routes
### Notify Admin
- Route: api/v2/user/notify
- Method: POST
- Authorization: Bearer Token || Cookie
- Body: 
```
{
    "amount": 5000,
    "date": "2023-06-08"
}
```

- Response:
```
{
    "status": "success",
    "message": "Admin will be notified, and you will receive a response shortly"
}
```
### Get All Donations
- Route: api/v2/user/donations
- Method: GET
- Authorization: Bearer Token || Cookie
- Response:
```
{
    "status": "success",
    "data": {
        "donations": [
            {
                "_id": "6477a3e3dd19733f43fd2989",
                "amount": 5000,
                "date": "2023-06-08T00:00:00.000Z",
                "donor_id": "6476fb24b108c9f663fd8e3f",
                "verified": "pending",
                "__v": 0
            }
        ]
    }
}
```
### Get My Donations
- Route: api/v2/user/me/donations
- Method: GET
- Authorization: Bearer Token || Cookie
- Response:
```
{
    "status": "success",
    "message": "User donations gotten successfully!",
    "data": {
        "donations": []
    }
}
```
### Verify Donations
- Route: api/v2/user/donations/verify/:donation-id
- Method: PATCH
- Authorization: Bearer Token || Cookie
- Response:
```
{
    "status": "success",
    "message": "Donation verification successful!"
}
```
### Reject Donations
- Route: api/v2/user/donations/decline/:donation-id
- Method: POST
- Authorization: Bearer Token || Cookie
- Body:
```
  {
    "note": "Please correct the amount you specified in your donation"
    }
```

- Response:

```
{
    "status": "success",
    "message": "Donation declined with note"
}
```
### Get Donations Breakdown
- Route: api/v2/donations/breakdown
- Method: GET
- Authorization: Bearer Token || Cookie

- Response:

```
{
    "status": "success",
    "message": "Donation Breakdown",
    "data": {
        "breakdown": {
            "_id": "6477b19dc9d43d68e1fc66b8",
            "total": 90000,
            "disbursed": 40000,
            "balance": 50000
        }
    }
}
```
### Disburse
- Route: api/v2/donations/breakdown/disburse
- Method: PATCH
- Authorization: Bearer Token || Cookie
- Body:
```
{
    "amount": 20000
}
```
- Response:
```
{
    "status": "success",
    "message": "Disbursement updated successfully!"
}
```