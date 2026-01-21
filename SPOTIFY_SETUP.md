# Spotify Now Playing Widget Kurulumu

Bu rehber, sitenizde Spotify "Now Playing" widget'ını kullanabilmeniz için gerekli adımları anlatır.

## 1. Spotify Developer Hesabı Oluşturma

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)'a gidin
2. Spotify hesabınızla giriş yapın
3. "Create App" butonuna tıklayın
4. App bilgilerini doldurun:
   - **App Name**: Portfolio Now Playing (veya istediğiniz bir isim)
   - **App Description**: Displays currently playing track on my portfolio
   - **Redirect URI**: `http://localhost:3000/callback` (önemli!)
   - Terms of Service'ı kabul edin
5. "Create" butonuna tıklayın

## 2. Client ID ve Secret Almak

1. Oluşturduğunuz uygulamaya tıklayın
2. "Settings" butonuna tıklayın
3. **Client ID** görünür olacak - kopyalayın
4. **Client Secret** için "View client secret" linkine tıklayın - kopyalayın

## 3. Refresh Token Almak

Bu biraz teknik bir süreç. Aşağıdaki adımları takip edin:

### Adım 3.1: Authorization URL Oluşturma

Aşağıdaki URL'i tarayıcınızda açın (YOUR_CLIENT_ID kısmını kendi Client ID'nizle değiştirin):

\`\`\`
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing%20user-read-playback-state
\`\`\`

### Adım 3.2: Yetkilendirme

1. Spotify izinlerini kabul edin
2. `http://localhost:3000/callback?code=XXXXX` şeklinde bir sayfaya yönlendirileceksiniz
3. URL'deki `code=` sonrasındaki değeri kopyalayın (bu sizin **Authorization Code**'unuz)

### Adım 3.3: Refresh Token Almak

Terminal veya command prompt'ta aşağıdaki komutu çalıştırın:

**Windows (PowerShell):**
\`\`\`powershell
$body = @{
    grant_type = "authorization_code"
    code = "YOUR_AUTHORIZATION_CODE"
    redirect_uri = "http://localhost:3000/callback"
}
$headers = @{
    Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("YOUR_CLIENT_ID:YOUR_CLIENT_SECRET"))
    "Content-Type" = "application/x-www-form-urlencoded"
}
Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" -Method Post -Headers $headers -Body $body
\`\`\`

**macOS/Linux (curl):**
\`\`\`bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=YOUR_AUTHORIZATION_CODE&redirect_uri=http://localhost:3000/callback"
\`\`\`

Yanıt şöyle görünecek:
\`\`\`json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQD...YOUR_REFRESH_TOKEN...",
  "scope": "user-read-currently-playing user-read-playback-state"
}
\`\`\`

**refresh_token** değerini kopyalayın!

## 4. Environment Variables Ayarlama

\`.env.local\` dosyanıza şunları ekleyin:

\`\`\`env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
\`\`\`

## 5. Widget'ı Kullanma

Widget'ı herhangi bir sayfada şu şekilde kullanabilirsiniz:

\`\`\`tsx
import SpotifyNowPlaying from '@/components/spotify-now-playing'

// Default stil
<SpotifyNowPlaying />

// Minimal stil (sadece şarkı adı ve sanatçı)
<SpotifyNowPlaying variant="minimal" />

// Card stili (albüm kapağı ile)
<SpotifyNowPlaying variant="card" />
\`\`\`

## Sorun Giderme

### "Spotify credentials not configured" hatası
- Environment variables'ların doğru ayarlandığından emin olun
- Sunucuyu yeniden başlatın

### Widget hiçbir şey göstermiyor
- Spotify'da aktif olarak bir şey çalıyor olmalı
- Podcast değil, müzik çalıyor olmalı

### 401 Unauthorized hatası
- Refresh token'ınızın süresi dolmuş olabilir
- Adım 3'ü tekrar yaparak yeni bir refresh token alın

---

Bu widget her 30 saniyede bir güncellenir ve Spotify'da aktif olarak bir şarkı çalarken bunu gösterir.
