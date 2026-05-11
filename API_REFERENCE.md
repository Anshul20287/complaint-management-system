# CityFix Verified System - API Reference

## 🔌 Complete API Endpoint Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except public ones) require:
```
Header: Authorization: Bearer {JWT_TOKEN}
```

---

## 📌 New Verified System Endpoints

### 1. Start Work
**Endpoint**: `PUT /complaints/:id/start-work`

**Description**: Staff marks complaint as "In Progress"

**Method**: PUT  
**Auth**: Required (staff)  
**Params**: 
- `id` - Complaint ID (URL path)

**Request Body**:
```json
{
  "remark": "Heading to the location now"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Work started successfully",
  "complaint": {
    "_id": "64abc123...",
    "status": "IN_PROGRESS",
    "statusHistory": [
      {
        "status": "IN_PROGRESS",
        "updatedBy": "staff_user_id",
        "role": "staff",
        "remark": "Heading to the location now",
        "timestamp": "2024-05-11T10:30:00Z"
      }
    ]
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Cannot start work on complaint with status: WORK_COMPLETED"
}
```

---

### 2. Complete Work (with Proof Images)
**Endpoint**: `PUT /complaints/:id/complete-work`

**Description**: Staff uploads proof images and marks work complete

**Method**: PUT  
**Auth**: Required (staff)  
**Content-Type**: multipart/form-data

**Parameters**:
- `id` - Complaint ID (URL path)

**Request Body** (multipart form):
```
{
  "remark": "Pothole filled, road repaired",
  "latitude": "28.6139",           // Required: staff's location
  "longitude": "77.2090",          // Required: staff's location
  "proofImages": [file1, file2...] // 1-10 image files
}
```

