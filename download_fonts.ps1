# Mansoo Font Downloader
# Run this script once from the repo root to download all required font files
# into app/src/main/res/font/

$fontDir = "app\src\main\res\font"
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null

$fonts = @(
    # Playfair Display
    @{ name = "playfair_display_regular";    url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" },
    @{ name = "playfair_display_medium";     url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" },
    @{ name = "playfair_display_semibold";   url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" },
    @{ name = "playfair_display_bold";       url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" },
    @{ name = "playfair_display_extrabold";  url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" },
    @{ name = "playfair_display_italic";     url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf" },
    @{ name = "playfair_display_bolditalic"; url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf" },

    # Poppins
    @{ name = "poppins_light";     url = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Light.ttf" },
    @{ name = "poppins_regular";   url = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf" },
    @{ name = "poppins_medium";    url = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf" },
    @{ name = "poppins_semibold";  url = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf" },
    @{ name = "poppins_bold";      url = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf" },
    @{ name = "poppins_extrabold"; url = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-ExtraBold.ttf" }
)

Write-Host "`n📦 Downloading Mansoo fonts into $fontDir`n" -ForegroundColor Cyan

foreach ($font in $fonts) {
    $dest = Join-Path $fontDir "$($font.name).ttf"
    if (Test-Path $dest) {
        Write-Host "  ✅ Already exists: $($font.name).ttf" -ForegroundColor Green
        continue
    }
    try {
        Write-Host "  ⬇ Downloading $($font.name).ttf ..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $font.url -OutFile $dest -UseBasicParsing
        Write-Host "  ✅ Done: $($font.name).ttf" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed: $($font.name) — $_" -ForegroundColor Red
    }
}

Write-Host "`n✅ All fonts downloaded. Now sync your project in Android Studio." -ForegroundColor Cyan
