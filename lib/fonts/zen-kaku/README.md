# Zen Kaku Gothic New — subset

Soft Club's body/Japanese face, self-hosted as a subset (SIL OFL 1.1, see `OFL.txt`; the font has no
Reserved Font Name). The full Google Fonts version ships ~120 unicode-range slices per weight, which
made the Soft Club CSS render-blocking (~120 KB) and pulled ~280 KB of font files on Home.

Each file holds Basic Latin, Latin-1, Latin Extended-A (Turkish), general punctuation, arrows,
geometric shapes, CJK punctuation and the Japanese characters in `charset-ja.txt` (every kana/kanji
used by the Soft Club pages and references). Japanese text outside that set falls back to the system
Japanese font.

Regenerate after adding Japanese copy (fonttools + brotli; sources from github.com/google/fonts/tree/main/ofl/zenkakugothicnew):

```sh
pyftsubset ZenKakuGothicNew-Regular.ttf --text-file=charset-ja.txt \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0100-017F,U+2010-2027,U+2030-205E,U+20AC,U+2122,U+2190-2199,U+2212,U+25A0-25FF,U+3000-3003" \
  --layout-features='*' --flavor=woff2 --output-file=zen-kaku-gothic-new-400.woff2
# same for Medium → 500, Bold → 700, Black → 900
```