**Image File Details**:
- Maximum 10 files
- Each max 5MB
- Supported formats: jpg, jpeg, png, gif, webp
- System auto-labels as "before" or "after" based on upload order
  - First 50% → "before"
  - Last 50% → "after"

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Work completed successfully",
  "complaint": {
    "_id": "64abc123...",
    "status": "WORK_COMPLETED",
    "completedAt": "2024-05-11T14:45:00Z",
    "workProofImages": [
      {
        "url": "https://res.cloudinary.com/...",
        "type": "before",
        "uploadedAt": "2024-05-11T14:45:00Z"
      },
      {
        "url": "https://res.cloudinary.com/...",
        "type": "after",
        "uploadedAt": "2024-05-11T14:45:00Z"
      }
    ],
    "geoVerification": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "distance": 45,        // meters from complaint location
      "flagged": false       // true if distance > 500m
    }
  },
  "geoData": {
    "distance": 45,
    "flagged": false
  }
}
```

**Error Response** (400 - Missing GPS):
```json
{
  "success": false,
  "message": "GPS coordinates are required to complete work"
}
```

**Error Response** (400 - Wrong Status):
```json
{
  "success": false,
  "message": "Cannot complete work on complaint with status: ASSIGNED"
}
```

---

### 3. Verify Work (Citizen/Admin)
**Endpoint**: `PUT /complaints/:id/verify`

**Description**: Citizen verifies or rejects staff's work

**Method**: PUT  
**Auth**: Required (citizen or admin)  
**Content-Type**: application/json

**Parameters**:
- `id` - Complaint ID (URL path)

**Request Body**:
```json
{
  "verified": true,           // true = accept, false = reject
  "feedback": "Great work! The pothole is completely fixed"
}
```

**Response** (200 OK) - If verified:
```json
{
  "success": true,
  "message": "Complaint verified successfully",
  "complaint": {
    "_id": "64abc123...",
    "status": "RESOLVED",
    "verifiedAt": "2024-05-11T15:30:00Z",
    "resolvedAt": "2024-05-11T15:30:00Z",
    "citizenVerification": {
      "verified": true,
      "verifiedBy": "citizen_user_id",
      "verifiedAt": "2024-05-11T15:30:00Z",
      "feedback": "Great work! The pothole is completely fixed",
      "rejected": false
    }
  }
}
```

**Response** (200 OK) - If rejected:
```json
{
  "success": true,
  "message": "Work rejected, complaint reopened",
  "complaint": {
    "_id": "64abc123...",
    "status": "IN_PROGRESS",
    "citizenVerification": {
      "verified": false,
      "verifiedBy": "citizen_user_id",
      "verifiedAt": "2024-05-11T15:30:00Z",
      "feedback": "The pothole is still there, work incomplete",
      "rejected": true
    }
  }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "Only the complaint creator can verify work"
}
```

---

### 4. Reject Update (Admin Only)
**Endpoint**: `PUT /complaints/:id/reject-update`

**Description**: Admin rejects suspicious work completion

**Method**: PUT  
**Auth**: Required (admin only)  
**Content-Type**: application/json

**Parameters**:
- `id` - Complaint ID (URL path)

**Request Body**:
```json
{
  "reason": "GPS location mismatch - work completed 800m from complaint location"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Update rejected successfully",
  "complaint": {
    "_id": "64abc123...",
    "status": "REJECTED",
    "statusHistory": [
      {
        "status": "REJECTED",
        "updatedBy": "admin_user_id",
        "role": "admin",
        "remark": "GPS location mismatch - work completed 800m from complaint location",
        "timestamp": "2024-05-11T16:00:00Z"
      }
    ]
  }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "Only admins can reject updates"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Cannot reject complaint with status: OPEN"
}
```

---

### 5. Get Complaint Timeline
**Endpoint**: `GET /complaints/:id/timeline`

**Description**: View complete audit trail for a complaint

**Method**: GET  
**Auth**: Required  
**Params**: 
- `id` - Complaint ID (URL path)

**Response** (200 OK):
```json
{
  "success": true,
  "complaint": {
    "id": "64abc123...",
    "title": "Pothole on Main Street",
    "status": "RESOLVED",
    "createdBy": {
      "_id": "citizen_id",
      "name": "John Doe",
      "role": "citizen"
    },
    "assignedTo": {
      "_id": "staff_id",
      "name": "Jane Smith",
      "role": "staff"
    },
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "address": "Main Street, Downtown",
    "priority": "HIGH",
    "category": "Road",
    "geoVerification": {
      "latitude": 28.6150,
      "longitude": 77.2095,
      "distance": 150,
      "flagged": false
    }
  },
  "timeline": [
    {
      "type": "created",
      "timestamp": "2024-05-11T08:00:00Z",
      "actor": {
        "name": "John Doe",
        "role": "citizen"
      },
      "description": "Complaint created",
      "data": {
        "title": "Pothole on Main Street",
        "category": "Road"
      }
    },
    {
      "type": "status_change",
      "timestamp": "2024-05-11T09:30:00Z",
      "actor": {
        "name": "Admin User",
        "role": "admin"
      },
      "status": "ASSIGNED",
      "remark": "Assigned to Jane Smith",
      "description": "Status changed to ASSIGNED"
    },
    {
      "type": "status_change",
      "timestamp": "2024-05-11T10:30:00Z",
      "actor": {
        "name": "Jane Smith",
        "role": "staff"
      },
      "status": "IN_PROGRESS",
      "remark": "Heading to the location now",
      "description": "Status changed to IN_PROGRESS"
    },
    {
      "type": "proof_uploaded",
      "timestamp": "2024-05-11T14:45:00Z",
      "actor": {
        "name": "Jane Smith",
        "role": "staff"
      },
      "description": "4 proof images uploaded",
      "proofCount": 4
    },
    {
      "type": "status_change",
      "timestamp": "2024-05-11T14:45:00Z",
      "actor": {
        "name": "Jane Smith",
        "role": "staff"
      },
      "status": "WORK_COMPLETED",
      "remark": "Pothole filled, road repaired",
      "description": "Status changed to WORK_COMPLETED"
    },
    {
      "type": "verification",
      "timestamp": "2024-05-11T15:30:00Z",
      "actor": {
        "name": "John Doe",
        "role": "citizen"
      },
      "status": "VERIFIED",
      "description": "Work verified",
      "feedback": "Great work! The pothole is completely fixed"
    }
  ]
}
```

---

### 6. Get Staff Assigned Complaints
**Endpoint**: `GET /complaints/assigned/list`

**Description**: Get all complaints assigned to logged-in staff

**Method**: GET  
**Auth**: Required (staff)  
**Query Parameters**:
- `category` (optional) - Filter by category
- `status` (optional) - Filter by status

**Example**: 
```
GET /complaints/assigned/list?category=Road&status=IN_PROGRESS
```

**Response** (200 OK):
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "open": 0,
    "assigned": 1,
    "inProgress": 2,
    "workCompleted": 1,
    "resolved": 1,
    "urgent": 2
  },
  "complaints": [
    {
      "_id": "64abc123...",
      "title": "Pothole on Main Street",
      "category": "Road",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "address": "Main Street, Downtown",
      "createdAt": "2024-05-11T08:00:00Z",
      "createdBy": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

## 🔄 Status Flow Validation

### Valid Status Transitions

```
OPEN
  ↓ (Admin: assign)
