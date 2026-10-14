# Secrets API video

Remotion source for short videos about the WordPress Secrets API ([#66187](https://core.trac.wordpress.org/ticket/66187), [r64337](https://core.trac.wordpress.org/changeset/64337)), coming in WordPress 7.2.

There are two cuts:

- `linkedin`: about 80 seconds, for a general audience.
- `dev`: about 3 minutes, a code walkthrough for plugin developers and hosts.

There is also a `Thumbnail` still.

## Build

```bash
npm install
ENV_FILE=/path/to/.env npm run narrate:linkedin   # ElevenLabs narration; reads ELEVENLABS_API_KEY from ENV_FILE
npm run render:linkedin                           # writes out/secrets-api-linkedin-vN.mp4 and an .srt
npx remotion still src/index.ts Thumbnail out/thumbnail.png
```

Use `dev` in place of `linkedin` for the developer cut. Narration audio and renders aren't committed. `public/footage/demo.mp4` is a screen recording from a local test site, and the key it shows is fake.
