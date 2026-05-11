# CityFix Verified Complaint Resolution System - Complete Implementation Guide

## 📋 Overview

The CityFix system has been upgraded with a real-world verified complaint resolution workflow that prevents staff from falsely marking complaints as resolved. The system now includes:

- ✅ Secure multi-stage status progression
- ✅ Proof image upload with geo-verification
- ✅ Citizen verification and approval required
- ✅ Complete audit trail for all actions
- ✅ Suspicious activity detection and flagging
- ✅ Admin oversight and complaint rejection capability

---

## 🔄 NEW COMPLAINT STATUS FLOW

```
OPEN (Citizen created)
  ↓
ASSIGNED (Admin assigned to staff)
  ↓
IN_PROGRESS (Staff started work)
  ↓
WORK_COMPLETED (Staff claims work finished + proof images)
  ↓
VERIFIED (Citizen or Admin verified work)
  ↓
RESOLVED (Final closure)

Alternative: REJECTED (If fake/invalid update detected)
```

### Key Rules:
- **Staff CANNOT directly resolve complaints** - they can only mark as IN_PROGRESS or WORK_COMPLETED
- **Only Citizens/Admins can verify** - citizen can verify their own complaint, or admin can verify
- **GPS verification is automatic** - if work is >500m away from location, it's flagged as suspicious
- **Proof images are required** - staff must upload before/after images when completing work
- **Audit trail is complete** - every action is logged with who, what, when, why

---

## 🛠️ BACKEND IMPLEMENTATION

### 1. Complaint Model (Database Schema)

**New Fields Added:**
```javascript
statusHistory: [
  {
    status: String,           // OPEN, ASSIGNED, IN_PROGRESS, WORK_COMPLETED, VERIFIED, RESOLVED, REJECTED
    updatedBy: User,          // Who made the change
    role: String,             // citizen, staff, admin
    remark: String,           // Why the change was made
    timestamp: Date           // When it happened
  }
]

workProofImages: [
  {
    url: String,              // Cloudinary URL
    type: String,             // 'before' or 'after'
    uploadedAt: Date
  }
]

citizenVerification: {
  verified: Boolean,          // Did citizen verify?
  verifiedBy: User,           // Which user verified
  verifiedAt: Date,
  feedback: String,           // Citizen's feedback
  rejected: Boolean           // Was it rejected?
}

geoVerification: {
  latitude: Number,           // Where staff was when completing
  longitude: Number,
  verified: Boolean,
  distance: Number,           // Distance from complaint location in meters
  flagged: Boolean            // True if >500m away
}

completedAt: Date             // When work was marked completed
verifiedAt: Date              // When verification happened
resolvedAt: Date              // Final resolution time
```

### 2. API Endpoints

#### Staff Endpoints
```
PUT /api/complaints/:id/start-work
  Body: { remark: String }
  Effect: ASSIGNED → IN_PROGRESS

PUT /api/complaints/:id/complete-work
  Body: {
    remark: String,
    latitude: Number,
    longitude: Number
  }
  Files: proofImages (multipart)
  Effect: IN_PROGRESS → WORK_COMPLETED
  Features: GPS distance calculation, proof image upload, geo-flagging
```

#### Citizen Endpoints
```
PUT /api/complaints/:id/verify
  Body: {
    verified: Boolean,
    feedback: String
  }
  Effect: 
    - If verified=true: WORK_COMPLETED → VERIFIED → RESOLVED
    - If verified=false: WORK_COMPLETED → IN_PROGRESS (reopen)
```

#### Admin Endpoints
```
PUT /api/complaints/:id/reject-update
  Body: { reason: String }
  Effect: WORK_COMPLETED → REJECTED
  Condition: Only if GPS is suspicious
  Notification: Staff and citizen notified
```

#### Timeline/Audit Endpoint
```
GET /api/complaints/:id/timeline
  Response: Complete timeline of all actions, status changes, remarks, verifications
```

### 3. Notifications System

