# Donation API

## Stack

- _Language : Javascript(nodejs)_
- _Framework : Expressjs_
- _Database: MongoDB, Mongoose_

## Features

#### Auth

- Signup (JWT in cookie)
- Login (JWT in cookie)

#### Users

- See Own Donations
- Get All donations
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
    "lastname": "Surname",
    "phoneNumber": "+234XXXXXXXX"
}
```

- Response:

```
{
    "status": "success",
    "data": {
        "user": {
            "email": "testing@gmail.com",
            "firstname": "Testing",
            "lastname": "Surname",
            "role": "admin",
            "_id": "6476fb24b108c9f663fd8e3f",
            "phoneNumber": "+234XXXXXXXX",
            "__v": 0
        },
        "token": "jwt",
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
    "status": "success",
    "data": {
        "user": {
            "_id": "6476fb24b108c9f663fd8e3f",
            "email": "testing@gmail.com",
            "firstname": "Testing",
            "lastname": "Surname",
            "phoneNumber": "+234XXXXXXXX",
            "role": "admin",
            "__v": 0
        },
        "token": "jwt",
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

- Route: api/v2/auth/resetpassword
- Method: PATCH
- Body:

```
{
    "token": "13ead9591bb6040f378ff9ce778372f2487e771b7b82ce5d7b8ccf871b3c5c1e"
    "password": "zuzu",
    "confirmPassword": "zuzu"
}
```

- Response:

```
{
    "status": "success",
    "data": {
        "user": {
            "_id": "6476fb24b108c9f663fd8e3f",
            "email": "testing@gmail.com",
            "firstname": "Testing",
            "lastname": "Surname",
            "phoneNumber": "+234XXXXXXXX",
            "role": "admin",
            "__v": 0,
            "passwordResetExpiry": null,
            "passwordToken": null
        },
        "token": jwt,
    }
}
```

## User Routes

### Get All Users

```
- Route: api/v2/user/all
- Method: GET
- Authorization: Bearer Token, Admin
```

- Response:

```
{
    "status": "success",
    "data": {
        "donors": [
            {
                "_id": "64efd308d03b2b4c32aa2ac0",
                "firstname": "Sam",
                "lastname": "Olu"
            },
            {
                "_id": "64f1136f54fec7608874ccb6",
                "firstname": "Sunday",
                "lastname": "Olubode"
            },
            {
                "_id": "64f3b2790757e63ed7ef0a45",
                "firstname": "testing",
                "lastname": "surname"
            }
        ]
    }
}
```

### Get All Donations

```
- Route: api/v2/donations
- Method: GET
- Authorization: Bearer Token, Admin
```

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
                "donorId": "6476fb24b108c9f663fd8e3f",
                "__v": 0
            }
        ]
    }
}
```

### Get My Donations

```
- Route: api/v2/user/me/donations
- Method: GET
- Authorization: Bearer Token || Cookie
```

- Response:

```
{
    "status": "success",
    "data": {
        "donations": []
    }
}
```

### Get Donations Breakdown

```
- Route: api/v2/donations/breakdown
- Method: GET
- Authorization: Bearer Token || Cookie

```

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

### Add Donations

```
- Route: api/v2/user/donations/add
- Method: POST
- Authorization: Bearer Token || Cookie
```

- Body:

```
{
    "amount": 80000,
    "donorId": "6a5b811f6a0929e04250",
    "date": (optional)
}
```

- Response:

```
{
    "status": "success",
    "message": "You will receive a mail soon"
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

- Olubode Sunday Samuel
