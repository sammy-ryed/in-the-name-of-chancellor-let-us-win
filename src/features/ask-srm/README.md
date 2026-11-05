# Ask SRM

The root layout mounts one site-search control. On phones it sits between the logo and the menu. On desktop it sits at the bottom centre. A first-visit tip introduces the field. Open it with the button or Ctrl/Cmd + K.

Typing searches published SRM pages, programmes, campus-specific fees, student services, clubs, housing, news and events. Enter asks a question. Results and sources appear in the same panel. “Ask a follow-up” carries the previous question into the next search. Closing the panel clears the conversation.

## Connect Grok

In this worktree’s root, add the following to the ignored `.env.local` file and restart Next.js:

```dotenv
XAI_API_KEY=your-xai-api-key
# Optional model override
XAI_MODEL=grok-4.7
```

For a Vercel branch preview, set the same server-side variables in the Preview environment and redeploy the branch. Only the API route reads the key. Typing uses the local index. Submitted questions with matching sources can call [xAI’s Responses API](https://docs.x.ai/developers/rest-api-reference/inference/responses). The server asks for a short answer and validates its source numbers before returning links from the catalogue. Without a key, during a provider failure, or when capacity is reached, the guide excerpts and links still work.

The route limits paid calls per running server instance (15 per minute, 3 at a time). Multiple Vercel instances have separate limits. For a production key, configure your xAI spending limit for the project.

## Team integration

The feature lives in this directory and `src/app/api/ask-srm/route.ts`. The only existing file edited to enable it is `src/app/layout.tsx`. Catalogue adapters read the other features’ exports. When dated admissions or placement facts change, update their summary in `catalogue.ts` along with the source guide.
