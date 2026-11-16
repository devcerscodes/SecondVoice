# Second Voice — kompakt marka kılavuzu

> **Durum: final (2026-11-15).** Logo: **A — İki yankı** işareti ve "Second *Voice*" wordmark'ı. B ve C konseptleri `concepts/` klasöründe arşiv olarak durur; kullanılmaz.

## Uygulamadaki karşılığı

- **Favicon:** `index.html` → `brand/logo/favicon.svg`.
- **Rail ve mobil başlıktaki işaret** (`.brand-mark`, `styles.css`): `mark.svg`'nin yarım ölçeği. 32 × 32 px karo, köşe 8 px; çubuklar 4 px genişlik, 2 px aralık, 2 px uç yarıçapı; yükseklikler 8 / 20 / 14 px (16 : 40 : 28); sağ çubuk 1 px aşağıda (optik kayma). Renkler sabit #0B0E13 / #E0501A / #F3F1EC; koyu mod tokenları logoyu değiştirmez.
- **Hareket:** Çubuklar hâlâ seviye ölçer gibi oynar; animasyonun dinlenme pozu statik işarettir. `prefers-reduced-motion` açıkken işaret statik A karesinde durur.
- **Wordmark:** "Second" Bricolage Grotesque 700, -0.03em; "Voice" Instrument Serif italic, `--accent-ink`. Uygulamada HTML metin olarak yazılır, SVG kullanılmaz.

## Fikir ve seçim

**A — İki yankı.** Krem merkez çubuğu, iki turuncu ses iziyle birlikte tek bir donmuş dalga oluşturur. Soldaki kısa, sağdaki daha uzun yankı; ana dilin yanında büyüyen İngilizce sesi anlatır.

**B — Karşılıklı rezonans.** İki köşeli dalga parantezi, ortadaki açık kanalda birbirine cevap verir. Balon ya da mikrofon kullanmadan konuşma sırasını ve iki sesin ilişkisini görünür kılar.

**C — Sesin S izi.** İki basamaklı şerit, ortak merkezde birleşerek soyut bir S dalgası kurar. Krem ve turuncu parçalar, ayrı başlayan iki dilin tek bir ifade akışına dönüşmesini anlatır.

**Öneri: A.** Mevcut üç çubuklu işaretin tanınırlığını ve stüdyo konsolu hissini korur; 16 px'de üç açık sütun olarak okunur. Asimetrik 16:40:28 yükseklik ritmi sabit imzadır; rastgele bir ekolayzer durumuyla değiştirilmez. Bu öneri bir tasarım değerlendirmesidir; marka tescili veya benzersizlik araştırması yapılmamıştır.

## Yapı ve oranlar

64 × 64 birim tuval, 4 birim ana ızgara kullanılır. Koyu karonun köşe yarıçapı 16; üç çubuğun genişliği 8, aralığı 4, uç yarıçapı 4 birimdir. Sol çubuk (16,24), 8 × 16; merkez (28,12), 8 × 40; sağ (40,20), 8 × 28 ölçüsündedir. Çubuk merkezleri x=20,32,44; tümü y=32 yerine sağ çubukta y=34 kullanır: bu 2 birimlik optik kayma sağdaki gelişen yankıyı biraz aşağı taşır. Toplam dolu alan 32 × 40, yatay merkez x=32'dir.

Yatay kilit 364 × 96: karo (16,16), 64 × 64; metin başlangıcı (100,62), karo–metin boşluğu 20. İstifli kilit 300 × 168: karo (118,16); metin taban çizgisi y=142. Second 40 birim/700, Voice 44 birim/400 italic; iki sözcüğün başlangıçları arasında 150 birim vardır. Metinler düzenlenebilir `<text>` olarak bırakılmıştır; SVG font dosyası içermez. Doğru görünüm için Bricolage Grotesque ve Instrument Serif yüklenmelidir; baskı kopyasında fontlar doğrulandıktan sonra kontura çevrilebilir.

## Koruma alanı ve küçük boyut

Koruma alanı, 64 birimlik işarette her yönde en az 8 birimdir; kilitlerde aynı karo ölçeğine göre uygulanır. Dosyadaki boşluk koruma alanını karşılamıyorsa yerleşimde ek alan bırakılır. Karo işaret ve favicon en az 16 × 16 px, karosuz ve tek renk işaret en az 24 × 24 px kullanılır. Yatay kilit minimum 182 px, istifli kilit minimum 150 px genişliktedir; daha küçük alanlarda yalnızca işaret kullanılır.