Automatic notifications are sent for:
- ✅ Citizen: "Staff started work"
- ✅ Citizen: "Work completed, please verify"
- ✅ Staff: "Work verified successfully"
- ✅ Staff: "Work rejected, please redo"
- ✅ Admin: "Suspicious GPS detected during work completion"
- ✅ Admin: "Citizen rejected work update"

---

## 🎨 FRONTEND IMPLEMENTATION

### 1. Staff Dashboard (Staff App)

**New Components:**
- `WorkUpdateForm.jsx` - Modal for starting/completing work

**Features:**
- Start work with remarks
- Complete work with:
  - Before/after proof images
  - Automatic GPS location capture
  - Work remarks/notes
- GPS verification warning if location mismatch detected
- Image upload to Cloudinary

**Usage:**
```javascript
// In AssignedIssues or IssueQueue component
<WorkUpdateForm 
  complaint={complaint}
  onClose={() => setShowForm(false)}
  onSuccess={() => refreshComplaints()}
/>
```

### 2. Citizen Dashboard (Citizen App)

**Enhanced MyIssues Component:**
- Displays "Verify Work" button when status is WORK_COMPLETED
- Verification modal appears with:
  - Complaint details
  - Proof image gallery
  - Feedback textarea
  - "Yes, Resolved" / "No, Reopen" buttons

**Citizen Workflow:**
1. Staff completes work → Citizen receives notification
2. Citizen clicks "Verify Work"
3. Citizen reviews proof images and location
4. Citizen decides: "Yes (Verify)" or "No (Reopen)"
5. If yes → Complaint resolves. If no → Staff must redo work

### 3. Admin Dashboard (Admin App)

**Enhanced Components:**

#### AllIssues
- Shows all complaints with color-coded status
- Displays suspicious GPS alerts in red
- Action buttons:
  - **Timeline**: View complete audit trail
  - **Assign/Reassign**: Assign to staff
  - **Reject**: Admin can reject suspicious work completion
- Sidebar badge shows count of suspicious GPS detections

#### ComplaintTimeline
- Shows chronological history of every action
- Displays:
  - Who made changes and their role
  - Status transitions
  - GPS verification details
  - Proof images with before/after distinction
  - Citizen feedback and verification
- Images can be clicked to view full-size

#### ImageGallery (New Component)
- Thumbnail grid of proof images
- Click-to-expand full-size viewer
- Shows image type (before/after) and upload time

#### Alerts (Enhanced)
- Separated into "Critical Alerts" and "Notifications"
- Critical alerts include:
  - Suspicious GPS detections
  - Work rejections
  - Verification failures
- Each alert shows:
  - Alert type with icon
  - Title and details
  - Time received
  - Dismiss button

**Admin Workflow:**
1. Dashboard shows all complaints and any critical alerts
2. Click complaint to view timeline
3. Review proof images for approval
4. If suspicious (GPS far away), optionally click "Reject"
5. If rejected, staff gets notification and complaint status goes to REJECTED

---

## 📊 Status Code Reference

| Status | Meaning | Who Can Change | Next Status |
|--------|---------|---|---|
| OPEN | Complaint created | Citizen (first 3min) | ASSIGNED |
| ASSIGNED | Assigned to staff | Admin | IN_PROGRESS |
| IN_PROGRESS | Work in progress | Staff | WORK_COMPLETED |
| WORK_COMPLETED | Staff claims done | - | VERIFIED or REJECTED |
| VERIFIED | Citizen/Admin verified | - | RESOLVED |
| RESOLVED | Complaint closed | - | ✓ FINAL |
| REJECTED | Fake/invalid update | - | Re-open for assignment |

---

## 🔒 Security Features

### 1. GPS Verification
- Automatic distance calculation using Haversine formula
- Compares staff location at completion with complaint location
- Flags as suspicious if distance > 500 meters (configurable in `complaintController.js`)
- Admin gets alert for review