ASSIGNED
  ↓ (Staff: start work)
IN_PROGRESS
  ↓ (Staff: complete work)
WORK_COMPLETED
  ↓ (Citizen/Admin: verify) OR (Admin: reject)
VERIFIED → RESOLVED  (or)  REJECTED
```

### What Each Role Can Do

| Role | Can Do |
|------|--------|
| **Citizen** | Verify/reject work on their own complaints |
| **Staff** | Start work, complete work (on assigned only) |
| **Admin** | Assign complaints, reject suspicious updates, verify |

---

## 📊 Example Workflows

### Workflow 1: Happy Path (Successful Verification)

```
1. POST /complaints → Create (status: OPEN)
2. PUT /complaints/:id/assign → Admin assigns (status: ASSIGNED)
3. PUT /complaints/:id/start-work → Staff starts (status: IN_PROGRESS)
4. PUT /complaints/:id/complete-work → Staff completes (status: WORK_COMPLETED)
5. PUT /complaints/:id/verify → Citizen verifies (status: VERIFIED → RESOLVED)
6. GET /complaints/:id/timeline → View complete history
```

### Workflow 2: Suspicious Update Detection

```
1-4. [Same as above]
5. PUT /complaints/:id/complete-work → GPS far away → flagged: true
6. PUT /complaints/:id/reject-update → Admin rejects (status: REJECTED)
7. [Complaint can be reassigned]
```

### Workflow 3: Citizen Rejects & Rework

```
1-4. [Same as above]
5. PUT /complaints/:id/verify (verified: false) → Status: IN_PROGRESS
6. PUT /complaints/:id/complete-work → Staff resubmits (status: WORK_COMPLETED)
7. PUT /complaints/:id/verify (verified: true) → Status: RESOLVED
```

---

## 🔐 Error Codes Reference

| Status | Code | Message | Solution |
|--------|------|---------|----------|
| 400 | Missing GPS | "GPS coordinates are required" | Provide latitude/longitude |
| 400 | Wrong Status | "Cannot start work on..." | Check current status |
| 403 | Not Assigned | "You are not assigned to this complaint" | Verify assignment |
| 403 | Not Creator | "Only the complaint creator can verify" | Correct user role |
| 403 | Not Admin | "Only admins can reject updates" | Use admin account |
| 404 | Not Found | "Complaint not found" | Check complaint ID |
| 500 | Server Error | "Image upload failed" | Check Cloudinary config |

---

## 🧪 Testing Commands

### Using cURL

```bash
# 1. Start Work
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/start-work \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"remark": "Work started"}'

# 2. Complete Work (with images)
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/complete-work \
  -H "Authorization: Bearer JWT_TOKEN" \
  -F "proofImages=@before.jpg" \
  -F "proofImages=@after.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "remark=Work completed"

# 3. Verify Work
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/verify \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verified": true, "feedback": "Great job!"}'

# 4. Get Timeline
curl -H "Authorization: Bearer JWT_TOKEN" \
  http://localhost:5000/api/complaints/COMPLAINT_ID/timeline
```

### Using Postman

1. Create collection: "CityFix Verified System"
2. Add requests for each endpoint
3. Set `{{token}}` variable for Authorization header
4. Create test environment with base_url and complaint_id
5. Run collection in sequence

---

## 📱 Frontend Integration Examples

### React Hook for Complete Work

```javascript
const handleCompleteWork = async (complaintId, formData) => {
  const multipartData = new FormData();
  multipartData.append('remark', formData.remark);
  multipartData.append('latitude', formData.latitude);
  multipartData.append('longitude', formData.longitude);
  
  formData.proofImages.forEach(file => {
    multipartData.append('proofImages', file);
  });
  
  try {
    const response = await api.put(
      `/complaints/${complaintId}/complete-work`,
      multipartData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

---

## 📈 Rate Limiting

Currently: No rate limiting (implement in production)

Recommended:
- 60 requests/minute per user
- 1000 requests/hour per IP
- File uploads: 10MB per request, 1GB per day per user

---

**Last Updated**: May 11, 2026  
**API Version**: 2.0.0  
**Status**: Production Ready