Favicon 32 birim tuvalde yarım ölçekte yeniden çizilmiştir. 16 px gösterimde çubuklar 2 px, boşluklar 1 px olur; merkez 10 px yüksekliğe iner. Tam sayı CSS ölçüleri kullanın; ara ölçeklerden ve dönüşle yerleştirmeden kaçının.

## Renk sistemi

Aşağıdaki değerler mevcut styles.css tokenlarından alınmıştır. Kontrastlar WCAG sRGB bağıl parlaklık formülüyle ana zemin karşısında hesaplanır; yarı saydam renkler önce bu zemine birleştirilir. Oranlar iki ondalığa yuvarlanır. Normal metin için 4.5:1, büyük metin için 3:1 sınırı esas alınır; yüzey ve dekor renklerinin bu eşikleri sağlaması beklenmez. Turuncu accent açık zeminde normal metin yerine işaret ve vurgu içindir; metinde accent-ink kullanılır. Logo metni WCAG metin kontrastı yükümlülüğünden muaftır, fakat arayüz metni değildir.

### Açık mod — #ECEEF1 karşısında

| Token | Rol | Değer | Kontrast |
|---|---|---|---|
| bg | Ana zemin | #ECEEF1 | 1.00:1 |
| surface | Ana yüzey | #FFFFFF | 1.16:1 |
| surface-2 | İkincil yüzey | #F4F5F7 | 1.07:1 |
| ink | Ana metin | #12161D | 15.60:1 |
| muted | İkincil metin | #5A6371 | 5.22:1 |
| line | Ayırıcı | #D8DCE2 | 1.18:1 |
| accent | Marka vurgusu | #E0501A | 3.39:1 |
| accent-ink | Vurgu metni | #B13E0F | 5.07:1 |
| accent-soft | Vurgu zemini | #FBE5DA | 1.04:1 |
| listen | Dinleme | #0E7468 | 4.86:1 |
| listen-soft | Dinleme zemini | #DCF1EE | 1.01:1 |
| good | Başarı | #167A3E | 4.65:1 |
| warn | Uyarı | #A75A07 | 4.40:1 |
| bad | Hata | #B42020 | 5.70:1 |
| screen | Konsol / logo zemini | #0B0E13 | 16.63:1 |
| screen-ink | Konsol metni | #F3F1EC | 1.03:1 |
| amber | Amber kategori | #A86A06 | 3.82:1 |
| indigo | Indigo kategori | #4F55C9 | 5.20:1 |
| rose | Rose kategori | #B8336A | 4.86:1 |

### Koyu mod — #0D1015 karşısında

| Token | Rol | Değer | Kontrast |
|---|---|---|---|
| bg | Ana zemin | #0D1015 | 1.00:1 |
| surface | Ana yüzey | #141920 | 1.08:1 |
| surface-2 | İkincil yüzey | #1A2029 | 1.16:1 |
| ink | Ana metin | #EBEEF2 | 16.37:1 |
| muted | İkincil metin | #8E98A7 | 6.53:1 |
| line | Ayırıcı | #252D38 | 1.37:1 |
| accent | Marka vurgusu | #FF6A2B | 6.67:1 |
| accent-ink | Vurgu metni | #FF8B58 | 8.24:1 |
| accent-soft | Vurgu zemini | rgba(255,106,43,.14) | 1.18:1 |
| listen | Dinleme | #2CCFBB | 9.75:1 |
| listen-soft | Dinleme zemini | rgba(44,207,187,.12) | 1.22:1 |
| good | Başarı | #45C277 | 8.38:1 |
| warn | Uyarı | #E7A23B | 8.74:1 |
| bad | Hata | #F06464 | 6.09:1 |
| screen | Konsol / logo zemini | #07090C | 1.05:1 |
| screen-ink | Konsol metni | #F3F1EC | 16.88:1 |
| amber | Amber kategori | #C98A1C | 6.47:1 |
| indigo | Indigo kategori | #7B80F0 | 5.62:1 |
| rose | Rose kategori | #EE6B9E | 6.56:1 |

Ana logo sabit #0B0E13 / #E0501A / #F3F1EC kullanır; koyu mod arayüz tokenları logo dosyasını otomatik değiştirmez. Açık zeminde karosuz varyant turuncu ve #12161D kullanır. Tek renk koyu varyant açık zeminde, tek renk açık varyant koyu zeminde kullanılır; bu dosyalarda karo yoktur.

