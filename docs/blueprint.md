# **App Name**: Fraudster's Mirror

## Core Features:

- User Authentication: Firebase Authentication (Email, Google, Phone-OTP). Role-Based Access Control (RBAC) — enforced via Firebase Security Rules (User/Admin separation).
- Claim Submission Module: Dynamic Form: Claim details (Policy No, Amount, Description). Document Upload: PDF, JPG, PNG → stored in Firebase Storage. Upload progress indicator + drag-drop support (nice UX touch).
- AI Fraud Scoring: Analyze submitted claims (amount, history, text) + document results using Gemini/Genkit via Cloud Functions. Return: Risk Score (0-100) + Label (Low/Medium/High). Data stored in Firestore.
- Document Forgery Detection: Cloud Function calls Google Vision AI OCR or dummy AI. Checks: Forgery, missing fields, text manipulation. Result: "Passed" / "Forgery Suspected".
- Explainable AI Output: Display fraud reasons (e.g. 'Unusual claim amount', 'Signature mismatch').
- Real-Time Notifications: Firebase Cloud Messaging (FCM) — push alerts to Admin/Investigators on risky claims.
- Investigator Discussion: Firestore-based chat/comment thread on each claim. Role-protected (only Investigators/Admin).
- Admin Dashboard: View claims list, filter by Risk Score / Status / Date. Clickable claim detail view (with AI reason, document links). Status change (Approved/Rejected/Further Investigation).
- Fraud Geo-Heatmap: Use Google Maps API to show fraud-prone regions based on claim data.
- Blockchain Document Hashing: Hash each document (SHA-256) — stored in Firestore for integrity verification.

## Style Guidelines:

- Primary (Trust): #3B82F6 (Blue) - CTAs, Buttons — Professional
- Success: #10B981 (Green) - Approved claims, low risk
- Warning: #F59E0B (Amber) - Medium risk indicator
- Danger: #EF4444 (Red) - High fraud risk or alerts
- Background: #F9FAFB (Light Grey) - Clean, focused background
- Text: #111827 (Dark Grey) - Body text — easy reading
- Headline: Space Grotesk — Tech-forward, AI feel.
- Body: Inter — Highly readable.
- H1: 28–32px
- Body: 16px
- Small Info: 12–14px
- 2-panel Dashboard (Admin): Left: Navigation (Home, Claims, Alerts, Chat). Right: Main Content (Claim list → Detail → AI insight).
- Customer View: Simple form + claim status tracking.
- Mobile Responsive — Tailwind sm: md: lg: breakpoints.
- Claim Status: Shield, Document Icon
- Fraud Risk Level: Alert Circle, Check Circle
- Upload: Upload File
- Verified Document: Verified User Icon
- Notification/Alert: Notifications Active Icon
- Investigator Chat: Chat Bubble
- Loading Spinners — On document upload, fraud score calculation.
- Fade/Slide Transitions — Between dashboard views (Tailwind + Framer Motion).
- Snackbar Notifications — For success/error messages.
- No over-animation — Insurance/FinTech needs serious, clean UX.