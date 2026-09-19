# Privacy Implementation Notes

This document describes the current implementation. It is not legal advice or a formal determination of compliance with any privacy law.

## Data Recorded

- Page path
- Referrer URL
- Browser user agent
- A shortened SHA-256 hash of the visitor IP
- Country and city headers when supplied by the hosting or proxy layer
- Timestamp

The guestbook separately stores the nickname and message a visitor chooses to submit, plus an IP hash used for rate limiting. Published guestbook entries are intentionally public.

## Privacy and Security Controls

### 1. No Cookies
You're not storing any cookies. The opt-out preference uses `localStorage`, which is:
- Not transmitted with HTTP requests
- Only stores the opt-out boolean
- Not used for tracking

### 2. Data Minimization

The raw IP address is not stored. The Edge Function hashes it and stores only a shortened value for analytics. However, hashed identifiers and technical metadata may still be regulated data depending on jurisdiction and context, so the public notice describes what is recorded rather than calling it “no personal data.”

### 3. User Control
Users can:
- See a notice that analytics are used
- Opt out with one click
- Have their preference remembered
- Opt back in if they change their mind

### 4. Data Security
- Row Level Security prevents anonymous public reads of analytics
- Authenticated access is required to read analytics under the current migration policy
- The application code sends analytics rows to the configured Supabase project
- Retention and authenticated-user access should be reviewed in the deployed Supabase project

Guestbook inserts go through an Edge Function using server-side service-role credentials. The function validates content, applies spam controls, and limits submissions by IP hash. Anonymous clients can read published guestbook rows but have no direct insert policy.

---

## How to Test the Opt-Out

1. Open your portfolio in browser
2. Open Developer Console (F12)
3. Run: `localStorage.setItem('analytics-opt-out', 'true')`
4. Refresh the page
5. Check console - you should see: `[Tracking] User opted out - skipping`
6. Or use the footer button in reader view

---

## Legal Review

Cookie and privacy requirements vary by jurisdiction and can depend on hosting, retention, access, and how identifiers are used. Keep the footer notice and opt-out control, set an appropriate retention period in Supabase, and obtain qualified legal advice if formal compliance assurance is required.

---

## Example Privacy Policy Clause

If you need to add this to a privacy policy:

> **Analytics**: This site uses cookie-free analytics to understand page visits and referral sources. It records the page path, referrer, browser user agent, coarse location headers when available, and a shortened hash of the visitor IP. You can opt out using the control in the site footer. The preference is stored in localStorage on your device.

---

## Summary

The implementation avoids cookies, limits direct public database permissions, hashes IP addresses before storage, and provides an opt-out. The public explanation must continue to describe the actual fields collected and should not promise legal compliance without a jurisdiction-specific review.