## Tipografi

| İşlev | Font | Boyut / satır yüksekliği | Ağırlık |
|---|---|---|---|
| H1 / display | Bricolage Grotesque | 48 / 52 px | 700 |
| H2 | Bricolage Grotesque | 32 / 36 px | 700 |
| Gövde | Instrument Sans | 16 / 25 px | 400 |
| Caption | Instrument Sans | 12 / 16 px | 400 |
| İngilizce altyazı / örnek | Instrument Serif italic | 24 / 32 px | 400 |
| Süre, ölçüm, konsol etiketi | JetBrains Mono | 12 / 16 px | 400; vurgu 600 |

Dar ekranlarda H1 36/40, H2 28/32 px olabilir. Serif, konuşulan İngilizceyi ekrandaki bir altyazı gibi ayırır; uzun açıklamalar gövde fontunda kalır. Wordmark'ta Second güvenli ve net, Voice daha kişisel ve seslidir. Font fallback sırası mevcut uygulamadaki ailelerle korunur; tokens.json birincil aileleri tanımlar.

## Ses ve ton

1. **Somut, küçük adım göster.** Yap: “Say it aloud once, then try it in your own sentence.” Yapma: “Unlock your limitless linguistic potential.”
2. **Yetişkin bir konuşma ortağı ol.** Yap: “Your point was clear. Try ‘I’d rather’ to make it sound more natural.” Yapma: “Wrong again! This is basic English.”
3. **Kanıta dayan, baskı kurma.** Yap: “You used that phrase naturally twice today.” Yapma: “You’ll sound like a native in seven days.”

## Yanlış kullanımlar

- İşareti esnetmeyin, eğmeyin veya döndürmeyin.
- Çubukların sırasını, yüksekliğini veya aralıklarını değiştirmeyin.
- Gölge, gradyan, kontur veya parlama eklemeyin.
- Ana logoyu rastgele renklendirmeyin; onaylı tek renk varyantlarını kullanın.
- Koruma alanına metin, çerçeve veya başka simge sokmayın.
- Wordmark fontlarını değiştirmeyin, Voice italik yapısını kaldırmayın veya küçük alanda tüm kilidi sıkıştırmayın.

## Uygulamalar

**App icon:** app-icon.svg 1024 × 1024, tam taşan #0B0E13 zemindir. İşaret 12 kat büyütülür ve (128,128) başlangıcına taşınır; dolu şekiller x=320–704, y=272–752 aralığındadır. Köşeler dosyada kesilmez: iOS veya platform kendi squircle maskesini uygular, ikinci bir karo çizilmez.

**Sosyal avatar:** Aynı app icon kompozisyonunu kare dışa aktarımda kullanın; dairesel kırpmada çubuklar güvenli merkez alanında kalır. Küçük avatar içine wordmark veya slogan eklemeyin.

**OG görseli, 1200 × 630:** #ECEEF1 zemin, 64 px dış kenar boşluğu. Sol üstte 364 × 96 yatay kilit; sol altta x=64, y=350 başlangıcında 64/70 px Bricolage Grotesque başlık “Grow your second voice.” ve altında 28/36 px Instrument Serif italic “One conversation at a time.” kullanılır. Sağda (880,195) konumunda 240 × 240 koyu karo ve işaret; alt solda 14 px mono “B2 → C1 · Speaking studio” yer alır. Bu bir yerleşim tarifidir, ek OG dosyası değildir.

**Sticker:** 48 × 48 mm koyu, yuvarlatılmış kare; ortada A işareti, çevresinde en az 6 mm boşluk. Turuncu ve krem düz mürekkeplerle basılır; küçük fiziksel ölçekte wordmark kullanılmaz.

## Statik ve hareketli işaretin ilişkisi

Statik A, uygulamadaki üç çubuklu animasyonun marka için seçilmiş donmuş karesidir: turuncu–krem–turuncu dizisini ve ses düzeyi metaforunu taşır. Eski CSS yüksekliklerinin birebir ekran görüntüsü değildir; 16:40:28 oranı küçük ölçekte okunurluk için yeniden dengelenmiştir. Gelecekte animasyon bu ana kareyi başlangıç ve dinlenme pozu olarak kullanabilir; bu teslimat uygulamadaki animasyonu değiştirmez. Tüm teslim edilen SVG'ler hareketsizdir.
