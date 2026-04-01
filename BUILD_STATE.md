# INNTW Project Build State

## Infrastructure
- **Repo**: https://github.com/INNTW/inntwproject.git
- **Branch**: main (with particle-atmosphere merged)
- **Vercel**: Auto-deploys from GitHub pushes
- **Domain**: inntwproject.com / www.inntwproject.com
- **Supabase**: vtnksjiopzwmlkpcfjhk (signups table with RLS)

## Current Issues
- [ ] LOGO NOT SHOWING — `public/inntw-logo.svg` is broken/non-rendering. Must replace with PNG.

## What Works
- Split-flap board animation with English letter flipping and cubic deceleration
- Particle canvas overlay
- Countdown timer (June 6, 2026 1:00 PM)
- Email/phone capture with consent tracking → Supabase
- Responsive tile sizing across all breakpoints
- Vercel auto-deploy pipeline

## Key Files
- `src/app/page.tsx` — Main page with 3-layer architecture
- `src/components/display/FullScreenBoard.tsx` — Split-flap grid
- `src/hooks/useGridDimensions.ts` — Responsive tile sizing
- `src/lib/vestaboard/charset.ts` — Flip path calculation
- `src/components/ParticleCanvas.tsx` — Particle system
- `src/components/CountdownTimer.tsx` — Countdown
- `src/components/EmailCapture.tsx` — Signup form
- `src/app/api/signup/route.ts` — Supabase API route
