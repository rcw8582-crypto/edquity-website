"""Generates a 1200x630 social share card for every blog post.

Each post gets its own card carrying its headline, so a shared link shows the
article rather than one generic image repeated across the whole site. Cards
land in public/images/og/<slug>.jpg and the prerender pass points each post's
og:image at its own file.

Run after adding or retitling a post:

    python3 scripts/make-og-cards.py

Fonts live in scripts/og-fonts (SIL Open Font License, see the OFL files there).
"""
import os, re, glob, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "content", "posts")
FONTS = os.path.join(ROOT, "scripts", "og-fonts")
OUT = os.path.join(ROOT, "public", "images", "og")

S = 2                       # supersample, then downscale for clean edges
W, H = 1200 * S, 630 * S

NAVY = (18, 44, 84)         # brand navy  #122C54
NAVY_DEEP = (12, 31, 60)
CREAM = (243, 240, 232)
GREEN = (34, 197, 94)       # brand green #22C55E
AMBER = (251, 191, 36)      # brand amber #FBBF24
TEAL = (94, 212, 198)
RING = (52, 82, 130)
MIST = (168, 186, 210)


def font(name, px):
    return ImageFont.truetype(os.path.join(FONTS, name), px)


def frontmatter(raw):
    parts = raw.split("---")
    if len(parts) < 3:
        return None
    fm = {}
    for line in parts[1].splitlines():
        m = re.match(r'^([A-Za-z_]+):\s*"?(.*?)"?\s*$', line)
        if m:
            fm[m.group(1)] = m.group(2)
    return fm


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_tracked(d, xy, text, fnt, fill, tracking):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill)
        x += d.textlength(ch, font=fnt) + tracking


def card(title, section, path):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # Vertical wash, a touch deeper at the base so the headline sits forward.
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)],
               fill=tuple(round(NAVY[i] + (NAVY_DEEP[i] - NAVY[i]) * t) for i in range(3)))

    # Quiet instrument motif: concentric arcs bled off the right edge, echoing
    # the series graphic without competing with the type.
    cx, cy = int(W * 0.90), int(H * 0.50)
    for i, r in enumerate([160, 220, 280, 340]):
        r *= S
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=RING, width=(2 if i % 2 else 1) * S)
    r = 200 * S
    d.arc([cx - r, cy - r, cx + r, cy + r], -118, -62, fill=GREEN, width=9 * S)
    dot = 7 * S
    d.ellipse([cx - dot, cy - dot, cx + dot, cy + dot], fill=AMBER)

    # Left rule anchoring the text column.
    d.line([(64 * S, 92 * S), (64 * S, H - 92 * S)], fill=GREEN, width=5 * S)

    x = 104 * S
    eyebrow = font("GeistMono-Regular.ttf", 21 * S)
    draw_tracked(d, (x, 96 * S), "EDQUITY AT THE MARGINS", eyebrow, AMBER, 7 * S)

    # Headline: shrink until it fits three lines inside the safe width.
    max_w = int(W * 0.66)
    for size in (66, 60, 54, 48, 43):
        big = font("BricolageGrotesque-Bold.ttf", size * S)
        lines = wrap(d, title, big, max_w)
        if len(lines) <= 3:
            break
    lh = int(size * 1.24) * S
    y = int(H * 0.50) - (len(lines) * lh) // 2
    for ln in lines:
        d.text((x, y), ln, font=big, fill=CREAM)
        y += lh

    if section:
        lab = font("GeistMono-Regular.ttf", 23 * S)
        draw_tracked(d, (x, y + 26 * S), section, lab, TEAL, 3 * S)

    url = font("InstrumentSans-Regular.ttf", 25 * S)
    d.text((x, H - 118 * S), "edquityatthemargins.org", font=url, fill=MIST)

    img.resize((1200, 630), Image.LANCZOS).save(path, "JPEG", quality=88, optimize=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    made = 0
    for p in sorted(glob.glob(os.path.join(POSTS, "*.md"))):
        raw = open(p).read()
        fm = frontmatter(raw)
        if not fm or not fm.get("title"):
            continue
        slug = fm.get("slug") or re.sub(r"^\d{4}-\d{2}-\d{2}-", "", os.path.basename(p))[:-3]

        # Cite the primary regulation when the post is part of the Subpart E series.
        m = re.search(r"34 C\.F\.R\. § (300\.\d+)", raw)
        section = f"34 C.F.R. § {m.group(1)}" if m else ""

        card(fm["title"], section, os.path.join(OUT, f"{slug}.jpg"))
        made += 1
    print(f"wrote {made} card(s) to public/images/og")


if __name__ == "__main__":
    sys.exit(main())