### 2. Proof Image Requirement
- Staff MUST upload proof images to complete work
- Images stored securely on Cloudinary
- Labeled as "before" and "after"
- Available for admin and citizen review

### 3. Citizen Verification
- Only complaint creator can verify work
- Prevents staff from self-approving
- Creates explicit approval record in audit trail
- Citizen can reject if not satisfied

### 4. Audit Trail
- Every status change is recorded
- Includes: who, what, when, why (remark)
- Complete timeline visible to admins
- Immutable history for investigation

### 5. Role-Based Access Control
- Staff: Only assigned staff can update assigned complaints
- Admin: Full oversight and rejection capability
- Citizen: Can only verify their own complaints

---

## 🧪 TESTING THE WORKFLOW

### Test Scenario 1: Successful Verification ✅

**Steps:**
1. **Citizen Role**: Create a complaint
   - Go to Citizen Dashboard → Report Issue
   - Fill form with location, description, category
   - Submit and note the complaint ID

2. **Admin Role**: Assign complaint to staff
   - Go to Admin Dashboard → All Issues
   - Find the complaint, click "Assign"
   - Select a staff member from category
   - Confirm assignment

3. **Staff Role**: Start work
   - Go to Staff Dashboard
   - Find assigned complaint in "My Assigned Issues"
   - Click complaint → Click "Start Work"
   - Add remarks like "Heading to location"
   - Confirm

4. **Staff Role**: Complete work
   - At the complaint location
   - Click "Complete Work"
   - Upload 2-3 before images showing the problem
   - Upload 2-3 after images showing the fix
   - GPS location auto-captures
   - Add remark: "Pothole filled and road repaired"
   - Confirm

5. **Citizen Role**: Verify work
   - Go to Citizen Dashboard → My Issues
   - Find complaint with status "WORK_COMPLETED"
   - Click "Verify Work"
   - Review proof images (before/after)
   - Read GPS verification: "Work location verified"
   - Click "Yes, Resolved" ✓
   - Add feedback: "Great job! The pothole is fixed"
   - Confirm

6. **Result**: 
   - Complaint status → RESOLVED ✓
   - Staff receives notification: "Work verified successfully"
   - Admin sees complaint in resolved list
   - Timeline shows complete audit trail

---

### Test Scenario 2: Suspicious GPS Detection & Rejection ⚠️

**Steps:**
1. **Setup**: Create and assign complaint (same as above)

2. **Staff Role**: Complete work from wrong location
   - At a location >500m away from complaint
   - Click "Complete Work"
   - Upload images
   - GPS captures wrong location
   - Confirm

3. **Admin Notification**: Admin gets alert
   - Dashboard shows red "Suspicious GPS" alert
   - Alert displays: "Staff completed work 800m away from location"
   - In "All Issues" table, complaint row highlighted in red

4. **Admin Review**: 
   - Click complaint row
   - View timeline
   - See GPS mismatch clearly marked ⚠️
   - Images show proof, but location is wrong

5. **Admin Rejection**:
   - Click "Reject" button
   - Enter reason: "GPS location mismatch - work not done at complaint location"
   - Confirm rejection

6. **Result**:
   - Complaint status → REJECTED
   - Staff receives notification: "Your work was rejected. Reason: GPS location mismatch..."
   - Complaint can be reassigned to another staff
   - Alert disappears from admin dashboard

---

### Test Scenario 3: Citizen Rejects Work & Reopens 🔄

**Steps:**
1. **Setup**: Follow steps 1-4 from Scenario 1

2. **Citizen Verification Fails**:
   - View "WORK_COMPLETED" complaint
   - Click "Verify Work"
   - Review images
   - Feedback: "The work is incomplete - pothole still there"
   - Click "No, Reopen" ✗

3. **Status Transition**:
   - Complaint status → IN_PROGRESS (back to work)
   - Staff receives notification: "Work rejected - please redo"
   - Admin receives notification: "Citizen rejected work"

