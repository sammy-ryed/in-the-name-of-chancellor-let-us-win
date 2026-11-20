# Ask SRM

The shared launcher opens university search from any route. On phones the launcher retracts to the SRM crest. Ctrl/Cmd + K opens the search field. The panel loads on first use.

Typing looks up matching pages in the local index. A completed local answer opens immediately on submit. For questions that need AI, students can read the matching guide excerpts while the overview is being written. The follow-up field and suggested replies sit under the answer and use up to four previous exchanges. New search starts a separate conversation. After opening a result, you can start a search about the new page or resume the previous conversation with its original course context. Conversations stay in memory until you clear the search or refresh.

## Connect Groq

Set the following server variables in the ignored `.env.local`, then restart Next.js:

```dotenv
GROQ_API_KEY=your-groq-api-key
# Optional model override
GROQ_MODEL=openai/gpt-oss-20b
```

On a deployed site, set those variables for the intended environment and redeploy. Do not prefix either variable with `NEXT_PUBLIC_`. The server posts submitted questions, recent context and numbered public excerpts to [Groq chat completions](https://console.groq.com/docs/text-chat). It accepts only citations that map to entries in the site index. An additional lookup can retrieve missing evidence, translate a search into English or find both sides of a comparison.

Common greetings, private-record requests and obvious credentials have local responses. The server omits recognised credentials from recent turns and masks email addresses and mobile numbers in the text sent to Groq. Visitors should use their official portals for private records. When a detail is unverified, the assistant says so. During provider outages or rate limits it can still show local guide excerpts.

## API and maintenance

`POST /api/ask-srm` accepts `{ mode: "search" | "ask", query, history? }`. History entries have a `user` or `assistant` role and a plain-text `content` field. The legacy `previous` question is also supported. The client may send a public `page` pathname and, on `/programmes/compare`, the visible A/B/C course IDs in `compare`. The server resolves those IDs against the course catalogue. URL query strings, booking tokens and quiz answers are excluded from page context. Responses include `kind`, `sources`, and optionally a plain-text `answer` and `suggestions` for follow-up questions. A search response can include `resolved` when the server already has a complete local answer. The client reuses it only for the same question and page context.

Each running instance admits up to three simultaneous Groq requests and 15 per minute, including second lookups. On Vercel, each verified client IP can use at most eight of those calls per window. Counts stay in process memory. Multiple instances have independent limits. The directory remains available during bursts.

The server builds its index from the site's data under `catalogue.ts` and `site-guides.ts`. Update the underlying guide and its source together when dated information changes.

To check request validation, local guardrails and follow-up retrieval against a running preview, set `SRM_TEST_URL` and run `node --test scripts/ask-srm/route.test.mjs`. These regression tests do not call Groq.
