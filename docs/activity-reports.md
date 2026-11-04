# Activity report integration

The existing list and detail layouts use the unified Gate API report contract.

| Operation | Endpoint |
| --- | --- |
| Table and pagination | `GET /api/v1/activity-reports` |
| Detail | `GET /api/v1/activity-reports/{report_id}` |
| PDF / Excel | `GET /api/v1/activity-reports/export/pdf` or `/xlsx` |
| Notes | `PATCH /api/v1/logs/{detail_event_id}/notes` |
| Photos | Relative `photo_url`, resolved against `VITE_API_BASE_URL`, fetched with Bearer auth |

Detail URLs retain the existing path and add `?report_id=<id>` so refresh and
direct links do not depend on browser history state. If an attempt has become a
visit, the client resolves its visit ID through event detail and replaces the URL.

List and export send identical search/date/gate/vehicle/status filters. The
date filter is an inclusive Asia/Jakarta calendar-day range sent as
`start_date`/`end_date`; export requires a selected range (a single day counts). The existing
Auto Authorized / Operator Override choices use the server `authorization_mode`
filter so totals and exports match. Deploy/restart the matching Gate API version
which supports this optional parameter and per-side `operator_name`.

Visits map `entry` and `exit` independently. Attempts fill the existing side columns
only when their direction is known. Missing photos, timestamps, duration, and RFID
fields stay empty rather than defaulting to authorized/verified data. Notes use
the anchor event ID, never the visit/report ID.

Run `npm test` and `npm run build`. Model/API tests use Node's built-in runner and
do not need additional production dependencies. Browser verification used a
temporary local API with actual reports; note writes were intercepted in the test.

Denied access displays as `OPERATOR OVERRIDE` in dashboard, list, detail, and
history. This is a display alias: API access remains `denied` and no operator
approval is fabricated. The Operator Override filter includes denied attempts
as well as manually allowed events. Its requests omit `access_status=allowed`
and rely on the matching Gate API authorization-mode filter. Raw export access
values remain the actual access decisions.


Daily exports: Activity Logs selects one date at a time. Print PDF/Excel stay
disabled until a date is applied, while loading, and during another export.
Reset removes the date and disables both buttons. List and export share applied
filters; draft changes do not change an export until Apply Filters. Both use the
full Asia/Jakarta calendar day even in a browser configured in another timezone.
The API independently rejects missing dates and multi-day exports. All matching
rows are downloaded, independent of pagination. PDF is A4 portrait with actual
filters/metadata, display status labels, repeated headers, and Page X of Y.


IN/OUT observation pairs may have `row_type=detection_pair`, including denied
access. Both sides include their original `access_status` and nullable
`passed_at`. Existing UI mapping already uses `passed_at ?? captured_at`, so
paired observations display in the same entry/exit row without fabricating
permission or passage. Grouping, repeat suppression, filtering, pagination,
details, and exports are owned by the Gate API. A missing side stays blank.