4. **Staff Rework**:
   - Staff clicks "Complete Work" again
   - (Can upload different images proving completion)
   - Submits again

5. **Citizen Re-verification**:
   - Citizen verifies again
   - This time: "Yes, Resolved" ✓

---

### Test Scenario 4: Admin Direct Verification 🛡️

**Alternative**: If admin wants to verify without waiting for citizen:

1. **Setup**: Complaint in WORK_COMPLETED status

2. **Admin Action**: Use `/verify` endpoint with admin role
   - Currently: Citizen only endpoint
   - Enhancement: Add admin capability to verify directly
   - Call: `PUT /api/complaints/:id/verify` with `role: admin`

---

## 📱 API Testing with Postman/cURL

### Test API Endpoints Directly

```bash
# 1. Get staff complaints
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/complaints/assigned/list"

# 2. Start work
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/start-work \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"remark": "Work started"}'

# 3. Complete work with images
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/complete-work \
  -H "Authorization: Bearer TOKEN" \
  -F "proofImages=@before.jpg" \
  -F "proofImages=@after.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "remark=Work completed"

# 4. Verify work as citizen
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/verify \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verified": true, "feedback": "Great job!"}'

# 5. View timeline
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/complaints/COMPLAINT_ID/timeline"

# 6. Reject update as admin
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/reject-update \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "GPS mismatch detected"}'
```

---

## 🔧 Configuration

### GPS Verification Threshold
**Location**: `cityfix-backend/src/controllers/complaintController.js`

```javascript
const SUSPICIOUS_DISTANCE_THRESHOLD = 500; // meters

// Change this value to adjust sensitivity:
// 500m = Current (reasonable distance)
// 100m = Very strict
// 1000m = Very lenient
```

### Image Upload Settings
**Location**: `cityfix-backend/src/middlewares/uploadMiddleware.js`

```javascript
// Max file size
// Max number of files
// Allowed formats
```

### Cloudinary Configuration
**Location**: `cityfix-backend/src/config/cloudinary.js`

---

## 🚨 Common Issues & Troubleshooting

### Issue 1: GPS Always Shows as Suspicious
**Solution**: 
- Check if coordinates are being sent correctly
- Verify browser location permissions
- Check if `SUSPICIOUS_DISTANCE_THRESHOLD` is too low

### Issue 2: Images Not Uploading
**Solution**:
- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure `multipart/form-data` headers are correct

### Issue 3: Staff Can't Start Work
**Solution**:
- Verify staff is assigned to complaint
- Check staff is approved (`staffApprovalStatus: "approved"`)
- Verify complaint status is ASSIGNED or OPEN

### Issue 4: Citizen Can't Verify
**Solution**:
- Verify complaint status is WORK_COMPLETED
- Verify logged-in user is complaint creator
- Check notifications are enabled

---

## 📈 Future Enhancements

1. **Photo AI Verification**: Automatically detect if before/after images are at same location
2. **Blockchain Audit Trail**: Immutable record of all changes
3. **Predictive Analytics**: Flag suspicious patterns
4. **Mobile App**: Native apps for staff field work
5. **Real-time Tracking**: Track staff location during work
6. **Customer Satisfaction**: Rating system after resolution
7. **SLA Tracking**: Monitor response and resolution times

---

## 🎯 Key Metrics to Monitor

- **Average Complaint Resolution Time**: From OPEN to RESOLVED
- **Rejection Rate**: % of WORK_COMPLETED marked as REJECTED
- **Citizen Verification Rate**: % of work verified on first try
- **GPS Mismatch Rate**: % of flagged suspicious locations
- **Staff Performance**: Avg completion time per staff
- **Complaint Satisfaction**: Citizen feedback ratings

---

## 📞 Support

For questions or issues:
1. Check this guide's troubleshooting section
2. Review API response error messages
3. Check notification logs for hints
4. Verify user roles and permissions

---

**Last Updated**: May 11, 2026
**Version**: 2.0.0 (Verified Complaint Resolution System)
