# V-TALENT Physics — private LMS pilot deployment

Status: source only, NOT deployed or end-to-end tested. No account credentials or student data in GitHub. Public assessment uses browser-only scoring and public practice answers.

## Deployment gates
1. Create a PRIVATE Google Drive folder and Apps Script project; copy Code.gs. Do not share the folder publicly.
2. Prepare a private reviewed JSON bank matching physics-bank.json schema; do not reuse the public practice keys for formal/high-stakes tests. Independently verify questions, solutions, blueprint, grade coverage and fairness. Set Script Properties BANK_FILE_ID and ADMIN_EMAIL in Apps Script Project Settings.
3. Approve the actual privacy notice, lawful basis/guardian consent, purpose, access, retention/deletion and contact. Collect only necessary data; phone is optional guardian contact. Do not enable forms before approval. Verify Google Forms email collection mode is verified (requires sign-in), not free-text; otherwise do not automatically email results.
4. Run setupPhysicsPilot as the admin. Approve Drive, Forms, Sheets, Mail and trigger permissions. It creates a private spreadsheet, ten closed quiz forms, and ten triggers. If partially failed, inspect and repair manually; don't rerun blindly. Check Google quota and scope. Configure quiz grade release immediately if appropriate and verify with dummy accounts; Google Forms settings may require manual action. Publish forms only after approval; test before accepting real responses.
5. Deploy the admin web app separately, Execute as user accessing and access only administrator (or equivalent owner-restricted setting). Check access with unauthorized account. Do NOT use an anonymous deployment. The app also checks exact ADMIN_EMAIL.
6. Add only approved published student form links to the public website after verified testing; never link the private sheet or admin edit URLs publicly.
7. Test one synthetic submission per form: exact scoring, duplicate triggers, incorrect choices, email result, quota failure, formula-injection protection, dashboard totals and deletion workflow. Check form-response duplicates and retention in both Forms and Sheets. Establish manual recovery for mail errors; no auto retries in this draft.
8. Keep official assessment distinct from self-practice. Maintain a private versioned question bank and use controlled testing for admissions. Admin manages rows via private Google Sheets; web dashboard is read-only summary, not complete web CRUD.

## Data model
ATTEMPTS, ASSESSMENTS, STUDENTS, CLASSES, ENROLLMENTS, SYLLABUS, PROGRESS. ATTEMPTS records event-level data and mail delivery state. Student identity linking, class scheduling, role-based teacher permissions, audit log, retention automation, private student portal and full admin CRUD are not implemented. The student and syllabus tables are initialized empty, not yet synchronized to public syllabus.

## Security
No passwords, tokens, credentials or real student data in repository. Apps Script handles server-side scoring, identity access and mail. Keep private Drive data and form edit links restricted. No public API. Email only scores (not phone/school). Exact access/verified collection settings must be tested. Do not assume compliance from code alone.
