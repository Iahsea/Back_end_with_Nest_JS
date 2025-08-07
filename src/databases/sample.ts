export const ADMIN_ROLE = "SUPER ADMIN";
export const USER_ROLE = "NORMAL USER";
export const HR_ROLE = "NORMAL HR";

export const INIT_PERMISSIONS = [
    {
        "_id": "689174398a19f775ab1952e4",
        "name": "Get Company with paginate",
        "apiPath": "/api/v1/companies",
        "method": "GET",
        "module": "COMPANIES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:02:17.618Z",
        "updatedAt": "2025-08-05T03:02:17.618Z",
        "__v": 0
    },
    {
        "_id": "689175118a19f775ab1952eb",
        "name": "Get Users with paginate",
        "apiPath": "/api/v1/users",
        "method": "GET",
        "module": "USERS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:05:53.511Z",
        "updatedAt": "2025-08-05T03:05:53.511Z",
        "__v": 0
    },
    {
        "_id": "689175228a19f775ab1952ee",
        "name": "Create User",
        "apiPath": "/api/v1/users",
        "method": "POST",
        "module": "USERS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:06:10.045Z",
        "updatedAt": "2025-08-05T03:06:10.045Z",
        "__v": 0
    },
    {
        "_id": "689175288a19f775ab1952f1",
        "name": "Update User by ID",
        "apiPath": "/api/v1/users/:id",
        "method": "PUT",
        "module": "USERS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:06:16.778Z",
        "updatedAt": "2025-08-05T03:06:16.778Z",
        "__v": 0
    },
    {
        "_id": "689175328a19f775ab1952f4",
        "name": "Delete User by ID",
        "apiPath": "/api/v1/users/:id",
        "method": "DELETE",
        "module": "USERS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:06:26.307Z",
        "updatedAt": "2025-08-05T03:06:26.307Z",
        "__v": 0
    },
    {
        "_id": "6891756a8a19f775ab1952f8",
        "name": "Create Company",
        "apiPath": "/api/v1/companies",
        "method": "POST",
        "module": "COMPANIES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:07:22.482Z",
        "updatedAt": "2025-08-05T03:07:22.482Z",
        "__v": 0
    },
    {
        "_id": "689175718a19f775ab1952fb",
        "name": "Update Company by ID",
        "apiPath": "/api/v1/companies/:id",
        "method": "PUT",
        "module": "COMPANIES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:07:29.647Z",
        "updatedAt": "2025-08-05T03:07:29.647Z",
        "__v": 0
    },
    {
        "_id": "6891757b8a19f775ab1952fe",
        "name": "Delete Company by ID",
        "apiPath": "/api/v1/companies/:id",
        "method": "DELETE",
        "module": "COMPANIES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:07:39.704Z",
        "updatedAt": "2025-08-05T03:07:39.704Z",
        "__v": 0
    },
    {
        "_id": "689175858a19f775ab195301",
        "name": "Get Resumes with paginate",
        "apiPath": "/api/v1/resumes",
        "method": "GET",
        "module": "RESUMES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:07:49.554Z",
        "updatedAt": "2025-08-05T03:07:49.554Z",
        "__v": 0
    },
    {
        "_id": "6891758d8a19f775ab195304",
        "name": "Create Resume",
        "apiPath": "/api/v1/resumes",
        "method": "POST",
        "module": "RESUMES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:07:57.085Z",
        "updatedAt": "2025-08-05T03:07:57.085Z",
        "__v": 0
    },
    {
        "_id": "689175948a19f775ab195307",
        "name": "Update Resume by ID",
        "apiPath": "/api/v1/resumes/:id",
        "method": "PUT",
        "module": "RESUMES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:04.925Z",
        "updatedAt": "2025-08-05T03:08:04.925Z",
        "__v": 0
    },
    {
        "_id": "6891759c8a19f775ab19530a",
        "name": "Delete Resume by ID",
        "apiPath": "/api/v1/resumes/:id",
        "method": "DELETE",
        "module": "RESUMES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:12.615Z",
        "updatedAt": "2025-08-05T03:08:12.615Z",
        "__v": 0
    },
    {
        "_id": "689175a48a19f775ab19530d",
        "name": "Get Jobs with paginate",
        "apiPath": "/api/v1/jobs",
        "method": "GET",
        "module": "JOBS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:20.471Z",
        "updatedAt": "2025-08-05T03:08:20.471Z",
        "__v": 0
    },
    {
        "_id": "689175ae8a19f775ab195310",
        "name": "Create Job",
        "apiPath": "/api/v1/jobs",
        "method": "POST",
        "module": "JOBS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:30.200Z",
        "updatedAt": "2025-08-05T03:08:30.200Z",
        "__v": 0
    },
    {
        "_id": "689175b88a19f775ab195313",
        "name": "Update Job by ID",
        "apiPath": "/api/v1/jobs/:id",
        "method": "PUT",
        "module": "JOBS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:40.231Z",
        "updatedAt": "2025-08-05T03:08:40.231Z",
        "__v": 0
    },
    {
        "_id": "689175bf8a19f775ab195316",
        "name": "Delete Job by ID",
        "apiPath": "/api/v1/jobs/:id",
        "method": "DELETE",
        "module": "JOBS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:47.326Z",
        "updatedAt": "2025-08-05T03:08:47.326Z",
        "__v": 0
    },
    {
        "_id": "689175c68a19f775ab195319",
        "name": "Get Roles with paginate",
        "apiPath": "/api/v1/roles",
        "method": "GET",
        "module": "ROLES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:08:54.346Z",
        "updatedAt": "2025-08-05T03:08:54.346Z",
        "__v": 0
    },
    {
        "_id": "689175ce8a19f775ab19531c",
        "name": "Create Role",
        "apiPath": "/api/v1/roles",
        "method": "POST",
        "module": "ROLES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:02.486Z",
        "updatedAt": "2025-08-05T03:09:02.486Z",
        "__v": 0
    },
    {
        "_id": "689175d58a19f775ab19531f",
        "name": "Update Role by ID",
        "apiPath": "/api/v1/roles/:id",
        "method": "PUT",
        "module": "ROLES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:09.437Z",
        "updatedAt": "2025-08-05T03:09:09.437Z",
        "__v": 0
    },
    {
        "_id": "689175db8a19f775ab195322",
        "name": "Delete Role by ID",
        "apiPath": "/api/v1/roles/:id",
        "method": "DELETE",
        "module": "ROLES",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:15.897Z",
        "updatedAt": "2025-08-05T03:09:15.897Z",
        "__v": 0
    },
    {
        "_id": "689175e38a19f775ab195325",
        "name": "Get Permissions with paginate",
        "apiPath": "/api/v1/permissions",
        "method": "GET",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:23.997Z",
        "updatedAt": "2025-08-05T03:09:23.997Z",
        "__v": 0
    },
    {
        "_id": "689175ed8a19f775ab195328",
        "name": "Create Permission",
        "apiPath": "/api/v1/permissions",
        "method": "POST",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:33.146Z",
        "updatedAt": "2025-08-05T03:09:33.146Z",
        "__v": 0
    },
    {
        "_id": "689175f78a19f775ab19532b",
        "name": "Update Permission by ID",
        "apiPath": "/api/v1/permissions/:id",
        "method": "PUT",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:43.423Z",
        "updatedAt": "2025-08-05T03:09:43.423Z",
        "__v": 0
    },
    {
        "_id": "689175fc8a19f775ab19532e",
        "name": "Delete Permission by ID",
        "apiPath": "/api/v1/permissions/:id",
        "method": "DELETE",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "6890d7ced387f5b218e8c076",
            "email": "admin@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2025-08-05T03:09:48.102Z",
        "updatedAt": "2025-08-05T03:09:48.102Z",
        "__v": 0
    }
]