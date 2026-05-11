# CityFix Verified System - Quick Start Testing Guide

## 🚀 Get Started in 10 Minutes

### Prerequisites
- Both frontend and backend running
- At least 3 test user accounts (citizen, staff, admin)
- Browser with location access enabled

---

## 📋 Quick Test Flow (5-10 min)

### Phase 1: Setup (1 min)
1. Open three browser windows/tabs:
   - **Tab 1**: Citizen Dashboard
   - **Tab 2**: Staff Dashboard  
   - **Tab 3**: Admin Dashboard

2. Log in to each:
   - Tab 1: Citizen account
   - Tab 2: Staff account
   - Tab 3: Admin account

---

### Phase 2: Create Complaint (1 min)

**In Tab 1 (Citizen):**
1. Click "Report Issue" / "New Complaint"
2. Fill form:
   ```
   Title: "Pothole on Main Street"
   Description: "Large pothole causing traffic hazard"
   Category: "Road"
   Priority: "HIGH"
   Address: "Main Street, Downtown"
   Location: (Auto or manual lat/lng)
   Image: (Upload any image)
   ```
3. Click "Submit"
4. **Copy the Complaint ID** (shown on confirmation)

---

### Phase 3: Assign to Staff (1 min)

**In Tab 3 (Admin):**
1. Go to "All Issues" / "Complaints"
2. Search for your complaint ID
3. Click "Assign" button
4. Select a staff member
5. Confirm assignment
6. **Staff should get notification**

---

### Phase 4: Staff Starts Work (2 min)

**In Tab 2 (Staff):**
1. Go to "Assigned Issues" or dashboard
2. Find your assigned complaint
3. Click on it
4. See "Start Work" option
5. Add remark: `"Heading to location"`
6. Click "Start Work"
7. **Status should change to IN_PROGRESS**

---

### Phase 5: Staff Completes Work (3 min)

**In Tab 2 (Staff):**
1. Same complaint should now show "Complete Work"
2. Click "Complete Work"
3. **Image Upload Section Appears:**
   - Upload 2-3 "Before" images (can be any images)
   - Upload 2-3 "After" images (can be different images)
4. **GPS Auto-captures** (watch the location fields)
5. Add remark: `"Pothole filled, road smooth"`
6. Click "Complete Work"
7. **You should see success message**
8. **Status should change to WORK_COMPLETED**

---

### Phase 6: Verify Images in Admin (1 min)

**In Tab 3 (Admin):**
1. Refresh or go back to "All Issues"
2. Click "Timeline" on your complaint
3. **Should see:**
   - Complete status history
   - Proof images in gallery
   - GPS information
   - "⚠️ No GPS mismatch" (if at same location)
4. **Click image thumbnails** to view full-size

---

### Phase 7: Citizen Verifies Work (2 min)

**In Tab 1 (Citizen):**
1. Go to "My Issues" / "My Complaints"
2. Find your complaint
3. **Status should show WORK_COMPLETED**
4. Click "Verify Work" button
5. **Verification Modal Opens:**
   - Shows proof images
   - Shows GPS verification status
   - Remarks about the work
6. Review images and decide:
   - **Option A**: Click "✓ Yes, Resolved" → Complaint closes
   - **Option B**: Click "✗ No, Reopen" → Work goes back to IN_PROGRESS

7. Try Option A first:
   - Add feedback: `"Great! Pothole is fixed"`
   - Click "Yes, Resolved"
   - **Status → RESOLVED** ✅

---

### Phase 8: Check Final Status (1 min)

**In Tab 3 (Admin):**
1. Refresh "All Issues"
2. Find your complaint
3. **Status should show RESOLVED** with green badge
4. Click "Timeline"
5. **Complete timeline shows:**
   - OPEN → ASSIGNED → IN_PROGRESS → WORK_COMPLETED → VERIFIED → RESOLVED
   - All actors (citizen, staff, admin)
   - All timestamps
   - All remarks

---

## 🧪 Optional: Test Rejection Scenarios

### Scenario A: Citizen Rejects Work

**In Phase 7, Step 6:**
- Select **Option B**: Click "✗ No, Reopen"
- Add feedback: `"Pothole still there, incomplete work"`
- Click "No, Reopen"

