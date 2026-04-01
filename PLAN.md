# INNTW Project Plan

## Immediate Priority: Fix Logo

### DO NOT:
- Use SVG format for the logo (tried multiple times, does not work)
- Use Next.js `<Image>` component for the logo (caused issues)
- Try to convert formats — use the EXACT PNG the user provided

### DO:
1. Delete `public/inntw-logo.svg` (broken file)
2. Get `inntw-logo.png` into `public/` folder
   - PNG exists in sandbox at `/sessions/modest-wizardly-johnson/inntw-logo.png`
   - Transfer method: base64 encode in sandbox → write base64 as text file on user machine → decode with `base64 --decode` command
3. Update `page.tsx`: change `src="/inntw-logo.svg"` to `src="/inntw-logo.png"`
4. Commit all changes and push to trigger Vercel deploy
5. Verify on inntwproject.com

### Logo Positioning:
- Above countdown timer (timer is at top: 22%)
- Centered horizontally
- Position: top: 10%, centered with transform
- Size: clamp(36px, 5vw, 56px) width, auto height
- Opacity: 0.9
- Drop shadow for depth

## Future Tasks
- Continue iterating on UI/UX
- Monitor Supabase signups
- Prepare for June 6, 2026 launch
