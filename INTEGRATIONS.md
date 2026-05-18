# Integrations Setup

This document lists the third-party integrations that the site is ready to use once you provide credentials. Each section explains what to do in plain English and links the exact files where the credentials get plugged in.

## 1. Plausible Analytics

**What it does:** Privacy-first analytics. Tells you which pages people visit, where they come from, and what they click. No cookies, no GDPR banner needed.

**Cost:** $9 per month for up to 10,000 monthly page views.

**Setup steps:**

1. Go to plausible.io and create an account
2. Add `edquityatthemargins.org` as a new site
3. Plausible gives you a one-line script snippet that looks like:
   ```
   <script defer data-domain="edquityatthemargins.org" src="https://plausible.io/js/script.js"></script>
   ```
4. Paste that exact line into `index.html`, just before the closing `</head>` tag
5. Commit, push, redeploy

**Verifying it works:**
- After redeploy, visit your site in a private browser window
- Wait ~30 seconds
- Refresh the Plausible dashboard. You should see one page view registered.

**Alternative (free):** If $9/month is not in budget right now, Google Analytics 4 is free. The tradeoff is that GA4 requires a cookie consent banner under GDPR and a privacy policy update. Plausible avoids both.

---

## 2. Contact Form Backend (Resend)

**Current state:** The contact form at `/contact` shows a success message but does not actually send the message anywhere. It is a placeholder.

**What it should do:** When a family submits the form, send an email to `info@edquityatthemargins.org` with the family's name, email, subject, and message.

**Why Resend:** You already use Resend in the portal (`edquity-portal` project). Same vendor, same API key, less to manage.

**Setup steps:**

1. Confirm your Resend account at resend.com is verified for `edquityatthemargins.org` (per the portal email deliverability work)
2. Create or reuse the `RESEND_API_KEY` from the portal
3. Add a Vercel Function at `api/contact.ts` in this project (we will create that file together when you are ready)
4. Configure `RESEND_API_KEY` as a Vercel environment variable on the website project (not just the portal)
5. Update the form's `handleSubmit` in `src/pages/Contact.tsx` to POST to `/api/contact`

**Note:** This requires moving from a pure static site to a serverless-function-enabled deployment. Vercel supports this natively. The setup adds about 30 minutes of work once you have the API key.

**Simpler alternative:** Formspree.io ($10/month) handles the backend without writing any code. You add a single `action` URL to the form and they email submissions to you. No server function needed.

---

## 3. Newsletter Signup (Resend Audiences or Mailchimp)

**Current state:** The newsletter signup in the Footer also shows a success message but does not actually store the email anywhere.

**What it should do:** Save the subscriber to a list so you can email them updates about the work.

**Two options:**

### Option A: Resend Audiences (recommended)
- Free for up to 3,000 contacts
- Same vendor as your existing email sending
- Setup: Create an Audience at resend.com/audiences, get the Audience ID, add it to the signup form's API call

### Option B: Mailchimp
- Free for up to 500 contacts
- More features (templates, automations)
- Setup: Mailchimp embed code can replace the current form entirely

**Recommendation:** Resend Audiences for consistency with everything else.

---

## When you are ready

Tell me which integration you want to wire up first and provide:

- **For Plausible:** Just the snippet they give you, or confirm the account is created and I will look it up
- **For Resend contact form:** The `RESEND_API_KEY` value (you can set this in Vercel and tell me the variable name)
- **For Resend audiences:** The Audience ID from your Resend dashboard

I will wire each one in the order you choose.
