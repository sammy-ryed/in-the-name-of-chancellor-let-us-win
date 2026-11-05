# Ask SRM

Ask SRM stays at the top beside the desktop rail. On phones, tap the bottom-right Ask SRM button. Ctrl/Cmd + K opens search on either layout.

Typing searches published SRM pages, programmes, campus-specific fees, student services, clubs, housing, news and events. Enter asks a question. Results and sources appear in the same panel. “Ask a follow-up” carries the previous question into the next search. Closing the panel clears the conversation.

## Connect Groq

In the project root, add the following to the ignored `.env.local` file and restart Next.js:

```dotenv
GROQ_API_KEY=your-groq-api-key
# Optional model override
GROQ_MODEL=openai/gpt-oss-20b
```

For a Vercel branch preview, set the same server-side variables in the Preview environment and redeploy the branch. Only the API route reads the key. Typing uses the local index. Submitted questions use [Groq chat completions](https://console.groq.com/docs/api-reference). When a query has no direct matches, the server supplies a short university overview and section directory. The server asks for a short answer and validates its source numbers before returning links from the catalogue. Without a key, during a provider failure, or when capacity is reached, the guide excerpts and links still work.

The route limits paid calls per running server instance (15 per minute, 3 at a time). Multiple Vercel instances have separate limits.

## Team integration

The feature lives in this directory and `src/app/api/ask-srm/route.ts`. The only existing file edited to enable it is `src/app/layout.tsx`. Catalogue adapters read the other features’ exports. When dated admissions or placement facts change, update their summary in `catalogue.ts` along with the source guide.
