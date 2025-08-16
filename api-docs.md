# Nexus Core API Documentation

This document provides comprehensive documentation for all APIs available in the Nexus Core server.

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Events](#events)
- [Forms](#forms)
- [Projects](#projects)
- [Issues](#issues)
- [Posts](#posts)
- [Achievements](#achievements)
- [Alumni](#alumni)
- [Team Members](#team-members)

## Authentication

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

### Verify Token
```http
GET /auth/verify
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

## Users

### Get All Users
```http
GET /user/get/all
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Field to sort by (default: 'fullName')
- `order` (optional): Sort order ('asc' or 'desc')
- `search` (optional): Search query
- `branch` (optional): Filter by branch
- `year` (optional): Filter by year

**Response:**
```json
{
  "users": [
    {
      "fullName": "string",
      "admissionNumber": "string",
      "branch": "string",
      "personalEmail": "string",
      "instituteEmail": "string"
    }
  ],
  "total": "number",
  "totalPages": "number",
  "currentPage": "number"
}
```

### Get User Stats
```http
GET /user/stats
```

**Response:**
```json
{
  "totalUsers": "number",
  "activeUsers": "number",
  "branchDistribution": {
    "branchName": "number"
  },
  "yearDistribution": {
    "year": "number"
  }
}
```

## Events

### Get All Events
```http
GET /event
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eventName": "string",
      "eventDate": "date",
      "eventDescription": "string",
      "eventType": "string",
      "eventPoster": "string",
      "eventStatus": "string",
      "eventImages": ["string"],
      "concatEventName": "string"
    }
  ]
}
```

### Create Event
```http
POST /event
```

**Request Body:**
```json
{
  "eventName": "string",
  "eventDate": "date",
  "eventDescription": "string",
  "eventType": "string",
  "eventPoster": "string",
  "eventStatus": "string",
  "eventImages": ["string"]
}
```

### Update Event
```http
PATCH /event/:id
```

### Delete Event
```http
DELETE /event/:id
```

## Forms

### Get All Forms
```http
GET /forms/all
```

### Create Form
```http
POST /forms/create
```

**Request Body:**
```json
{
  "name": "string",
  "desc": "string",
  "deadline": "date",
  "formFields": [
    {
      "questionText": "string",
      "type": "string",
      "required": "boolean",
      "options": ["string"]
    }
  ],
  "WaLink": "string",
  "enableTeams": "boolean",
  "teamSize": "number",
  "fileUploadEnabled": "boolean",
  "posterImageDriveId": "string",
  "extraLinkName": "string",
  "extraLink": "string",
  "isHidden": "boolean",
  "isOpenForAll": "boolean"
}
```

### Get Form Fields
```http
GET /forms/:id
```

### Get Form Responses
```http
GET /forms/get-responses/:id
```

## Projects

### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "githubLink": "string",
  "teamMembers": ["string"],
  "mentors": ["string"]
}
```

## Issues

### Get Issues
```http
GET /issue/admin
```

## Posts

### Get Post By ID
```http
GET /posts/:id
```

### Get Pending Posts
```http
GET /posts/pending
```

### Verify Post
```http
POST /posts/:postId/verify
```

## Achievements

### Get All Achievements
```http
GET /achievements
```

### Get Pending Achievements
```http
GET /achievements/pending
```

### Verify Achievement
```http
PATCH /achievements/verify/:id
```

### Unverify Achievement
```http
PATCH /achievements/unverify/:id
```

### Delete Achievement
```http
DELETE /achievements/:id
```

## Alumni

### Get All Alumni Details
```http
GET /alumni
```

### Get Companies and Expertise
```http
GET /alumni/get-companies-and-expertise
```

### Get Pending Alumni
```http
GET /alumni/pending
```

### Verify Alumni
```http
POST /alumni/verify/:id
```

### Reject Alumni
```http
POST /alumni/reject/:id
```

## Team Members

### Add Team Member
```http
POST /team/add
```

**Request Body (multipart/form-data):**
```
image: File
name: string
role: string
batch: string
email: string
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "role": "string",
  "batch": "string",
  "email": "string",
  "imageUrl": "string"
}
```