**Results:**
- Status goes back to IN_PROGRESS
- Staff gets notification to redo work
- Admin gets notification of rejection
- Complaint can be resubmitted

---

### Scenario B: GPS Mismatch (Test Suspicious Update)

**In Phase 5 (Staff Complete Work):**
1. Clear the latitude/longitude fields
2. Manually enter wrong coordinates:
   - Latitude: `28.61` (different from complaint)
   - Longitude: `77.21` (different from complaint)
3. Complete work
4. In Admin dashboard:
   - **Alert appears**: "⚠️ Suspicious GPS: 500m+ away"
   - Complaint highlighted in red
   - **Timeline shows** ⚠️ GPS mismatch alert

5. **Admin can now "Reject" the update**:
   - Click "Reject" button
   - Enter reason: `"GPS location mismatch - work not at complaint location"`
   - Confirm
   - Status → REJECTED
   - Staff notified to redo work

---

## ✅ Validation Checklist

After completing the quick test, verify:

### Backend ✅
- [ ] New status "WORK_COMPLETED" created
- [ ] Status history logs all changes
- [ ] Proof images uploaded to Cloudinary
- [ ] GPS distance calculated
- [ ] Notifications sent (check console/logs)

### Frontend - Citizen ✅
- [ ] "Verify Work" button appears at correct status
- [ ] Modal shows proof images
- [ ] Citizen can verify or reject
- [ ] Status updates correctly

### Frontend - Staff ✅
- [ ] "Start Work" button works
- [ ] "Complete Work" shows image upload section
- [ ] GPS auto-captures (or manual entry works)
- [ ] Status changes to WORK_COMPLETED

### Frontend - Admin ✅
- [ ] Timeline shows complete history
- [ ] Images display in gallery
- [ ] GPS distance shown
- [ ] Suspicious alert appears (if applicable)
- [ ] Can view full-size images

---

## 🐛 Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Images not uploading | Check Cloudinary API keys in `.env` |
| GPS not capturing | Ensure location permissions enabled in browser |
| Status not updating | Refresh page after action |
| Images not showing | Check Cloudinary credentials |
| "Verify Work" button missing | Check complaint status is exactly WORK_COMPLETED |

---

## 📊 What Gets Created During Test

| Item | Details |
|------|---------|
| Complaint | 1 new complaint with full history |
| Status Changes | 5-7 status transitions logged |
| Proof Images | 4-6 images uploaded to Cloudinary |
| Timeline Events | 10+ events recorded |
| Notifications | 5+ notifications generated |
| GPS Records | 1 verification record |

---

## 🎯 Success Criteria

✅ **Test Passed If:**
1. Complaint created successfully
2. Admin assigned it to staff
3. Staff marked work IN_PROGRESS
4. Staff uploaded images and completed work
5. Citizen received notification
6. Citizen could verify or reject
7. Final status was RESOLVED (or REJECTED)
8. Timeline showed complete audit trail
9. Images were viewable in gallery
10. No errors in console/logs

✅ **All 10 criteria passed = System is working!**

---

## 📝 Test Report Template

```
TEST DATE: ______________
TESTER: __________________

COMPLAINT ID: ________________
STAFF NAME: __________________

TEST RESULTS:
- Create Complaint: ☐ Pass ☐ Fail
- Assign Complaint: ☐ Pass ☐ Fail
- Start Work: ☐ Pass ☐ Fail
- Complete Work: ☐ Pass ☐ Fail
- Upload Images: ☐ Pass ☐ Fail
- Verify Work: ☐ Pass ☐ Fail
- View Timeline: ☐ Pass ☐ Fail

ISSUES FOUND:
1. ________________________
2. ________________________

NOTES:
_____________________________
_____________________________

OVERALL: ☐ Pass ☐ Fail
```

---

## 🚀 Next Steps After Test

1. **If all pass**: System is ready for production
2. **If failures**: Check specific issue in troubleshooting
3. **Load testing**: Create 50+ test complaints
4. **Performance testing**: Check response times
5. **User acceptance**: Get feedback from actual users

---

**Test Estimated Time**: 10-15 minutes
**Complexity**: Low (step-by-step flow)
**Success Rate Target**: 95%+

Happy Testing! 🎉
