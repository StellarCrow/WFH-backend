define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "api/main.js",
    "group": "/home/max/wfh-backend/api/main.js",
    "groupTitle": "/home/max/wfh-backend/api/main.js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "User login",
    "name": "Login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "Credential",
            "description": "<p>User's credential</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object with user's credential example:",
        "content": "{\n\"email\": \"sometest@tmail.com\",\n\"password\": \"pasSw0rD@\",\n}",
        "type": "Object"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Success-response",
            "description": "<p>Success response with  JWT token contained user id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response example:",
          "content": "HTTP/1.1 200 OK\n{\nsuccess: true,\npayload: \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjVlYmQxMzZmMTVkZWI4NTQ4MmNhMjY4M\nSIsImlhdCI6MTU4OTc5MTk3OCwiZXhwIjoxNTg5ODc4Mzc4fQ.VQAQ4oD9-MHDxcYcL2Aj4WuUQ3BS9rA-4SuDlklEnEI\",\nstatus: \"200 OK\",\n}",
          "type": "Object"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-response",
            "description": "<p>Login failed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error response example:",
          "content": "    HTTP/1.1 400 Bad request\n{\n     success: false,\n     payload: null,\n     error: { status: \"400 Bad request\", message: \"Login failed. Can no find such user!\"}\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/authRouter.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/auth/register",
    "title": "User registration",
    "name": "Registration",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "UserData",
            "description": "<p>User's data for registration</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Object with user data for registration example:",
        "content": "{\n\"email\": \"sometest@tmail.com\",\n\"password\": \"pasSw0rD@\",\n\"firstName\": \"Andre\",\n\"lastName\": \"Santiago\"\n}",
        "type": "Object"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Success-response",
            "description": "<p>Success response with no data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response example:",
          "content": "HTTP/1.1 200 OK\n{\nsuccess: true,\npayload: null,\nstatus: \"200 OK\",\n}",
          "type": "Object"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-response",
            "description": "<p>Error when registration failed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error response example:",
          "content": "    HTTP/1.1 400 Bad request\n{\n     success: false,\n     payload: null,\n     error: { status: \"400 Bad request\", message: \"Registration was failed!\"}\n}",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/authRouter.js",
    "groupTitle": "User"
  }
] });
