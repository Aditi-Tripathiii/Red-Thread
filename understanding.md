# RedThread — Product Understanding

## The idea

RedThread is a scam-protection **Safety Mode** that identifies the full scam journey rather than judging a single message in isolation. It connects signals from SMS, email, calls, links, and screenshots to uncover the manipulation pattern building over time.

The goal is to warn a person *before* they click a link, send money, share an OTP, or disclose personal information.

## Core capabilities

- Create a timeline of related interactions across channels.
- Extract a unique behavioural pattern ("Scam DNA") from signals such as urgency, impersonation, suspicious links, OTP requests, payment requests, and requests for personal data or remote access.
- Generate an explainable risk score with the signals that caused it.
- Detect when a conversation is escalating toward payment, OTP theft, or data loss.
- Predict the scammer's likely next step with clear uncertainty.
- Give practical actions: verify, block, report, or ignore.

## Proposed stack

- Frontend: React and Next.js
- Backend: Node.js and Python
- AI: NLP, ML models, and LLMs
- Data: PostgreSQL and Redis
- Integration: REST APIs and webhooks
- Security: encryption and authentication
- Deployment: Docker and cloud infrastructure

## Recommended MVP

Start India-first with user-consented SMS, pasted text/links, and shared screenshots. Build deterministic, explainable scoring before relying on ML.

1. Normalize incoming events into a single timeline: source, timestamp, sender/identifier, text, URL, and consent/provenance.
2. Link identities such as phone numbers, email addresses, domains, UPI/payment handles, and account identifiers.
3. Build a transparent rules-based Scam DNA and risk-score engine.
4. Model escalation: contact → trust-building → urgency → OTP/credential request → payment, data, or remote-access demand.
5. Provide a Next.js dashboard showing cases, timelines, risk, explanations, likely next moves, and safe actions.
6. Use synthetic multi-channel scam journeys and legitimate examples for testing.

Email/call integrations, ongoing Android monitoring, and more advanced ML can follow after the core data model and rules have proved useful.

## Privacy and safety principles

- Obtain explicit user consent and request only the permissions needed.
- Minimize collected data and protect it with appropriate encryption and access controls.
- Make warnings explainable and do not present predictions as certain.
- Account for false positives with clear verification paths and safe language.
- Android is the initial mobile target because iOS limits SMS access.

## Open product decisions

- Web MVP with lightweight Android ingestion, or native Android first?
- User-initiated sharing only, or consented ongoing monitoring where policy permits?
- Which sources are essential in version one: SMS, links, screenshots, email, and/or calls?
- Who is the primary audience: consumers, families/caregivers, banks, or enterprises?
- What data retention, cloud/on-device processing, and reporting policies should apply?

