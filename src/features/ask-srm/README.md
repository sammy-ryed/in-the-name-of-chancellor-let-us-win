# Ask SRM

The shared launcher opens university search from any route. On phones the launcher retracts to the SRM crest. Ctrl/Cmd + K opens the search field. The panel loads on first use.

Typing looks up matching pages in the local index. Submit a search for an AI overview alongside those pages. Editing and submitting the field starts an independent search. “Ask a follow-up” refines the current result using up to four previous exchanges. Search context stays in memory across the site's links. Clear search or refresh to start over.

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

`POST /api/ask-srm` accepts `{ mode: "search" | "ask", query, history? }`. History entries have a `user` or `assistant` role and a plain-text `content` field. The legacy `previous` question is also supported. Responses include `kind`, `sources` and an optional plain-text `answer`.

Each running instance admits up to three simultaneous Groq requests and 15 per minute, including second lookups. Multiple instances have independent limits. The directory remains available during bursts.

The server builds its index from the site's data under `catalogue.ts` and `site-guides.ts`. Update the underlying guide and its source together when dated information changes.

To check request validation, local guardrails and follow-up retrieval against a running preview, set `SRM_TEST_URL` and run `node --test scripts/ask-srm/route.test.mjs`. These regression tests do not call Groq.
