from pathlib import Path
import json, re, xml.etree.ElementTree as ET
root=Path('brand')
orange='#E0501A'; cream='#F3F1EC'; ink='#12161D'; tile='#0B0E13'
def svg(body,box='0 0 64 64',label=None):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}"'+(f' role="img" aria-label="{label}"' if label else '')+f'>{body}</svg>\n'
def bars(a=orange,b=cream):
    return f'<rect x="16" y="24" width="8" height="16" rx="4" fill="{a}"/><rect x="28" y="12" width="8" height="40" rx="4" fill="{b}"/><rect x="40" y="20" width="8" height="28" rx="4" fill="{a}"/>'
base=f'<rect width="64" height="64" rx="16" fill="{tile}"/>'
files={
'concepts/concept-a.svg':svg(base+bars()),
'concepts/concept-b.svg':svg(base+f'<path d="M28 12H20L12 20V44L20 52H28V44H24L20 40V24L24 20H28Z" fill="{cream}"/><path d="M36 12H44L52 20V44L44 52H36V44H40L44 40V24L40 20H36Z" fill="{orange}"/>'),
'concepts/concept-c.svg':svg(base+f'<path d="M16 12H48V20H24V28H40V36H16Z" fill="{cream}"/><path d="M24 28H48V52H16V44H40V36H24Z" fill="{orange}"/>'),
'logo/mark.svg':svg(base+bars(),label='Second Voice'),
'logo/mark-flat.svg':svg(bars(orange,ink),label='Second Voice'),
'logo/mark-mono-dark.svg':svg(bars(ink,ink),label='Second Voice'),
'logo/mark-mono-light.svg':svg(bars(cream,cream),label='Second Voice'),
'logo/app-icon.svg':svg(f'<rect width="1024" height="1024" fill="{tile}"/><g transform="translate(128 128) scale(12)">{bars()}</g>','0 0 1024 1024', 'Second Voice'),
'logo/favicon.svg':svg(f'<rect width="32" height="32" rx="8" fill="{tile}"/><rect x="8" y="12" width="4" height="8" rx="2" fill="{orange}"/><rect x="14" y="6" width="4" height="20" rx="2" fill="{cream}"/><rect x="20" y="10" width="4" height="14" rx="2" fill="{orange}"/>','0 0 32 32','Second Voice')}
word=lambda x,y: f'<text x="{x}" y="{y}" fill="{ink}" font-family="Bricolage Grotesque, sans-serif" font-size="40" font-weight="700" letter-spacing="-1.2">Second</text><text x="{x+150}" y="{y}" fill="#B13E0F" font-family="Instrument Serif, serif" font-size="44" font-style="italic" font-weight="400">Voice</text>'
files['logo/lockup-horizontal.svg']=svg(f'<g transform="translate(16 16)">{base}{bars()}</g>'+word(100,62),'0 0 364 96','Second Voice')
files['logo/lockup-stacked.svg']=svg(f'<g transform="translate(118 16)">{base}{bars()}</g>'+word(26,142),'0 0 300 168','Second Voice')
for path,content in files.items(): (root/path).write_text(content)
# Contrast uses sRGB relative luminance; alpha colors are composited over bg first.
def rgb(h): return [int(h[i:i+2],16)/255 for i in (1,3,5)]
def lum(c): return sum(w*(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4) for w,v in zip((.2126,.7152,.0722),c))
def ratio(c,b):
    l1,l2=sorted((lum(c),lum(b))); return round((l2+.05)/(l1+.05),2)
light=dict(bg='#ECEEF1',surface='#FFFFFF',**{'surface-2':'#F4F5F7'},ink=ink,muted='#5A6371',line='#D8DCE2',accent=orange,**{'accent-ink':'#B13E0F','accent-soft':'#FBE5DA'},listen='#0E7468',**{'listen-soft':'#DCF1EE'},good='#167A3E',warn='#A75A07',bad='#B42020',screen=tile,**{'screen-ink':cream},amber='#A86A06',indigo='#4F55C9',rose='#B8336A')
dark=dict(bg='#0D1015',surface='#141920',**{'surface-2':'#1A2029'},ink='#EBEEF2',muted='#8E98A7',line='#252D38',accent='#FF6A2B',**{'accent-ink':'#FF8B58','accent-soft':'rgba(255,106,43,.14)'},listen='#2CCFBB',**{'listen-soft':'rgba(44,207,187,.12)'},good='#45C277',warn='#E7A23B',bad='#F06464',screen='#07090C',**{'screen-ink':cream},amber='#C98A1C',indigo='#7B80F0',rose='#EE6B9E')
roles=['Ana zemin','Ana yüzey','İkincil yüzey','Ana metin','İkincil metin','Ayırıcı','Marka vurgusu','Vurgu metni','Vurgu zemini','Dinleme','Dinleme zemini','Başarı','Uyarı','Hata','Konsol / logo zemini','Konsol metni','Amber kategori','Indigo kategori','Rose kategori']
palette={}
for mode,colors in [('light',light),('dark',dark)]:
    palette[mode]={}
    for (name,value),role in zip(colors.items(),roles):
        if value.startswith('rgba'):
            vals=list(map(float,re.findall(r'[\d.]+',value))); c=[v/255*vals[3]+b*(1-vals[3]) for v,b in zip(vals[:3],rgb(colors['bg']))]
        else: c=rgb(value)
        palette[mode][name]={'value':value,'role':role,'contrastAgainstBg':ratio(c,rgb(colors['bg']))}
fonts={'display':{'family':'Bricolage Grotesque','weight':700},'body':{'family':'Instrument Sans','weight':400},'subtitle':{'family':'Instrument Serif','weight':400,'style':'italic'},'mono':{'family':'JetBrains Mono','weight':400}}
measure={'viewBox':[0,0,64,64],'grid':4,'tileRadius':16,'barWidth':8,'barRadius':4,'gap':4,'bars':[{'x':16,'y':24,'height':16},{'x':28,'y':12,'height':40},{'x':40,'y':20,'height':28}],'clearSpace':8,'minimumScreenPx':{'mark':16,'flat':24,'horizontal':182,'stacked':150},'appIcon':{'canvas':1024,'origin':[128,128],'scale':12,'artBounds':[320,272,704,752]},'favicon':{'canvas':32,'scale':0.5}}
(root/'tokens.json').write_text(json.dumps({'brand':'Second Voice','recommendedConcept':'a','palette':palette,'fonts':fonts,'logo':measure,'typography':{'h1':{'size':48,'lineHeight':52,'weight':700},'h2':{'size':32,'lineHeight':36,'weight':700},'body':{'size':16,'lineHeight':25,'weight':400},'caption':{'size':12,'lineHeight':16,'weight':400},'subtitle':{'size':24,'lineHeight':32,'weight':400},'mono':{'size':12,'lineHeight':16,'weight':400}}},ensure_ascii=False,indent=2)+'\n')
tables=''
for mode,title in [('light','Açık mod — #ECEEF1 karşısında'),('dark','Koyu mod — #0D1015 karşısında')]:
    tables+=f'\n### {title}\n\n| Token | Rol | Değer | Kontrast |\n|---|---|---|---|\n'
    for name,v in palette[mode].items(): tables+=f"| {name} | {v['role']} | {v['value']} | {v['contrastAgainstBg']:.2f}:1 |\n"
(root/'BRAND.md').write_text('''# Second Voice — kompakt marka kılavuzu

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
'''+tables+'''
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
''')
for path in root.rglob('*.svg'): ET.parse(path)
json.loads((root/'tokens.json').read_text())
print(f'Validated {len(files)} SVG files and tokens.json.')
