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

List and export send identical search/date/gate/vehicle/status filters. The existing
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
