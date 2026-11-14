/* Second Voice — content. Everything the app teaches lives here. */
window.SV_DATA = (() => {

  /* ---------- 12-week plan ---------- */
  const phases = [
    { n: 1, name: 'Unlock', tr: 'Sesini aç', weeks: [1, 2, 3, 4],
      goal: 'Konuşma eşiğini kır: her gün sesli İngilizce üret, ritmi ve sesleri otomatiğe bağla.' },
    { n: 2, name: 'Stretch', tr: 'Konfor alanının dışı', weeks: [5, 6, 7, 8],
      goal: 'Hiç girmediğin durumlara gir: doktor, ev sahibi, şikâyet, farklı aksanlar, fikir savunma.' },
    { n: 3, name: 'Own it', tr: 'C1 gibi davran', weeks: [9, 10, 11, 12],
      goal: 'Nüans, ikna, mizah ve doğal tepkiler. Gerçek insanlarla konuş, finalde W1 kaydınla kıyasla.' }
  ];

  const weeks = [
    { w: 1, title: 'Warm-up & sounds', tr: 'Isınma ve sesler',
      goals: ['2 dakikalık başlangıç kaydını yap (kendini tanıt + son tatilini anlat)', 'Sound pairs: θ/ð ve w/v setlerinde %80 doğruluk', 'Her gün 10 dk shadowing', 'Dizi izlerken 5 yeni ifadeyi Vault\'a ekle'],
      speak: ['Role-play: Small talk at a party', 'Role-play: Returning a faulty product', 'Cue card: describe your hometown'],
      input: 'Bildiğin bir diziyi İngilizce altyazıyla izle, durdurup ifadeleri not et', shadowSet: 'everyday',
      record: 'Kendini tanıt ve geçen hafta sonunu anlat (2 dk)' },
    { w: 2, title: 'Talk to yourself', tr: 'Kendi kendine konuş',
      goals: ['Gün içinde 3 kez yaptığın işi sesli anlat (self-talk)', 'Phrasal verbs: Vault\'taki ilk 20 kartı öğren', '3 role-play bitir', 'Mutfak, temizlik, tamirat kelimelerini öğren: bilmediğin alanlar'],
      speak: ['Role-play: At the GP', 'Role-play: At the barber', 'Cue card: a routine you want to change'],
      input: 'BBC 6 Minute English, günde 1 bölüm, önce altyazısız', shadowSet: 'everyday',
      record: 'Bugün yaptığın her şeyi baştan sona anlat (2 dk)' },
    { w: 3, title: 'Connected speech', tr: 'Bağlı konuşma',
      goals: ['gonna / wanna / should\'ve / kinda biçimlerini duy ve kullan', 'Bir dizi sahnesini (30 sn) 10 kez shadow et', 'Podcast\'i 1.0 hızda altyazısız dinle', 'Traps quiz\'de 15/20 üstü'],
      speak: ['Role-play: Wrong order at a restaurant', 'Role-play: Blocked card at the bank', 'Cue card: a skill you learned recently'],
      input: 'Rachel\'s English: linking & reduction videoları', shadowSet: 'connected',
      record: 'Bir dizi sahnesini kendi cümlelerinle anlat' },
    { w: 4, title: 'Tell stories', tr: 'Hikâye anlat',
      goals: ['Past simple / continuous / perfect\'i hikâyede karıştırarak kullan', 'Bir bölümü 2 dakikada özetle', 'Storytelling shadow setini bitir', 'Kontrol noktası: W1 kaydını tekrar yap ve karşılaştır'],
      speak: ['Role-play: Witness statement', 'Cue card: a time something went wrong', 'Free talk: the funniest thing that happened to you'],
      input: 'This American Life ya da The Moth: gerçek hikâyeler', shadowSet: 'story',
      record: 'Kontrol noktası 1: W1 kaydını tekrar yap' },
    { w: 5, title: 'Unfamiliar I: services', tr: 'Bilinmeyen durumlar I',
      goals: ['Sağlık, banka ve resmî işler: her senaryonun ifade paketini öğren', '4 role-play, her birinde coach notlarını Vault\'a ekle', 'Telefonda konuşma pratiği: role-play\'i sadece sesle yap', 'Bir haftalık "zor kelime" listesini çıkar'],
      speak: ['Role-play: At the GP', 'Role-play: Blocked card at the bank', 'Role-play: Leaky ceiling: calling the landlord'],
      input: 'İngiltere\'de günlük hayat vlogları (doktor, kira, market)', shadowSet: 'everyday',
      record: 'Bir hastalığını ve tedavini detaylı anlat' },
    { w: 6, title: 'Unfamiliar II: problems', tr: 'Problem ve şikâyet',
      goals: ['Kibar ama kararlı dil: "I\'m afraid that\'s not acceptable"', 'Araba, kayıp bavul, iade: 4 senaryo', 'Hint butonunu kullanmadan bir senaryo bitir', 'Writing lab: resmî şikâyet e-postası'],
      speak: ['Role-play: Car trouble at the garage', 'Role-play: Lost luggage at the airport', 'Role-play: Returning a faulty product'],
      input: 'Tüketici programları (BBC Watchdog klipleri) ya da Reddit hikâyeleri sesli', shadowSet: 'everyday',
      record: 'Yaşadığın bir sorunu ve nasıl çözdüğünü anlat' },
    { w: 7, title: 'Accents & speed', tr: 'Aksanlar ve hız',
      goals: ['İngiliz, İskoç, Avustralya aksanlarından birer klip', 'Discourse marker\'ları kullan: mind you, to be fair, the thing is', 'Hızlı diyalog sahnesini 0.75 → 1.0 hızda shadow et', 'Konuşurken "umm" yerine filler ifadeler kullan'],
      speak: ['Free talk: compare Istanbul and London', 'Cue card: a person who influenced you', 'Role-play: Small talk at a party'],
      input: 'Derry Girls, Peaky Blinders ya da Ted Lasso: İngilizce altyazılı', shadowSet: 'nuance',
      record: 'Aynı paragrafı İngiliz ve Amerikan aksanını taklit ederek oku' },
    { w: 8, title: 'Opinions & disagreeing', tr: 'Görüş bildir',
      goals: ['Hedging: I\'d say, arguably, to some extent', 'Kibarca karşı çıkma kalıplarını kullan', 'AI ile 3 mini tartışma (remote work, AI, city life)', 'Kontrol noktası 2: 3 dakikalık görüş kaydı'],
      speak: ['Role-play: Disagreeing in a tech meeting', 'Free talk: Is remote work better?', 'Cue card: a decision you disagree with'],
      input: 'Intelligence Squared tartışmaları ya da TED talks (teknik olmayan)', shadowSet: 'work',
      record: 'Kontrol noktası 2: tartışmalı bir konuda 3 dk görüş' },
    { w: 9, title: 'Nuance & register', tr: 'Nüans ve üslup',
      goals: ['Aynı fikri 3 üslupta söyle (casual, neutral, formal)', 'Idiom kartlarının hepsini en az kutu 2\'ye taşı', 'Haftada 2 writing lab, C1 rewrite\'ları shadow et', 'Collocation odaklı tekrar'],
      speak: ['Free talk: explain your job to a 10-year-old', 'Role-play: Behavioural job interview', 'Cue card: an object you couldn\'t live without'],
      input: 'The Crown ya da Succession: register farkına dikkat', shadowSet: 'nuance',
      record: 'Aynı hikâyeyi önce arkadaşına, sonra müdürüne anlatır gibi kaydet' },
    { w: 10, title: 'Persuade & negotiate', tr: 'İkna ve pazarlık',
      goals: ['Maaş, deadline, scope pazarlığı: 3 role-play', 'Projeni teknik olmayan birine 2 dakikada anlat', 'Koşul cümleleri: If you could..., Would you be open to...', 'Tutor ya da dil partnerinle bir pazarlık role-play\'i yap'],
      speak: ['Role-play: Negotiating a raise', 'Role-play: Disagreeing in a tech meeting', 'Free talk: pitch a product idea'],
      input: 'How I Built This ya da Freakonomics Radio', shadowSet: 'work',
      record: 'Bir ürünü 90 saniyede sat (pitch)' },
    { w: 11, title: 'Natural reactions', tr: 'Doğal tepkiler',
      goals: ['Tepki ifadeleri: no way, fair enough, tell me about it', 'Kibarca araya girme ve konuyu değiştirme', 'Mizah ve ironi: Fleabag / The Office sahneleri', 'Haftada 2 gerçek konuşma (italki / Tandem)'],
      speak: ['Role-play: Small talk at a party', 'Free talk: the weirdest job you can imagine', 'Cue card: a celebration you remember'],
      input: 'Stand-up ya da talk show klipleri (fast, ironic)', shadowSet: 'nuance',
      record: 'Bir arkadaşla yaptığın diyaloğu iki karakteri de canlandırarak kaydet' },
    { w: 12, title: 'Final & next quarter', tr: 'Final ve sonrası',
      goals: ['Cue card\'larla IELTS Speaking tarzı deneme (Part 1-2-3)', 'Final kaydı: W1 ile aynı soruyu cevapla ve karşılaştır', 'Vault\'ta 150+ kart, 50+ mastered', 'Sonraki 12 hafta için yeni hedefler yaz'],
      speak: ['Cue card: mock exam', 'Role-play: Behavioural job interview', 'Free talk: what changed in 12 weeks'],
      input: 'Hiç izlemediğin bir türde film, altyazısız', shadowSet: 'nuance',
      record: 'Final: W1 kaydının sorusunu tekrar cevapla' }
  ];

  /* Weekly reading + writing, one pair per week. */
  const weekExtra = [
    ['The Martian: bölüm 1–4. Sesli kitapla birlikte oku.', 'Kendini tanıtan bir paragraf: işin, şehrin, hobilerin (150 kelime).'],
    ['The Martian: bölüm 5–9. Her bölümden 3 kelimeyi Word Lab\'e at.', 'Bir gününü saat saat anlatan günlük (150 kelime).'],
    ['The Martian: bölüm 10–14. Mark\'ın bir günlük kaydını sesli oku.', 'Son izlediğin diziyi bir arkadaşına anlatan mesaj: izlesin mi, izlemesin mi?'],
    ['The Martian: bölüm 15–20. Bir bölümü kitabı kapatıp 1 dakikada sesli özetle.', 'Başına gelen komik ya da kötü bir olayı hikâye gibi yaz (past tense\'leri karıştır).'],
    ['The Martian: bitir (bölüm 21–26).', 'Kliniğe belirtilerini anlatıp randevu isteyen bir e-posta.'],
    ['Normal People: bölüm 1–4. Diyalogları karakterin tonuyla sesli oku.', 'Resmî şikâyet e-postası: bozuk ürün ya da kayıp bavul.'],
    ['Normal People: bölüm 5–9. İrlanda İngilizcesine özgü ifadeleri işaretle.', 'İstanbul ile yaşamak istediğin bir şehri karşılaştıran kısa yazı.'],
    ['Normal People: bölüm 10–13 + bir uzun görüş makalesi.', 'Tartışmalı bir konuda görüş yazısı: remote work ya da AI (250 kelime).'],
    ['Normal People: bitir (bölüm 14–18).', 'Aynı mesajı üç üslupta yaz: arkadaşına, iş arkadaşına, müdürüne.'],
    ['Born a Crime: bölüm 1–6. Sesli kitabı Trevor Noah\'ın kendi sesinden dinle.', 'Maaş artışı ya da ek kaynak isteyen ikna edici bir e-posta.'],
    ['Born a Crime: bölüm 7–13. Komik anların nasıl kurulduğuna dikkat et.', 'Bir arkadaşına doğal tepkilerle dolu, esprili uzun bir mesaj.'],
    ['Born a Crime: bitir (bölüm 14–18) + bir uzun makale.', '12 haftada ne değişti? Kendine bir mektup ve sonraki çeyreğin hedefleri.']
  ];
  weeks.forEach((wk, i) => { wk.read = weekExtra[i][0]; wk.write = weekExtra[i][1]; });

  /* ---------- Advice by area ---------- */
  const areas = [
    { id: 'speak', name: 'Speaking', tr: 'Konuşma', c: 'accent', mins: 95, dose: '5 × 15 dk + hafta sonu 20 dk serbest konuşma',
      why: 'Asıl eksiğin burada. Anladığın İngilizceyi ağzından çıkarmanın tek yolu her gün sesli üretmek.',
      tips: [
        ['Her gün sesli konuş, içinden değil', 'Role-play ve cue card\'ları mırıldanarak değil, gerçekten sesli yap. Ağız kasların da öğreniyor.'],
        ['Önce akıcılık, sonra doğruluk', 'Hata yapınca durma, cümleyi bitir. Düzeltmeyi konuşma bittikten sonra coach notlarından yap.'],
        ['Hiç girmediğin durumları seç', 'İş ve yazılım gibi rahat konular seni B2\'de tutar. Doktor, ev sahibi, şikâyet gibi sahneleri öne al.'],
        ['Sahneden önce phrasebook', 'Role-play\'e girmeden ilgili durumun kalıplarını 5 dakika sesli oku, sonra bakmadan kullan.'],
        ['Self-talk', 'Gün içinde yaptığın işi İngilizce anlat: "Right, I\'m gonna make some coffee, then sort out that bug."']
      ],
      phase: ['Her gün 1 role-play ya da cue card. Hint\'leri rahatça kullan.', 'Hint kullanmadan bitir. Telefonda konuşur gibi yalnızca sesle yap.', 'Tartış, ikna et, espri yap. Aynı fikri farklı üsluplarla söyle.'],
      links: [['Role-play', 'speak', 'roles'], ['Phrasebook', 'speak', 'book'], ['Cue cards', 'speak', 'cue']] },
    { id: 'shadow', name: 'Pronunciation', tr: 'Telaffuz ve shadowing', c: 'listen', mins: 50, dose: '5 × 10 dk',
      why: 'Telaffuz, vurgu ve bağlı konuşma (gonna, should\'ve) dinleyerek değil, taklit ederek oturur.',
      tips: [
        ['Yarım saniye geriden takip et', 'Cümleyi duyduğun anda aynı tonla, aynı hızda tekrarla. Önce 0.75 hızda, sonra 1.0.'],
        ['Kelimeye değil melodiye odaklan', 'Hangi kelimenin vurgulandığını, cümlenin nerede yükselip alçaldığını kopyala.'],
        ['Zayıf sesleri kapat', 'Türkçede olmayan sesler: θ/ð (think/this), w/v, kısa-uzun i (ship/sheep), æ/e (bad/bed).'],
        ['Bir sahneyi 10 kez shadow et', 'Sevdiğin bir karakterden 30 saniyelik bir sahne seç, ezberleyene kadar taklit et.']
      ],
      phase: ['everyday ve connected setleri. θ/ð ve w/v\'de %80 doğruluk.', 'Farklı aksanlar: İngiliz, İskoç, Avustralya.', 'Hızlı ve ironik konuşma: talk show, stand-up.'],
      links: [['Shadow & sounds', 'shadow']] },
    { id: 'listen', name: 'Listening', tr: 'Dinleme ve input', c: 'ink', mins: 135, dose: '5 × 15 dk aktif + hafta sonu 60 dk uzun input',
      why: 'Dinlemede zaten iyisin. Buradaki amaç anlamak değil, duyduğun kalıpları çalmak.',
      tips: [
        ['Pasif değil aktif izle', 'Her bölümde 2-3 kez durdur ve "bunu ben nasıl söylerdim?" diye sor. Aradaki fark, öğrenmen gereken şey.'],
        ['Önce İngilizce altyazı, sonra hiç', 'Türkçe altyazı yok. Daha önce izlediğin dizilerde altyazıyı tamamen kapat.'],
        ['Türü değiştir', 'Hep aynı diziler kelimeni büyütmez. Her hafta yeni bir alan: tıp, hukuk, spor, tüketici programları.'],
        ['Duyduğunu özetle', 'Bölüm bitince 1 dakikada sesli özetle. Dinleme böylece konuşmaya dönüşür.']
      ],
      phase: ['Bildiğin diziler, BBC 6 Minute English, gerçek hikâyeler.', 'Vloglar, tüketici programları, farklı aksanlar.', 'Tartışmalar, iş podcast\'leri, stand-up, altyazısız film.'],
      links: [['Immersion', 'library']] },
    { id: 'read', name: 'Reading', tr: 'Okuma', c: 'indigo', mins: 90, dose: '6 × 15 dk, ideali yatmadan önce',
      why: 'B2\'den C1\'e geçerken kelime dağarcığını ve doğal kalıpları en hızlı okuma büyütür. Konuşmada kullanacağın cümleler önce kitapta karşına çıkar.',
      tips: [
        ['Sesli kitapla birlikte oku', 'Aynı bölümü hem dinle hem metinden takip et. Telaffuzu ve vurguyu da kitaptan öğrenirsin.'],
        ['Her kelimede durma', 'Bilmediğin kelimeyi bağlamdan tahmin et. Yalnızca tekrar tekrar çıkanları ya da çok merak ettiklerini Word Lab\'e at.'],
        ['Bölüm başına 3-5 kelime', 'Daha fazlası hem okumayı böler hem tekrarı imkânsız kılar.'],
        ['Bölümü sesli özetle', 'Bölüm bitince kitabı kapat, 1 dakikada ne olduğunu sesli anlat.'],
        ['Diyalogları yüksek sesle oku', 'Kitaptaki konuşmaları karakterin tonuyla oku. Hazır, doğal konuşma kalıpları.']
      ],
      phase: ['The Martian: eğlenceli, teknik, konuşma diline yakın.', 'Normal People: diyalog ağırlıklı, duygu ve ilişki dili.', 'Born a Crime + haftada bir uzun makale: hikâye ve fikir dili.'],
      books: [
        { t: 'The Martian', a: 'Andy Weir', w: 'W1–5', lvl: 'B2', tag: 'Bilim kurgu · esprili', bc: '#C4471B', why: 'Mühendis bakış açısı, günlük dil, bol iç ses. Sesli kitabı çok iyi.' },
        { t: 'Normal People', a: 'Sally Rooney', w: 'W6–9', lvl: 'B2+', tag: 'Roman · diyalog', bc: '#2E6B5E', why: 'Neredeyse tamamen konuşma. Duygu, ilişki ve sosyal durumlar için kelime.' },
        { t: 'Born a Crime', a: 'Trevor Noah', w: 'W10–12', lvl: 'B2+', tag: 'Anı · mizah', bc: '#C99A1D', why: 'Hikâye anlatımı ve ironi. Sesli kitabı yazarın kendi sesinden.' },
        { t: 'Project Hail Mary', a: 'Andy Weir', w: 'Yedek', lvl: 'B2', tag: 'Bilim kurgu', bc: '#3B4AA8', why: 'The Martian\'ı sevdiysen aynı tat, biraz daha zengin kelime.' },
        { t: 'Long reads', a: 'The Guardian Long Read · Wait But Why', w: 'Haftada 1', lvl: 'C1', tag: 'Makale', bc: '#2A2F38', why: 'Fikir ve argüman dili. 8. haftadaki görüş bildirme hedefine bağlanır.' }
      ],
      links: [['Word Lab', 'lab']] },
    { id: 'write', name: 'Writing', tr: 'Yazma', c: 'amber', mins: 50, dose: 'Haftada 2-3 × 20 dk, 150–250 kelime',
      why: 'Yazmak yavaşlatılmış konuşma gibidir. Cümleyi önce kafanda kurarsın, sonra sesli söylerken akıcı çıkar.',
      tips: [
        ['Essay yerine gerçek hayat metni', 'IELTS ya da TOEFL hedefin yoksa klasik akademik essay az şey kazandırır. E-posta, mesaj, yorum, günlük yaz.'],
        ['Kısa tut', '150-250 kelime yeter. Uzun metin yorar, kısa metni her hafta yazarsın.'],
        ['AI\'a düzelttir, C1 hâlini oku', 'Write bölümünde metnini değerlendir, sonra önerilen doğal versiyonu sesli oku.'],
        ['Yazdığını sesli anlat', 'Metne bakmadan aynı şeyi konuşarak anlat. Yazma böylece konuşmaya köprü olur.'],
        ['Düzeltmeleri Vault\'a ekle', 'Düzeltilen her kalıbı kart yap, bir sonraki hafta yine karşına çıksın.']
      ],
      phase: ['Günlük, kendini tanıtma, bir olayı anlatma.', 'Şikâyet e-postası, resmî mesaj, sorun anlatma.', 'Görüş savunma, ikna metni, aynı mesajı üç üslupta yazma.'],
      links: [['Write', 'write']] },
    { id: 'words', name: 'Vocabulary', tr: 'Kelime', c: 'rose', mins: 60, dose: '5 × 10 dk Vault + gerektikçe Word Lab',
      why: 'Tek kelime değil kalıp öğren. Anadili İngilizce olanlar hazır kalıplarla konuşur.',
      tips: [
        ['Cümle parçası kaydet', '"decision" yerine "make a tough call". Vault\'a hep kullanılabilir parçalar ekle.'],
        ['Her gün tekrar et', 'Vault kartları unutmana yakın geri gelir. Atladığın gün birikir, 10 dakikayı kaçırma.'],
        ['Kaynağıyla kaydet', 'Kitaptan, diziden ya da role-play\'den çıkan kelimeyi örnek cümlesiyle kaydet.'],
        ['Haftada bir quiz', 'Word Lab\'de kaydettiğin kelimelerden quiz çöz. Zayıf olanlar önce gelir.']
      ],
      phase: ['Günlük hayat ve phrasal verb\'ler: mutfak, ev, tamirat.', 'Sağlık, resmî işler, şikâyet kelimeleri.', 'Idiom, collocation, hedging ve discourse marker\'lar.'],
      links: [['Vault', 'words'], ['Word Lab', 'lab']] },
    { id: 'people', name: 'Real people', tr: 'Gerçek insanlar', c: 'good', mins: 40, dose: 'Haftada 1 × 30–45 dk, son aşamada 2',
      why: 'AI role-play iyi bir ısınma ama gerçek insanın yerini tutmaz. Beklenmedik soru, farklı aksan, heyecan: bunlar yalnızca gerçek konuşmada var.',
      tips: [
        ['Tutor ya da dil partneri bul', 'Preply ya da iTalki\'de bir tutor, Tandem ya da HelloTalk\'ta bir dil partneri.'],
        ['Konuyu önceden seç', 'Görüşmeden önce o haftanın role-play konusunu söyle. Tutor\'a doktor ya da ev sahibi rolünü oynat.'],
        ['Görüşmeden sonra 3 not', 'Takıldığın 3 anı yaz. Bunları Vault\'a ve bir sonraki haftanın hedeflerine ekle.'],
        ['Kayıtlarını karşılaştır', 'W1\'de 2 dakikalık bir kayıt al. W4, W8 ve W12\'de aynı soruyu tekrar cevapla.']
      ],
      phase: ['W1 başlangıç kaydı. W3 ya da W4\'te ilk deneme görüşmesi.', 'Haftada 1 görüşme. W8 kontrol noktası kaydı.', 'Haftada 2 görüşme. W12 final kaydı.'],
      links: [['Immersion', 'library']] }
  ];

  const selfTalk = [
    'Sabah rutinini anlatırken her adımı İngilizce söyle',
    'Bugün yazdığın kodu bir meslektaşa anlatır gibi sesli açıkla',
    'Market alışverişinde aklından geçenleri İngilizce düşün',
    'Yemek yaparken tarifi bir YouTube videosu çekiyormuş gibi anlat',
    'Yürürken gördüğün 10 şeyi detaylı tarif et',
    'Bugün seni sinirlendiren bir şeyi İngilizce şikâyet ederek anlat',
    'Yarın için planlarını İngilizce sesli kur'
  ];

  const principles = [
    { t: 'Anlamak ≠ üretmek', d: 'Pasif bilgin (anladığın) aktif bilginden (kullandığın) çok daha geniş. Seviye atlamak pasifi aktife çevirmek demek. Bu yüzden planın yarısı output: konuşmak ve yazmak.' },
    { t: 'Kelime değil kalıp öğren', d: '"Decision" yerine "make a tough call", "problem" yerine "sort it out". Ana dili İngilizce olanlar hazır kalıplarla konuşur. Vault\'a hep cümle parçası ekle.' },
    { t: 'Shadowing ile ritim', d: 'Duyduğunu yarım saniye geriden aynı tonla tekrarla. Telaffuz, vurgu ve bağlı konuşma kaslarını kurar. Günde 10 dakika, her gün.' },
    { t: 'Aralıklı tekrar', d: 'Unutmadan hemen önce tekrar etmek hafızayı kalıcı yapar. Vault kartları 1-3-7-16-35 gün aralıkla geri gelir.' },
    { t: 'Fark et ve çal', d: 'Dizide "bunu ben nasıl söylerdim?" diye durdur. Senin cümlenle onlarınki arasındaki fark tam öğrenmen gereken şey.' },
    { t: 'Konfor alanı dışında input', d: 'Hep yazılım ve hep aynı diziler seni B2\'de tutar. Her hafta yeni bir tür ekle: tıp, hukuk, spor, aksanlı diziler.' },
    { t: 'Kaydet, dinle, düzelt', d: 'Kendi sesini dinlemek en hızlı geri bildirimdir. 4, 8 ve 12. haftalarda aynı konuyu kaydedip karşılaştır.' },
    { t: 'Önce akıcılık, sonra doğruluk', d: 'Konuşurken durup düzeltme. Önce mesajı ilet, sonra coach notlarına bakıp doğrusunu Vault\'a ekle.' }
  ];

  const routine = {
    weekday: [
      { min: 10, k: 'words', t: 'Vault tekrarı' },
      { min: 10, k: 'shadow', t: 'Shadowing' },
      { min: 15, k: 'speak', t: 'Konuşma: role-play / cue card' },
      { min: 15, k: 'input', t: 'Aktif input: dizi / podcast' }
    ],
    weekend: 'Cumartesi: uzun input (film/bölüm) + writing lab + haftalık ses kaydı. Pazar: hafif tekrar, haftanın hedeflerini işaretle, serbest konuşma.'
  };

  /* ---------- Role-play scenarios ---------- */
  const scenarios = [
    { id: 'gp', title: 'At the GP', where: 'Doctor\'s surgery, UK', level: 'B2+', tag: 'Health',
      role: 'a friendly but busy GP (family doctor) in London', learner: 'a patient with a persistent cough, mild fever and trouble sleeping for a week',
      setup: 'A 10-minute GP appointment. The doctor asks about symptoms, duration, medication, allergies and gives advice or a prescription.',
      goal: 'Belirtilerini detaylı anlat, ilaç ve alerji sorularını cevapla, reçeteyi anla.',
      phrases: [['I\'ve had a nasty cough for about a week.', 'Bir haftadır kötü bir öksürüğüm var.'], ['It gets worse at night.', 'Geceleri kötüleşiyor.'], ['I\'m running a slight temperature.', 'Hafif ateşim var.'], ['I\'m not allergic to anything, as far as I know.', 'Bildiğim kadarıyla alerjim yok.'], ['How often should I take these?', 'Bunları ne sıklıkla almalıyım?'], ['Are there any side effects?', 'Yan etkisi var mı?'], ['Should I come back if it doesn\'t clear up?', 'Geçmezse tekrar gelmeli miyim?']] },
    { id: 'landlord', title: 'Leaky ceiling: calling the landlord', where: 'Phone call', level: 'B2+', tag: 'Home',
      role: 'a slightly reluctant landlord who tries to delay the repair', learner: 'a tenant whose bathroom ceiling has been leaking since yesterday',
      setup: 'A phone call. Water is dripping from the bathroom ceiling, probably from the flat upstairs. The landlord tries to postpone; the tenant must get a firm date.',
      goal: 'Sorunu net anlat, kibar ama kararlı ol, net bir tamir tarihi al.',
      phrases: [['Water\'s been dripping through the bathroom ceiling since yesterday.', 'Dünden beri banyo tavanından su damlıyor.'], ['I think it\'s coming from the flat upstairs.', 'Sanırım üst kattaki daireden geliyor.'], ['There\'s a damp patch and it\'s spreading.', 'Nemli bir leke var ve büyüyor.'], ['I\'m afraid it can\'t wait until next week.', 'Korkarım gelecek haftayı bekleyemez.'], ['Could you send a plumber round today?', 'Bugün bir tesisatçı gönderebilir misiniz?'], ['I\'d like that in writing, please.', 'Bunu yazılı olarak rica ediyorum.']] },
    { id: 'garage', title: 'Car trouble at the garage', where: 'Mechanic\'s garage', level: 'C1', tag: 'Car',
      role: 'a mechanic who uses lots of technical car vocabulary and suggests expensive extras', learner: 'a driver whose car makes a grinding noise when braking',
      setup: 'The learner brings a car to a garage. The mechanic diagnoses it, explains the problem and quotes a price, pushing some extra work.',
      goal: 'Sesi ve belirtiyi tarif et, fiyat sor, gereksiz işi kibarca reddet.',
      phrases: [['It makes a grinding noise when I brake.', 'Fren yapınca sürtünme sesi çıkarıyor.'], ['The warning light came on this morning.', 'Uyarı ışığı bu sabah yandı.'], ['Roughly how much will that set me back?', 'Bu bana aşağı yukarı kaça patlar?'], ['Is that absolutely necessary right now?', 'Bu şu an gerçekten şart mı?'], ['Let\'s just do the brakes for now.', 'Şimdilik sadece frenleri yapalım.'], ['When can I pick it up?', 'Ne zaman alabilirim?']] },
    { id: 'luggage', title: 'Lost luggage at the airport', where: 'Heathrow baggage desk', level: 'B2', tag: 'Travel',
      role: 'a tired airline baggage-desk agent following procedure', learner: 'a traveller whose suitcase did not arrive on a flight from Istanbul',
      setup: 'Baggage desk after landing. The agent needs flight details, bag description, address and explains next steps and compensation.',
      goal: 'Bavulunu tarif et, süreci ve tazminatı sor.',
      phrases: [['My suitcase didn\'t come out on the carousel.', 'Bavulum banttan çıkmadı.'], ['It\'s a large navy hard-shell case with a red tag.', 'Kırmızı etiketli, büyük lacivert sert bir bavul.'], ['Here\'s my baggage claim tag.', 'Bagaj etiketim burada.'], ['Can it be delivered to my hotel?', 'Otelime teslim edilebilir mi?'], ['Am I entitled to any compensation?', 'Herhangi bir tazminat hakkım var mı?'], ['I need to buy some essentials in the meantime.', 'Bu arada bazı temel ihtiyaçları almam gerekiyor.']] },
    { id: 'restaurant', title: 'Wrong order at a restaurant', where: 'Busy restaurant', level: 'B2', tag: 'Food',
      role: 'a waiter who is polite but a bit defensive', learner: 'a customer who got the wrong dish and waited 40 minutes',
      setup: 'The food arrives late and it\'s the wrong dish. The learner complains politely and decides what they want.',
      goal: 'Kibarca şikâyet et, çözüm iste, bahşiş ve hesap konusunu konuş.',
      phrases: [['Sorry, I don\'t think this is what I ordered.', 'Pardon, bunun sipariş ettiğim şey olduğunu sanmıyorum.'], ['We\'ve been waiting for quite a while.', 'Epey bir süredir bekliyoruz.'], ['Could you take it back, please?', 'Geri götürebilir misiniz lütfen?'], ['Would it be possible to speak to the manager?', 'Müdürle görüşmek mümkün mü?'], ['Could we get the bill, please?', 'Hesabı alabilir miyiz?'], ['Is service included?', 'Servis ücreti dahil mi?']] },
    { id: 'bank', title: 'Blocked card at the bank', where: 'Bank branch', level: 'B2+', tag: 'Money',
      role: 'a bank advisor who must run security checks', learner: 'a customer whose card was blocked after a suspicious payment abroad',
      setup: 'The card was declined and then blocked. The advisor runs identity checks, asks about a transaction and explains how to get a new card.',
      goal: 'Sorunu açıkla, güvenlik sorularını cevapla, yeni kart sürecini anla.',
      phrases: [['My card was declined, and now it\'s been blocked.', 'Kartım reddedildi, şimdi de bloke edildi.'], ['I don\'t recognise this transaction.', 'Bu işlemi tanımıyorum.'], ['Could you freeze the account just in case?', 'Her ihtimale karşı hesabı dondurabilir misiniz?'], ['How long will the replacement card take?', 'Yeni kart ne kadar sürer?'], ['Will I get the money back?', 'Paramı geri alabilecek miyim?'], ['I\'d like to dispute this charge.', 'Bu ödemeye itiraz etmek istiyorum.']] },
    { id: 'barber', title: 'At the barber', where: 'Hairdresser', level: 'B2+', tag: 'Daily',
      role: 'a chatty hairdresser who asks precise questions about the cut', learner: 'a customer who wants a specific haircut',
      setup: 'The hairdresser asks how short, which style, the fringe, layers, then makes small talk.',
      goal: 'Ne istediğini net tarif et (bu kelimeleri çoğu kişi bilmez), sonra sohbete devam et.',
      phrases: [['Just a trim, please.', 'Sadece uçlarını alın lütfen.'], ['Could you take a little off the sides?', 'Yanlardan biraz alabilir misiniz?'], ['Not too short on top.', 'Üstten çok kısa olmasın.'], ['I\'d like to keep the length.', 'Boyunu korumak istiyorum.'], ['Could you thin it out a bit?', 'Biraz seyreltebilir misiniz?'], ['That\'s perfect, thanks.', 'Harika olmuş, teşekkürler.']] },
    { id: 'returns', title: 'Returning a faulty product', where: 'Electronics shop', level: 'B2', tag: 'Shopping',
      role: 'a shop assistant who first offers a repair instead of a refund', learner: 'a customer returning headphones that stopped working after a week',
      setup: 'The learner wants a refund. The assistant asks for a receipt and suggests repair or store credit.',
      goal: 'Para iadesi iste, alternatifleri değerlendir, haklarını savun.',
      phrases: [['These stopped working after a week.', 'Bunlar bir hafta sonra çalışmayı bıraktı.'], ['I\'d like a refund, please.', 'Para iadesi istiyorum.'], ['I\'ve still got the receipt.', 'Fiş hâlâ bende.'], ['I\'d rather not have store credit.', 'Mağaza kredisi istemem.'], ['Surely it should last longer than that.', 'Bundan daha uzun dayanması gerekirdi herhalde.'], ['Could I exchange it for a different model?', 'Başka bir modelle değiştirebilir miyim?']] },
    { id: 'party', title: 'Small talk at a party', where: 'Neighbour\'s house party', level: 'B2+', tag: 'Social',
      role: 'a friendly British neighbour who loves talking about travel, weather and football', learner: 'a guest who only knows the host',
      setup: 'A house party. Start with small talk, then move to deeper topics; the neighbour asks follow-up questions and tells jokes.',
      goal: 'Sohbeti başlat, sürdür, soru sor, kibarca bitir.',
      phrases: [['So how do you know Tom?', 'Tom\'u nereden tanıyorsun?'], ['I don\'t think we\'ve met. I\'m Deniz.', 'Sanırım tanışmadık. Ben Deniz.'], ['What do you do when you\'re not working?', 'Çalışmadığın zamanlarda ne yaparsın?'], ['Oh, tell me about it!', 'Bana mı anlatıyorsun! (Aynen öyle)'], ['That sounds amazing. How did you get into that?', 'Harika. Bu işe nasıl girdin?'], ['I\'m going to grab another drink. Lovely chatting!', 'Bir içki daha alayım. Sohbet çok güzeldi!']] },
    { id: 'meeting', title: 'Disagreeing in a tech meeting', where: 'Sprint planning call', level: 'C1', tag: 'Work',
      role: 'a confident product manager who wants to ship a big feature in one sprint', learner: 'a software engineer who thinks the deadline is unrealistic',
      setup: 'Sprint planning. The PM insists on a deadline; the engineer must disagree diplomatically, explain risks and propose a compromise.',
      goal: 'Diplomatik karşı çık, riskleri teknik olmayan dille anlat, uzlaşma öner.',
      phrases: [['I see where you\'re coming from, but...', 'Ne demek istediğini anlıyorum ama...'], ['I\'m a bit concerned about the timeline.', 'Zaman çizelgesi konusunda biraz endişeliyim.'], ['If we rush this, we\'ll end up paying for it later.', 'Bunu aceleye getirirsek sonra bedelini öderiz.'], ['What if we split it into two phases?', 'Peki bunu iki aşamaya bölsek?'], ['Could we agree on a smaller scope for this sprint?', 'Bu sprint için daha küçük bir kapsamda anlaşabilir miyiz?'], ['Let\'s take this offline and come back with numbers.', 'Bunu ayrıca konuşup rakamlarla dönelim.']] },
    { id: 'raise', title: 'Negotiating a raise', where: 'One-to-one with your manager', level: 'C1', tag: 'Work',
      role: 'a manager who values the employee but has a tight budget', learner: 'an engineer asking for a 20% raise',
      setup: 'A 1:1. The learner asks for a raise, gives evidence, handles pushback and negotiates alternatives (title, bonus, remote days).',
      goal: 'Değerini kanıtla, itirazları karşıla, alternatif pazarlık yap.',
      phrases: [['I\'d like to talk about my compensation.', 'Maaşım hakkında konuşmak istiyorum.'], ['Over the past year, I\'ve taken on a lot more responsibility.', 'Geçen yıl çok daha fazla sorumluluk üstlendim.'], ['Based on market rates, I think 20% is fair.', 'Piyasa ücretlerine göre %20\'nin adil olduğunu düşünüyorum.'], ['I understand budgets are tight.', 'Bütçelerin kısıtlı olduğunu anlıyorum.'], ['Would you be open to revisiting this in three months?', 'Bunu üç ay sonra tekrar ele almaya açık mısınız?'], ['Can we put that in writing?', 'Bunu yazıya dökebilir miyiz?']] },
    { id: 'interview', title: 'Behavioural job interview', where: 'Video interview, London startup', level: 'C1', tag: 'Work',
      role: 'an engineering manager running a behavioural interview (STAR questions)', learner: 'a senior software engineer candidate',
      setup: 'Questions like "tell me about a time you failed", "a conflict with a colleague". The interviewer probes with follow-ups.',
      goal: 'STAR yapısıyla (Situation, Task, Action, Result) akıcı cevaplar ver.',
      phrases: [['That\'s a great question. Let me think for a second.', 'Güzel soru. Bir saniye düşüneyim.'], ['The situation was this...', 'Durum şuydu...'], ['My role was to...', 'Benim görevim ... idi.'], ['What I did was...', 'Yaptığım şey şuydu...'], ['As a result, we cut the load time by half.', 'Sonuç olarak yüklenme süresini yarıya indirdik.'], ['Looking back, I would have...', 'Geriye bakınca, ... yapardım.']] },
    { id: 'witness', title: 'Witness statement', where: 'Street, after a minor accident', level: 'C1', tag: 'Emergency',
      role: 'a police officer taking a witness statement', learner: 'a witness who saw a cyclist and a car collide',
      setup: 'The officer asks what happened, in order, exact details (colours, speed, lights), and contact details.',
      goal: 'Olayı sırasıyla, detaylı ve net anlat.',
      phrases: [['I was waiting at the crossing when it happened.', 'Olay olduğunda yaya geçidinde bekliyordum.'], ['The car pulled out without indicating.', 'Araba sinyal vermeden çıktı.'], ['The cyclist swerved but couldn\'t avoid it.', 'Bisikletli direksiyonu kırdı ama kaçamadı.'], ['It all happened so fast.', 'Her şey çok hızlı oldu.'], ['I\'m fairly sure the light was red.', 'Işığın kırmızı olduğundan oldukça eminim.'], ['I didn\'t catch the number plate.', 'Plakayı göremedim.']] }
  ];

  /* Mission briefs: who is in front of you, how the scene unfolds, what you must do.
     ava = illustrated portrait settings. */
  const briefs = {
    gp: { name: 'Dr. Amira Patel', job: 'GP, family doctor',
      who: 'Nazik ama aceleci bir aile hekimi. Randevu 10 dakika, bu yüzden kısa ve net sorular soruyor, bazen tıbbi terim kullanıyor.',
      beats: ['Seni karşılar ve neden geldiğini sorar', 'Belirtileri, ne zamandır sürdüğünü ve ne kadar şiddetli olduğunu sorgular', 'Kullandığın ilaçları ve alerjilerini sorar', 'Teşhis koyar, ilaç ya da tavsiye verir ve ne zaman geri gelmen gerektiğini söyler'],
      you: ['Belirtileri sırayla ve zaman ifadeleriyle anlat (for a week, since Monday)', 'Anlamadığın bir terimi açıklamasını iste', 'İlacı nasıl kullanacağını ve yan etkilerini sor'],
      watch: '"I have fever" değil "I\'ve got a temperature" ya da "I\'m running a fever" de. "Ağrı" için ache, pain ve sore farklı yerlerde kullanılır.',
      ava: { skin: '#B57B52', hair: 'bun', hairColor: '#1D1410', shirt: '#E9EEF3', acc: 'stethoscope', bg: '#CFEDE8' } },
    landlord: { name: 'Mr. Graham Hollis', job: 'Your landlord, on the phone',
      who: 'Kibar görünen ama işi yokuşa süren bir ev sahibi. "Next week" demeyi seviyor, masraftan kaçıyor.',
      beats: ['Telefonu açar, biraz aceleyle ne olduğunu sorar', 'Sorunu küçümser ("probably just condensation")', 'Tesisatçıyı gelecek haftaya atmaya çalışır', 'Baskı yaparsan bir tarih verir ama kim ödeyecek konusunu açar'],
      you: ['Hasarı somut anlat: nerede, ne kadar, ne zamandan beri', 'Kibar ama kararlı kal, net bir gün ve saat al', 'Konuşmanın sonunda yazılı onay iste'],
      watch: '"You must come today" kaba duyulur. "I\'m afraid it really can\'t wait" ya da "I\'d really need someone today" de.',
      ava: { skin: '#F2C9A5', hair: 'bald', hairColor: '#6B5A4A', shirt: '#6B7B5E', acc: 'phone', bg: '#E8E2D4' } },
    garage: { name: 'Dave', job: 'Mechanic',
      who: 'Samimi, hızlı konuşan ve teknik terim seven bir tamirci. Fırsat buldukça ek iş satmaya çalışıyor.',
      beats: ['Arabanın neyi olduğunu sorar', 'Kontrol eder, teknik terimlerle teşhis koyar (brake pads, discs)', 'Fiyat verir, ardından "while we\'re at it" diye ek işler önerir', 'Arabanın ne zaman hazır olacağını söyler'],
      you: ['Sesi ve belirtiyi tarif et (grinding, squeaking, rattling)', 'Anlamadığın terimi basitçe açıklatmayı iste', 'Ek işi kibarca reddet ve toplam fiyatı netleştir'],
      watch: '"How much it costs?" değil "How much will it cost?" de. Fiyatı onaylamadan önce "Is that including VAT?" diye sor.',
      ava: { skin: '#D9A47C', hair: 'short', hairColor: '#3A2A1C', shirt: '#2F4A6D', acc: 'wrench', bg: '#DCE4EE' } },
    luggage: { name: 'Priya', job: 'Baggage services desk',
      who: 'Uzun bir vardiyanın sonunda, prosedürü harfiyen uygulayan yorgun bir görevli. Kibar ama form doldurmaktan başka bir şey yapamıyor.',
      beats: ['Uçuş numarasını ve bagaj etiketini ister', 'Bavulun rengini, boyutunu ve ayırt edici özelliklerini sorar', 'Teslimat adresini ve iletişim bilgilerini alır', 'Takip numarası verir ve tazminat kurallarını anlatır'],
      you: ['Bavulu detaylı tarif et (hard-shell, navy, a red ribbon on the handle)', 'Bavul gelene kadar neler yapabileceğini sor', 'Tazminat ve masraf fişlerini nasıl göndereceğini öğren'],
      watch: '"I lost my luggage" senin suçunmuş gibi duyulur. "My bag didn\'t arrive" ya da "My luggage has gone missing" de. Luggage sayılamaz.',
      ava: { skin: '#8A5634', hair: 'long', hairColor: '#1A1A1A', shirt: '#7A1F3D', acc: 'lanyard', bg: '#F1DCE3' } },
    restaurant: { name: 'Marco', job: 'Waiter',
      who: 'Kalabalık bir akşamda koşturan, kibar ama biraz savunmacı bir garson. Hatayı önce mutfağa atıyor.',
      beats: ['Yemeği getirir, her şeyin yolunda olup olmadığını sorar', 'Şikâyetine savunmayla karşılık verir ("that\'s what you ordered")', 'Yeni tabak için bekleme süresi verir ya da başka bir şey önerir', 'Hesap gelince indirim ya da ikram konusu açılır'],
      you: ['Sorunu suçlamadan anlat', 'Ne istediğine karar ver: değişim, iptal ya da indirim', 'Hesabı iste ve servis ücretini sor'],
      watch: '"I want another food" değil "Could I get the ... instead?" de. Şikâyette "I\'m afraid" ve "I think there\'s been a mix-up" kalıpları işini yumuşatır.',
      ava: { skin: '#F2C9A5', hair: 'short', hairColor: '#2A1C14', shirt: '#1C1C1C', acc: 'apron', bg: '#F6E3D6' } },
    bank: { name: 'Sophie', job: 'Bank advisor',
      who: 'Güvenlik kontrollerini atlamayan, profesyonel bir banka çalışanı. Çok soru soruyor, sen sabırlı olmalısın.',
      beats: ['Kimliğini doğrulamak için birkaç soru sorar', 'Şüpheli işlemi ve son harcamalarını sorar', 'Kartı iptal etme ve yeni kart sürecini anlatır', 'Paranın iadesi ve itiraz süreci hakkında bilgi verir'],
      you: ['İşlemi tanımadığını net söyle ve itiraz et', 'Yeni kartın ne zaman geleceğini ve bu sürede nasıl ödeme yapacağını sor', 'İade süresini ve bir referans numarasını iste'],
      watch: '"My card is blocked" değil "My card\'s been blocked" de. "Dispute a charge", "freeze the account" ve "statement" kelimelerini kullan.',
      ava: { skin: '#F5D7BE', hair: 'long', hairColor: '#8B5A2B', shirt: '#2E3A59', acc: 'lanyard', bg: '#DDE3F0' } },
    barber: { name: 'Jess', job: 'Hairdresser',
      who: 'Çok konuşan, neşeli bir kuaför. Çok spesifik sorular soruyor ve sessizlikten hoşlanmıyor.',
      beats: ['Ne yaptırmak istediğini sorar', 'Uzunluk, yanlar, üst kısım, perçem gibi detayları netleştirir', 'Kesmeye başlarken sohbet açar (hafta sonu, tatil, iş)', 'Sonunda aynayı gösterir ve beğenip beğenmediğini sorar'],
      you: ['Ne istediğini net tarif et (a trim, take a bit off the sides, keep the length)', 'Sohbeti en az 3 tur sürdür ve sen de soru sor', 'Sonucu kibarca yorumla ya da ufak bir düzeltme iste'],
      watch: 'Bu kelimeleri çoğu kişi bilmez: fringe (perçem), layers (kat), trim (uç alma), thin out (seyreltmek), short back and sides.',
      ava: { skin: '#D9A47C', hair: 'curly', hairColor: '#B4421B', shirt: '#151515', acc: 'scissors', bg: '#F7DED2' } },
    returns: { name: 'Tom', job: 'Shop assistant',
      who: 'Mağaza politikasını ezberlemiş, para iadesi yerine tamir ya da mağaza kredisi önermeye programlı bir çalışan.',
      beats: ['Sorunu ve fişi sorar', 'Önce tamir önerir', 'Israr edersen mağaza kredisi teklif eder', 'Sonunda müdürü çağırmayı ya da değişimi kabul eder'],
      you: ['Ürünün ne zaman ve nasıl bozulduğunu anlat', 'Para iadesi istediğini kibarca ama net söyle', 'Tüketici hakkını hatırlat ("it\'s not fit for purpose")'],
      watch: '"I want my money back" fazla sert. "I\'d like a refund, please" ve "I\'d rather not" kalıpları daha etkili.',
      ava: { skin: '#F2C9A5', hair: 'short', hairColor: '#C9A227', shirt: '#1E5AA8', acc: 'lanyard', bg: '#DCE7F5' } },
    party: { name: 'Olivia', job: 'Your neighbour',
      who: 'Seyahati, havayı ve futbolu seven, esprili bir İngiliz komşu. Sorulara uzun cevap veriyor ve takip sorusu bekliyor.',
      beats: ['Kendini tanıtır ve ev sahibini nereden tanıdığını sorar', 'Hava, iş, mahalle gibi small talk konuları açar', 'Bir anısını anlatır ve senin de bir şey paylaşmanı bekler', 'Biri onu çağırınca sohbet doğal olarak kapanır'],
      you: ['Sohbeti sen başlat ya da kendini tanıt', 'En az 3 takip sorusu sor (How did you get into that?)', 'Sohbeti kibarca bitir ve iletişim bilgisi iste'],
      watch: 'Tek kelimelik cevaplar (Yes, Fine) sohbeti öldürür. Her cevaba bir detay ya da soru ekle. İngilizlerde ironi ve hafif şikâyet normal.',
      ava: { skin: '#F5D7BE', hair: 'long', hairColor: '#B8860B', shirt: '#E0501A', acc: 'glass', bg: '#FBE5DA' } },
    meeting: { name: 'Rachel', job: 'Product manager',
      who: 'Kendinden emin, hedef odaklı bir product manager. Büyük özelliği bir sprintte bitirmek istiyor ve itirazlara sabırsız.',
      beats: ['Planı ve deadline\'ı heyecanla sunar', 'Senin itirazına "can\'t we just..." diye karşılık verir', 'Riskleri teknik olmayan dille açıklamanı ister', 'Bir uzlaşma ya da sonraki adım üzerinde anlaşırsınız'],
      you: ['Önce onun hedefini kabul et, sonra endişeni söyle', 'Riski somut bir örnekle anlat (bug, downtime, technical debt)', 'Alternatif öner: daha küçük kapsam ya da iki aşama'],
      watch: '"You are wrong" yerine "I see where you\'re coming from, but..." de. "Impossible" demek yerine "risky in this timeframe" de.',
      ava: { skin: '#B57B52', hair: 'curly', hairColor: '#1A1A1A', shirt: '#0E7468', acc: 'headset', bg: '#D3EEEA' } },
    raise: { name: 'Simon', job: 'Your engineering manager',
      who: 'Seni takdir eden ama bütçesi kısıtlı bir yönetici. Doğrudan "hayır" demiyor, zaman kazanmaya çalışıyor.',
      beats: ['1:1\'i açar ve gündemini sorar', 'Talebini dinler ve bütçe kısıtını öne sürer', 'Somut kanıt ister: ne başardın, piyasa ne diyor', 'Alternatifler konuşulur: unvan, bonus, eğitim bütçesi ya da tarih'],
      you: ['Talebini somut bir rakamla ve kanıtla söyle', 'Bütçe itirazını kabul et ama geri adım atma', 'Bir tarih ya da yazılı taahhüt alarak bitir'],
      watch: '"I deserve" yerine "Based on my impact..." de. Rakam verirken "around" kullanma, net ol: "I\'m looking for 20%."',
      ava: { skin: '#F2C9A5', hair: 'short', hairColor: '#8A8A8A', shirt: '#E5E7EB', acc: 'tie', bg: '#E4E7EC' } },
    interview: { name: 'Hannah', job: 'Engineering manager, interviewer',
      who: 'Davranışsal mülakat yapan deneyimli bir yönetici. Genel cevapları sevmiyor, "what exactly did YOU do?" diye derine iniyor.',
      beats: ['Kısa bir tanışma ve kendini anlatmanı ister', 'Bir başarısızlık ya da çatışma hikâyesi sorar', 'Takip sorularıyla detaya iner', 'Senin ona sormak istediğin bir şey olup olmadığını sorar'],
      you: ['Her cevabı STAR yapısıyla ver', '"We" değil "I" ile kendi katkını vurgula', 'Sonunda en az bir akıllıca soru sor'],
      watch: 'Cevaba "Actually..." diye başlama, bu kelime "aslında yanılıyorsun" gibi duyulabilir. "That\'s a great question" ile zaman kazan.',
      ava: { skin: '#8A5634', hair: 'bun', hairColor: '#111111', shirt: '#3B4A6B', acc: 'headset', bg: '#E1E5F0' } },
    witness: { name: 'PC Daniel Brooks', job: 'Police officer',
      who: 'Sakin ve titiz bir polis memuru. Her şeyi sırasıyla ve net detaylarla kaydetmek istiyor.',
      beats: ['Olay sırasında nerede olduğunu sorar', 'Ne olduğunu baştan sona anlatmanı ister', 'Detayları sorgular: renk, hız, ışıklar, plaka', 'İletişim bilgilerini alır ve sonraki adımı anlatır'],
      you: ['Olayı kronolojik sırayla anlat (first, then, just as, after that)', 'Emin olmadığın yerde bunu belirt (I\'m fairly sure, I didn\'t catch)', 'Past continuous ve past simple\'ı doğru kullan'],
      watch: '"The car hit to the bike" değil "The car hit the bike" de. Tahmin ettiğin şeyi kesin bilgi gibi söyleme.',
      ava: { skin: '#D9A47C', hair: 'cap', hairColor: '#2A1C14', shirt: '#1F2A44', acc: 'vest', bg: '#DDE2EA' } }
  };
  scenarios.forEach((s) => Object.assign(s, briefs[s.id] || {}));

  const freeBrief = {
    name: 'Sam', job: 'An old colleague, over coffee',
    who: 'Eski bir iş arkadaşın. Meraklı ve esprili, bazen de sırf tartışma çıksın diye sana karşı çıkıyor.',
    beats: ['Konuyu açar ve ilk fikrini sorar', 'Fikrine karşı bir argüman getirir', 'Kendi hayatından bir örnek ister', 'Sohbeti bir soruyla bağlar'],
    you: ['Fikrini en az iki gerekçeyle savun', 'En az bir kez kibarca karşı çık', 'Sam\'e de en az iki soru sor'],
    watch: 'Kısa cevaplarla geçiştirme. Her cevaba bir örnek ya da kişisel bir detay ekle.',
    ava: { skin: '#F2C9A5', hair: 'curly', hairColor: '#4A3426', shirt: '#0E7468', acc: 'mug', bg: '#D3EEEA' }
  };

  /* Phrasebook: ready-made lines for situations you rarely meet, ordered the way the
     conversation actually unfolds. p = [english, turkish, note?]. compare = [textbook, natural, why]. */
  const phrasebook = [
    { id: 'doctor', title: 'At the doctor', tr: 'Doktorda ve eczanede', scene: 'gp',
      intro: 'Doktorlar hep aynı sırayla sorar: neden geldin, nerede ağrıyor, nasıl bir ağrı, ne zamandır, başka belirti var mı. Cümleleri bu sırayla öğren.',
      groups: [
        { t: 'Opening', tr: 'Söze girmek', p: [
          ['Hi, I\'ve come in about a pain in my lower back.', 'Merhaba, belimdeki bir ağrı için geldim.'],
          ['I haven\'t been feeling great for the past few days.', 'Birkaç gündür pek iyi hissetmiyorum.'],
          ['I\'d like to get this checked out.', 'Buna bir baktırmak istiyorum.'],
          ['It\'s probably nothing, but I wanted to make sure.', 'Muhtemelen bir şey değildir ama emin olmak istedim.'],
          ['I think I\'ve pulled a muscle.', 'Sanırım bir kasımı çektim.'],
          ['I\'ve got an appointment at ten, under the name Yilmaz.', 'Saat onda Yılmaz adına randevum var.', 'Resepsiyonda']] },
        { t: 'Where it hurts', tr: 'Neren ağrıyor', p: [
          ['It hurts here.', 'Burası ağrıyor.', 'Gösterirken en doğal kalıp'],
          ['I\'ve got a pain in my chest.', 'Göğsümde bir ağrı var.'],
          ['My stomach\'s been hurting since last night.', 'Dün geceden beri midem ağrıyor.'],
          ['I\'ve got a really sore throat.', 'Boğazım çok ağrıyor.'],
          ['My knee hurts when I bend it.', 'Dizimi bükünce ağrıyor.'],
          ['It\'s right here, just below my ribs.', 'Tam burada, kaburgalarımın hemen altında.'],
          ['The pain spreads down my left arm.', 'Ağrı sol koluma doğru yayılıyor.'],
          ['My head is pounding.', 'Başım zonkluyor.']] },
        { t: 'What the pain is like', tr: 'Nasıl bir ağrı', p: [
          ['It\'s a sharp pain, like something\'s stabbing me.', 'Keskin bir ağrı, bıçak saplanıyormuş gibi.'],
          ['It\'s more of a dull ache.', 'Daha çok künt, sürekli bir ağrı.'],
          ['It\'s a throbbing pain that comes and goes.', 'Gelip giden, zonklayan bir ağrı.'],
          ['I\'ve got a burning feeling in my chest.', 'Göğsümde yanma hissi var.'],
          ['I\'ve got a twinge in my lower back.', 'Belimde bir sızı var.', 'Twinge = ani, kısa sızı'],
          ['There\'s a tingling in my fingers.', 'Parmaklarımda karıncalanma var.'],
          ['It\'s a bit tender when I press on it.', 'Bastırınca biraz hassas.'],
          ['My neck feels really stiff.', 'Boynum tutulmuş gibi.'],
          ['On a scale of one to ten, it\'s about a seven.', 'Birden ona kadar, yaklaşık yedi.', 'Doktorlar sık sorar']] },
        { t: 'When & how long', tr: 'Ne zamandır', p: [
          ['It started about three days ago.', 'Yaklaşık üç gün önce başladı.'],
          ['It\'s been going on for a couple of weeks.', 'Birkaç haftadır devam ediyor.'],
          ['It\'s worse in the mornings.', 'Sabahları daha kötü.'],
          ['It gets worse when I lie down.', 'Uzanınca kötüleşiyor.'],
          ['It came on suddenly while I was running.', 'Koşarken aniden başladı.'],
          ['It wakes me up at night.', 'Geceleri beni uyandırıyor.']] },
        { t: 'Other symptoms', tr: 'Diğer belirtiler', p: [
          ['I feel a bit dizzy.', 'Başım biraz dönüyor.'],
          ['I\'ve been feeling sick since this morning.', 'Sabahtan beri midem bulanıyor.', 'UK: feel sick = midesi bulanmak'],
          ['I\'ve been running a temperature.', 'Ateşim var.'],
          ['I\'ve got a blocked nose and a cough.', 'Burnum tıkalı ve öksürüğüm var.'],
          ['I\'ve been throwing up.', 'Kusuyorum.'],
          ['I\'ve had an upset stomach.', 'Midem bozuk.'],
          ['I\'ve lost my appetite.', 'İştahım kesildi.'],
          ['My ankle has swollen up.', 'Ayak bileğim şişti.'],
          ['I\'ve come out in a rash.', 'Vücudumda kızarıklık çıktı.']] },
        { t: 'Answering questions', tr: 'Soruları cevaplamak', p: [
          ['I\'m not on any medication at the moment.', 'Şu an hiç ilaç kullanmıyorum.'],
          ['I\'m allergic to penicillin.', 'Penisiline alerjim var.'],
          ['I\'ve taken some paracetamol, but it didn\'t really help.', 'Biraz parasetamol aldım ama pek işe yaramadı.'],
          ['I\'ve never had this before.', 'Bu daha önce hiç olmadı.'],
          ['I had something similar last year.', 'Geçen yıl benzer bir şey olmuştu.'],
          ['I don\'t smoke, and I only drink occasionally.', 'Sigara içmem, sadece ara sıra içki içerim.']] },
        { t: 'Understanding the treatment', tr: 'Tedaviyi anlamak', p: [
          ['Sorry, could you explain that in simpler terms?', 'Pardon, bunu daha basit anlatabilir misiniz?'],
          ['Is it anything serious?', 'Ciddi bir şey mi?'],
          ['How often should I take them?', 'Ne sıklıkla almalıyım?'],
          ['Should I take them with food?', 'Tok karnına mı almalıyım?'],
          ['Are there any side effects I should know about?', 'Bilmem gereken yan etkiler var mı?'],
          ['When should I come back if it doesn\'t get better?', 'İyileşmezse ne zaman tekrar gelmeliyim?'],
          ['Could I get a sick note for work?', 'İş için rapor alabilir miyim?', 'UK: sick note / fit note']] },
        { t: 'At the pharmacy', tr: 'Eczanede', p: [
          ['Could you recommend something for a sore throat?', 'Boğaz ağrısı için bir şey önerebilir misiniz?'],
          ['I\'ve got a prescription to pick up.', 'Alacağım bir reçetem var.'],
          ['Is it OK to take this with ibuprofen?', 'Bunu ibuprofenle birlikte almak sorun olur mu?'],
          ['Does it make you drowsy?', 'Uyku yapar mı?'],
          ['Do you have anything non-drowsy?', 'Uyku yapmayan bir şey var mı?']] }
      ],
      compare: [
        ['I have pain in here.', 'It hurts here.', 'Türkçedeki "burada ağrı var" yapısı yerine "it hurts" çok daha doğal.'],
        ['I have fever.', 'I\'ve got a temperature.', '"Fever" kullanacaksan: "I\'m running a fever." Tek başına "have fever" hatalı.'],
        ['My stomach is sick.', 'I feel sick. / I\'ve got an upset stomach.', 'Bulantı için "feel sick", mide bozukluğu için "upset stomach".'],
        ['My head is aching very much.', 'I\'ve got a splitting headache.', 'Şiddetli baş ağrısının kalıbı "splitting headache".'],
        ['I am cold. (üşüttüm)', 'I\'ve caught a cold.', '"I\'m cold" üşüyorum demek. Hastalık için "caught a cold".']
      ],
      banks: [
        { t: 'Body', items: [['temple', 'şakak'], ['jaw', 'çene'], ['throat', 'boğaz'], ['chest', 'göğüs'], ['ribs', 'kaburgalar'], ['tummy', 'karın (günlük dil)'], ['lower back', 'bel'], ['hip', 'kalça'], ['wrist', 'el bileği'], ['ankle', 'ayak bileği'], ['joint', 'eklem'], ['shoulder blade', 'kürek kemiği']] },
        { t: 'How it feels', items: [['sharp', 'keskin, batıcı'], ['dull', 'künt'], ['throbbing', 'zonklayan'], ['stabbing', 'bıçak saplanır gibi'], ['burning', 'yanan'], ['tingling', 'karıncalanan'], ['sore', 'ağrılı, hassas'], ['stiff', 'tutulmuş'], ['numb', 'uyuşmuş'], ['itchy', 'kaşıntılı'], ['swollen', 'şişmiş'], ['bruised', 'morarmış']] }
      ] },

    { id: 'food', title: 'Ordering food & drinks', tr: 'Restoranda ve kafede', scene: 'restaurant',
      intro: 'Doğal sipariş "I want" ile verilmez. "Could I get", "I\'ll have" ya da "Can I grab" kullanılır. Sıra şöyle ilerler: selam, sipariş, küçük değişiklikler, teşekkür.',
      groups: [
        { t: 'Arriving', tr: 'Masaya oturmak', p: [
          ['Hi, have you got a table for two?', 'Merhaba, iki kişilik masanız var mı?'],
          ['We\'ve got a booking under Yilmaz.', 'Yılmaz adına rezervasyonumuz var.'],
          ['Could we sit outside?', 'Dışarıda oturabilir miyiz?'],
          ['Is there much of a wait?', 'Çok beklemek gerekiyor mu?'],
          ['We\'re just after a quick bite.', 'Sadece hızlıca bir şeyler atıştıracağız.'],
          ['Could we have a couple more minutes?', 'Birkaç dakika daha alabilir miyiz?', 'Garson "Ready to order?" dediğinde']] },
        { t: 'Asking about the menu', tr: 'Menüyü sormak', p: [
          ['What would you recommend?', 'Ne önerirsiniz?'],
          ['What\'s good here?', 'Burada ne güzel?'],
          ['What comes with the burger?', 'Burgerin yanında ne geliyor?'],
          ['Is it very spicy?', 'Çok acı mı?'],
          ['How big are the portions?', 'Porsiyonlar ne kadar büyük?'],
          ['Is the soup of the day vegetarian?', 'Günün çorbası vejetaryen mi?'],
          ['I can\'t decide between the risotto and the fish. Which one would you go for?', 'Risotto ile balık arasında kaldım. Siz hangisini seçerdiniz?']] },
        { t: 'Ordering naturally', tr: 'Doğal sipariş', p: [
          ['Could I get the chicken sandwich, please?', 'Tavuklu sandviçi alabilir miyim?'],
          ['I\'ll have the salmon, please.', 'Ben somon alayım.'],
          ['I think I\'ll go for the pasta.', 'Sanırım makarnayı alacağım.'],
          ['We\'ll share a couple of starters to begin with.', 'Başlangıç olarak birkaç ara sıcak paylaşacağız.'],
          ['Same for me, please.', 'Bana da aynısından.'],
          ['And to drink, just a sparkling water.', 'İçecek olarak sadece maden suyu.'],
          ['That\'s everything for now, thanks.', 'Şimdilik bu kadar, teşekkürler.']] },
        { t: 'Making changes', tr: 'Değişiklik istemek', p: [
          ['Could I have it without onions?', 'Soğansız olabilir mi?'],
          ['Could I get the dressing on the side?', 'Sosu ayrı alabilir miyim?'],
          ['Is it possible to swap the chips for a side salad?', 'Patates kızartmasını salatayla değiştirmek mümkün mü?'],
          ['Medium-rare, please.', 'Orta az pişmiş lütfen.', 'Biftek için'],
          ['Not too much ice, please.', 'Çok buz olmasın lütfen.'],
          ['Can you make it gluten-free?', 'Glutensiz yapabilir misiniz?'],
          ['I\'m allergic to nuts. Is there anything I should avoid?', 'Kuruyemiş alerjim var. Kaçınmam gereken bir şey var mı?']] },
        { t: 'At a coffee shop', tr: 'Kahvecide', p: [
          ['Can I get a medium latte with oat milk, please?', 'Yulaf sütlü orta boy bir latte alabilir miyim?'],
          ['Can I grab a flat white to go?', 'Götürmek üzere bir flat white alabilir miyim?'],
          ['For here, please.', 'Burada içeceğim.', 'Cevap olarak: "Is that for here or to go?"'],
          ['To take away, please.', 'Paket olsun lütfen.', 'UK. ABD\'de "to go"'],
          ['Could I get an extra shot in that?', 'Ona ekstra bir shot ekleyebilir misiniz?'],
          ['Could you warm that up for me?', 'Onu ısıtabilir misiniz?']] },
        { t: 'During the meal', tr: 'Yemek sırasında', p: [
          ['Excuse me, could we get some more water?', 'Pardon, biraz daha su alabilir miyiz?'],
          ['Sorry, I don\'t think this is what I ordered.', 'Pardon, bunun benim siparişim olduğunu sanmıyorum.'],
          ['Could I get another one of these?', 'Bundan bir tane daha alabilir miyim?'],
          ['Everything\'s lovely, thanks.', 'Her şey çok güzel, teşekkürler.', 'Garson "How is everything?" diye sorunca'],
          ['Could I get the rest of this boxed up?', 'Kalanını paket yapabilir misiniz?']] },
        { t: 'Paying', tr: 'Hesap', p: [
          ['Could we get the bill, please?', 'Hesabı alabilir miyiz?', 'ABD: "the check"'],
          ['Could we pay separately?', 'Ayrı ayrı ödeyebilir miyiz?'],
          ['Could you split it down the middle?', 'Yarı yarıya bölebilir misiniz?'],
          ['Is service included?', 'Servis ücreti dahil mi?'],
          ['Can I pay contactless?', 'Temassız ödeyebilir miyim?'],
          ['Keep the change.', 'Üstü kalsın.']] }
      ],
      compare: [
        ['I want a sandwich.', 'Could I get a sandwich, please?', '"I want" çocukça ve kaba duyulur.'],
        ['Give me the bill.', 'Could we get the bill, please?', 'Emir kipi yerine soru kalıbı kullan.'],
        ['Is it delicious?', 'Is it any good? / What would you recommend?', '"Delicious" sorulmaz, yerken söylenir.'],
        ['One water.', 'Could we get some tap water for the table?', 'İngiltere\'de musluk suyu ücretsiz istenebilir.'],
        ['I am ready.', 'I think we\'re ready to order.', 'Sipariş vermeye hazır olduğunu böyle söylersin.'],
        ['Very delicious!', 'This is amazing! / This is really good.', '"Delicious" zaten güçlü bir sıfat, "very" almaz.']
      ],
      banks: [
        { t: 'On the menu', items: [['starter', 'başlangıç'], ['main', 'ana yemek'], ['side', 'yan ürün'], ['dessert', 'tatlı'], ['still water', 'sade su'], ['sparkling water', 'maden suyu'], ['tap water', 'musluk suyu'], ['dressing', 'salata sosu'], ['rare / medium / well-done', 'az / orta / iyi pişmiş'], ['refill', 'yeniden doldurma'], ['service charge', 'servis ücreti'], ['tip', 'bahşiş']] }
      ] },

    { id: 'hotel', title: 'At the hotel', tr: 'Otelde', scene: null,
      ava: { skin: '#B57B52', hair: 'long', hairColor: '#2A1C14', shirt: '#24324F', acc: 'lanyard', bg: '#E1E5F0' },
      intro: 'Otelde her şey nazik bir ricayla başlar: "Is it possible to...", "Would it be possible to...". Sorunlarda önce durumu söyle, sonra çözüm iste.',
      groups: [
        { t: 'Checking in', tr: 'Giriş', p: [
          ['Hi, I\'m checking in. The booking\'s under Yilmaz.', 'Merhaba, giriş yapacağım. Rezervasyon Yılmaz adına.'],
          ['Is it possible to check in early?', 'Erken giriş yapmak mümkün mü?'],
          ['Could I leave my bags here until the room\'s ready?', 'Oda hazır olana kadar çantalarımı burada bırakabilir miyim?'],
          ['What time is breakfast served?', 'Kahvaltı saat kaçta?'],
          ['What\'s the Wi-Fi password?', 'Wi-Fi şifresi nedir?'],
          ['Would it be possible to get a quiet room?', 'Sessiz bir oda almak mümkün mü?']] },
        { t: 'Problems in the room', tr: 'Odadaki sorunlar', p: [
          ['The air conditioning isn\'t working.', 'Klima çalışmıyor.'],
          ['There\'s no hot water in the shower.', 'Duşta sıcak su yok.'],
          ['The room next door is really noisy.', 'Yan oda çok gürültülü.'],
          ['The toilet won\'t flush.', 'Sifon çalışmıyor.'],
          ['My key card has stopped working.', 'Kart anahtarım çalışmıyor.'],
          ['Would it be possible to move to another room?', 'Başka bir odaya geçmek mümkün mü?']] },
        { t: 'Requests', tr: 'Ricalar', p: [
          ['Could I get some extra towels?', 'Ekstra havlu alabilir miyim?'],
          ['Could I have a wake-up call at six?', 'Saat altıda uyandırma servisi alabilir miyim?'],
          ['Is late checkout possible?', 'Geç çıkış mümkün mü?'],
          ['Could you book me a taxi for eight tomorrow morning?', 'Yarın sabah sekiz için taksi ayarlayabilir misiniz?'],
          ['Can you recommend somewhere nearby to eat?', 'Yakınlarda yemek için bir yer önerebilir misiniz?']] },
        { t: 'Checking out', tr: 'Çıkış', p: [
          ['I\'d like to check out, please.', 'Çıkış yapmak istiyorum.'],
          ['I think there\'s a mistake on the bill.', 'Sanırım faturada bir hata var.'],
          ['I didn\'t use anything from the minibar.', 'Minibardan hiçbir şey kullanmadım.'],
          ['Could you keep my luggage until this afternoon?', 'Bavulumu öğleden sonraya kadar tutabilir misiniz?']] }
      ],
      compare: [
        ['The klima is broken.', 'The air con isn\'t working.', 'Klima: air conditioning, günlük dilde "air con" (UK) ya da "AC" (US).'],
        ['I want to change my room.', 'Would it be possible to move to another room?', 'Rica kalıbı sonucu değiştirir.'],
        ['My card is not opening the door.', 'My key card isn\'t working. Could you reset it?', 'Sorun + çözüm önerisi.']
      ],
      banks: [] },

    { id: 'transit', title: 'Getting around', tr: 'Taksi, tren, yol tarifi', scene: null,
      ava: { skin: '#D9A47C', hair: 'short', hairColor: '#1A1A1A', shirt: '#2F5D50', acc: 'none', bg: '#D7EAE4' },
      intro: 'Yol sorarken önce özür dile ("Sorry to bother you"), cevabı aldıktan sonra tarifi kendi cümlelerinle tekrar et. Böyle yaparsan yanlış anlama ihtimali azalır.',
      groups: [
        { t: 'In a taxi', tr: 'Takside', p: [
          ['Could you take me to this address, please?', 'Beni bu adrese götürebilir misiniz?'],
          ['Roughly how long will it take?', 'Aşağı yukarı ne kadar sürer?'],
          ['Could you drop me off just here?', 'Beni tam burada indirebilir misiniz?'],
          ['Could you pull over just after the lights?', 'Işıklardan hemen sonra kenara çekebilir misiniz?'],
          ['Is it OK if I pay by card?', 'Kartla ödesem olur mu?']] },
        { t: 'Trains & buses', tr: 'Tren ve otobüs', p: [
          ['A return to Oxford, please.', 'Oxford\'a gidiş-dönüş lütfen.', 'UK: single = tek yön, return = gidiş-dönüş'],
          ['Which platform does it leave from?', 'Hangi perondan kalkıyor?'],
          ['Does this train stop at Reading?', 'Bu tren Reading\'de duruyor mu?'],
          ['Do I need to change anywhere?', 'Bir yerde aktarma yapmam gerekiyor mu?'],
          ['Is anyone sitting here?', 'Burada oturan var mı?'],
          ['I\'ve missed my connection. What are my options?', 'Aktarmamı kaçırdım. Seçeneklerim neler?']] },
        { t: 'Asking the way', tr: 'Yol sormak', p: [
          ['Sorry to bother you, how do I get to the station?', 'Rahatsız ettiğim için kusura bakmayın, istasyona nasıl gidebilirim?'],
          ['Is it within walking distance?', 'Yürüme mesafesinde mi?'],
          ['Could you show me on the map?', 'Haritada gösterebilir misiniz?'],
          ['So I go straight on and take the second left?', 'Yani düz gidip ikinci soldan mı döneceğim?', 'Tarifi tekrar ederek teyit et'],
          ['I think I\'m a bit lost.', 'Sanırım biraz kayboldum.']] }
      ],
      compare: [
        ['I want to go to airport.', 'Could you take me to the airport, please?', 'Şoföre hedefi rica kalıbıyla söyle, "the" unutma.'],
        ['Where is the station?', 'Sorry, could you tell me how to get to the station?', 'Yabancıya doğrudan soru yerine nazik bir giriş.']
      ],
      banks: [] },

    { id: 'shop', title: 'Shopping & returns', tr: 'Alışveriş ve iade', scene: 'returns',
      intro: 'Mağazada "I\'m just looking" seni rahatlatır. İade isterken önce sorunu söyle, sonra ne istediğini netleştir: değişim mi, para iadesi mi?',
      groups: [
        { t: 'In the shop', tr: 'Mağazada', p: [
          ['I\'m just looking, thanks.', 'Sadece bakıyorum, teşekkürler.'],
          ['Have you got this in a medium?', 'Bunun M bedeni var mı?'],
          ['Does it come in any other colours?', 'Başka renkleri var mı?'],
          ['Could I try this on?', 'Bunu deneyebilir miyim?'],
          ['It\'s a bit tight. Have you got the next size up?', 'Biraz dar. Bir büyük bedeni var mı?'],
          ['I\'ll take it.', 'Bunu alıyorum.']] },
        { t: 'Paying & returns', tr: 'Ödeme ve iade', p: [
          ['Is this in the sale?', 'Bu indirimde mi?'],
          ['Could I get a gift receipt?', 'Hediye fişi alabilir miyim?'],
          ['What\'s your returns policy?', 'İade politikanız nedir?'],
          ['I\'d like to return this. It doesn\'t fit.', 'Bunu iade etmek istiyorum. Olmadı.'],
          ['Could I swap it for a different size?', 'Başka bir bedenle değiştirebilir miyim?'],
          ['Could I get a refund instead?', 'Onun yerine para iadesi alabilir miyim?']] }
      ],
      compare: [
        ['I want to try this.', 'Could I try this on?', 'Kıyafet için "try on".'],
        ['How much is it cost?', 'How much is this? / How much does it cost?', 'İki yapıyı karıştırma.']
      ],
      banks: [] },

    { id: 'phone', title: 'Phone calls & bookings', tr: 'Telefon ve randevu', scene: null,
      ava: { skin: '#F2C9A5', hair: 'bun', hairColor: '#6B3E26', shirt: '#7A1F3D', acc: 'headset', bg: '#F1DCE3' },
      intro: 'Telefonda yüz ifadesi ve el hareketi yok, bu yüzden teyit etmek çok önemli. Konuşmanın sonunda tarihi ve saati mutlaka tekrar et.',
      groups: [
        { t: 'Booking & changing', tr: 'Randevu almak ve değiştirmek', p: [
          ['Hi, I\'m calling to book an appointment.', 'Merhaba, randevu almak için arıyorum.'],
          ['Have you got anything this week?', 'Bu hafta boş bir yeriniz var mı?'],
          ['Would Thursday morning work?', 'Perşembe sabahı olur mu?'],
          ['Could I move my appointment to Friday?', 'Randevumu cumaya alabilir miyim?'],
          ['I need to cancel my appointment for tomorrow.', 'Yarınki randevumu iptal etmem gerekiyor.']] },
        { t: 'Staying on top of the call', tr: 'Konuşmayı yönetmek', p: [
          ['Sorry, you\'re breaking up.', 'Pardon, ses kesik kesik geliyor.'],
          ['Could you speak a bit more slowly, please?', 'Biraz daha yavaş konuşabilir misiniz?'],
          ['Could you spell that for me?', 'Onu benim için harf harf söyleyebilir misiniz?'],
          ['That\'s Y for Yellow, I for India, L for London.', 'Y, Yellow\'daki Y. I, India\'daki I. L, London\'daki L.', 'İsmini kodlarken'],
          ['Just to confirm, that\'s three o\'clock on Tuesday?', 'Teyit edeyim, salı saat üç mü?'],
          ['Could I call you back in five minutes?', 'Beş dakika sonra sizi geri arayabilir miyim?']] }
      ],
      compare: [
        ['I am Deniz.', 'Hi, it\'s Deniz here. / This is Deniz.', 'Telefonda "I am" yerine "it\'s ... here" ya da "this is" denir.'],
        ['Can you repeat?', 'Sorry, could you say that again?', 'Daha yumuşak ve doğal.']
      ],
      banks: [] },

    { id: 'trouble', title: 'Emergencies & problems', tr: 'Acil durum ve sorunlar', scene: 'witness',
      intro: 'Panik anında kısa ve net cümleler kur: ne oldu, nerede, ne istiyorsun. Uzun cümle kurmaya çalışma.',
      groups: [
        { t: 'Something went wrong', tr: 'Bir şey ters gitti', p: [
          ['I\'ve lost my wallet. Who should I report it to?', 'Cüzdanımı kaybettim. Kime bildirmeliyim?'],
          ['My phone\'s been stolen.', 'Telefonum çalındı.'],
          ['I\'ve locked myself out.', 'Kapıda kaldım, anahtarı içeride unuttum.'],
          ['I\'ve been in a minor accident.', 'Küçük bir kaza geçirdim.'],
          ['My flight\'s been cancelled. What happens now?', 'Uçuşum iptal edildi. Şimdi ne olacak?']] },
        { t: 'Getting help', tr: 'Yardım istemek', p: [
          ['Could you call an ambulance, please?', 'Ambulans çağırabilir misiniz?'],
          ['Where\'s the nearest A&E?', 'En yakın acil servis nerede?', 'UK: A&E, ABD: ER'],
          ['Is there a pharmacy open at this time?', 'Bu saatte açık eczane var mı?'],
          ['Could you help me? I don\'t know what to do.', 'Bana yardım edebilir misiniz? Ne yapacağımı bilmiyorum.'],
          ['Could I get a copy of the police report for my insurance?', 'Sigortam için polis raporunun bir kopyasını alabilir miyim?']] }
      ],
      compare: [
        ['I lost my wallet, it is stealing.', 'My wallet\'s been stolen.', 'Edilgen yapı: "has been stolen".'],
        ['Emergency service where?', 'Where\'s the nearest A&E?', 'İngiltere\'de acil servise A&E denir.']
      ],
      banks: [] },

    { id: 'social', title: 'Small talk', tr: 'Sohbet başlatmak', scene: 'party',
      intro: 'Small talk sorudan değil, sorunun arkasından gelen detaydan beslenir. Her cevaba bir detay ekle, sonra karşı tarafa bir soru sor.',
      groups: [
        { t: 'Opening', tr: 'Başlatmak', p: [
          ['So how do you know Tom?', 'Tom\'u nereden tanıyorsun?'],
          ['Have you been here before?', 'Daha önce buraya geldin mi?'],
          ['Lovely weather today, isn\'t it?', 'Bugün hava çok güzel, değil mi?'],
          ['Are you from around here?', 'Buralı mısın?'],
          ['I don\'t think we\'ve met. I\'m Deniz.', 'Sanırım tanışmadık. Ben Deniz.']] },
        { t: 'Keeping it going', tr: 'Sürdürmek', p: [
          ['Oh really? How did that happen?', 'Gerçekten mi? Nasıl oldu bu?'],
          ['That sounds amazing.', 'Harika görünüyor.'],
          ['Tell me about it!', 'Bana mı anlatıyorsun! (Aynen öyle)'],
          ['No way!', 'Yok artık!'],
          ['Fair enough.', 'Anlaşılır, haklısın.'],
          ['What do you get up to when you\'re not working?', 'Çalışmadığın zamanlarda neler yaparsın?']] },
        { t: 'Wrapping up', tr: 'Kibarca bitirmek', p: [
          ['Anyway, I\'ll let you get on.', 'Neyse, seni daha fazla tutmayayım.'],
          ['It was lovely chatting to you.', 'Seninle sohbet etmek çok güzeldi.'],
          ['I\'m going to grab another drink. Catch you later!', 'Bir içki daha alayım. Sonra görüşürüz!'],
          ['We should do this again sometime.', 'Bunu bir ara yine yapmalıyız.']] }
      ],
      compare: [
        ['What is your job?', 'What do you do?', 'Meslek sormanın doğal yolu.'],
        ['I am fine, thank you, and you?', 'Not bad, thanks. You?', 'Ders kitabı cevabı fazla resmî duyulur.'],
        ['I am agree.', 'Totally. / I know, right?', 'Sohbette katılmanın doğal yolları.']
      ],
      banks: [] }
  ];

  const freeTalks = [
    'Is remote work better?', 'Compare Istanbul and London', 'Explain your job to a 10-year-old',
    'Pitch a product idea', 'The funniest thing that happened to you', 'The weirdest job you can imagine',
    'Should AI write code?', 'What changed in 12 weeks'
  ];

  /* ---------- Cue cards (IELTS Part 2 style) ---------- */
  const cueCards = [
    { t: 'Describe a time something went wrong', b: ['what you were doing', 'what went wrong', 'how you dealt with it', 'and explain what you learned from it'] },
    { t: 'Describe a skill you learned recently', b: ['what the skill is', 'how you learned it', 'how difficult it was', 'and explain why you wanted to learn it'] },
    { t: 'Describe your hometown', b: ['where it is', 'what it is famous for', 'how it has changed', 'and explain whether you would live there again'] },
    { t: 'Describe a person who influenced you', b: ['who they are', 'how you know them', 'what they did', 'and explain how they changed your thinking'] },
    { t: 'Describe a routine you want to change', b: ['what the routine is', 'when it started', 'why it is a problem', 'and explain how you plan to change it'] },
    { t: 'Describe a decision you disagree with', b: ['what the decision was', 'who made it', 'why you disagree', 'and explain what you would have done instead'] },
    { t: 'Describe an object you couldn\'t live without', b: ['what it is', 'when you got it', 'how often you use it', 'and explain why it matters so much'] },
    { t: 'Describe a celebration you remember', b: ['what was celebrated', 'who was there', 'what happened', 'and explain why it was memorable'] },
    { t: 'Describe a piece of technology that annoys you', b: ['what it is', 'how you use it', 'what is annoying about it', 'and explain how you would redesign it'] },
    { t: 'Describe a place you would like to live', b: ['where it is', 'how you know about it', 'what life is like there', 'and explain why it appeals to you'] },
    { t: 'Describe a film or series that surprised you', b: ['what it was', 'what it is about', 'what surprised you', 'and explain whether you would recommend it'] },
    { t: 'Describe a time you had to persuade someone', b: ['who it was', 'what you wanted', 'how you persuaded them', 'and explain whether it worked'] }
  ];

  /* ---------- Shadowing ---------- */
  const shadowSets = {
    everyday: { name: 'Everyday', lines: [
      'Sorry, could you say that again?', 'Is it alright if I pay by card?', 'Do you mind if I sit here?',
      'I think I\'ve been overcharged.', 'Could I get this to go, please?', 'It\'s been ages! How have you been?',
      'I\'m just looking, thanks.', 'Would you mind keeping an eye on my bag?'] },
    connected: { name: 'Connected speech', lines: [
      'What are you gonna do about it?', 'I should\'ve told you earlier.', 'Do you wanna grab a bite?',
      'Let me get back to you on that.', 'It\'s not that big of a deal.', 'I\'d rather not get into it right now.',
      'Hang on a sec, let me check.', 'We\'ll figure it out as we go.'] },
    work: { name: 'Workplace', lines: [
      'Could you walk me through your thought process?', 'I\'m not sure I follow. Could you rephrase that?',
      'That\'s a fair point, but have we considered the edge cases?', 'I\'ll circle back once I\'ve looked into it.',
      'Can we push the deadline by a couple of days?', 'To be honest, I\'m a bit swamped this week.',
      'Just to make sure we\'re on the same page.', 'Let\'s take this offline.'] },
    story: { name: 'Storytelling', lines: [
      'So, you\'ll never guess what happened yesterday.', 'Long story short, we missed the flight.',
      'At first, I thought it was a joke.', 'Out of nowhere, the power went out.',
      'It turned out he\'d known all along.', 'Anyway, the point is, we made it.',
      'I was absolutely gutted.', 'Looking back, it was kind of hilarious.'] },
    nuance: { name: 'C1 nuance', lines: [
      'I can\'t help thinking we\'re missing something.', 'That\'s easier said than done.',
      'It\'s not so much the money as the principle.', 'I\'d be lying if I said I wasn\'t nervous.',
      'For what it\'s worth, I think you made the right call.', 'Whether we like it or not, things are changing.',
      'The thing is, it\'s not entirely up to me.', 'It goes without saying that we\'ll need more time.'] }
  };

  /* ---------- Minimal pairs, tuned for Turkish speakers ---------- */
  const soundPairs = [
    { id: 'th', name: 'θ vs t', ipa: ['/θ/', '/t/'], tip: 'Dilin ucunu üst dişlerin arasına koy, üfle. Türkçede bu ses yok, "t" ya da "s" demek en sık hata.',
      pairs: [['three', 'tree'], ['thin', 'tin'], ['thank', 'tank'], ['both', 'boat'], ['thought', 'taught'], ['path', 'pat']] },
    { id: 'dh', name: 'ð vs d', ipa: ['/ð/', '/d/'], tip: 'θ ile aynı dil pozisyonu, ama ses tellerin titrer. "the, this, they" kelimelerinde hep bu ses var.',
      pairs: [['then', 'den'], ['they', 'day'], ['though', 'dough'], ['breathe', 'breed'], ['those', 'doze'], ['worthy', 'wordy']] },
    { id: 'wv', name: 'w vs v', ipa: ['/w/', '/v/'], tip: 'w için dudakları yuvarla, dişler dudağa değmez. v için üst dişler alt dudağa değer.',
      pairs: [['wine', 'vine'], ['west', 'vest'], ['wet', 'vet'], ['while', 'vile'], ['worse', 'verse'], ['wail', 'veil']] },
    { id: 'ii', name: 'iː vs ɪ', ipa: ['/iː/', '/ɪ/'], tip: 'Uzun iː gülümser gibi ve gergin. Kısa ɪ gevşek, Türkçe "i" ile "ı" arası bir ses.',
      pairs: [['sheep', 'ship'], ['leave', 'live'], ['feel', 'fill'], ['seat', 'sit'], ['heel', 'hill'], ['eat', 'it']] },
    { id: 'ae', name: 'æ vs e', ipa: ['/æ/', '/e/'], tip: 'æ için ağzını "e" diyecekmiş gibi aç ve çeneyi biraz daha düşür. Türkçe "e"den daha açık.',
      pairs: [['bad', 'bed'], ['man', 'men'], ['sad', 'said'], ['had', 'head'], ['pan', 'pen'], ['bat', 'bet']] },
    { id: 'er', name: 'ɜː vs ɔː', ipa: ['/ɜː/', '/ɔː/'], tip: '"work" ile "walk" aynı değil. ɜː dudak düz, ağız orta açık. ɔː dudak yuvarlak.',
      pairs: [['work', 'walk'], ['bird', 'board'], ['shirt', 'short'], ['firm', 'form'], ['word', 'ward'], ['curl', 'call']] }
  ];

  /* ---------- Traps Turkish speakers fall into ---------- */
  const traps = [
    { a: 'I agree with you.', b: 'I am agree with you.', why: '"Agree" bir fiil, sıfat değil. "Katılıyorum" = I agree. "Am" gerekmez.' },
    { a: 'Let\'s discuss it tomorrow.', b: 'Let\'s discuss about it tomorrow.', why: '"Discuss" doğrudan nesne alır. "Talk about" denir ama "discuss about" denmez.' },
    { a: 'I\'ve been living here since 2015.', b: 'I\'m living here since 2015.', why: 'Geçmişte başlayıp hâlâ süren durum için present perfect (continuous) kullanılır. "-dır/-dir" çevirisi tuzak.' },
    { a: 'What are your current projects?', b: 'What are your actual projects?', why: '"Actual" = gerçek, asıl. Türkçedeki "aktüel/güncel" anlamı "current" ile verilir.' },
    { a: 'He\'s really likeable.', b: 'He\'s really sympathetic.', why: '"Sympathetic" = anlayışlı, halden anlayan. "Sempatik" için likeable, friendly ya da nice kullan.' },
    { a: 'Can you turn on the TV?', b: 'Can you open the TV?', why: 'Elektronik cihazlar "turn on/off" ya da "switch on/off" olur. "Open" kapı, pencere, dosya içindir.' },
    { a: 'My brother is three years older than me.', b: 'My brother is older than me three years.', why: 'Fark miktarı sıfattan önce gelir: three years older, much bigger, a bit faster.' },
    { a: 'I\'m bored.', b: 'I\'m boring.', why: '"-ed" senin hissin (sıkıldım), "-ing" etkiyi yaratan (sıkıcıyım). Interested / interesting de aynı.' },
    { a: 'Can you give me some advice?', b: 'Can you give me some advices?', why: 'Advice, information, feedback, furniture sayılamaz. Tek tek saymak için "a piece of advice" denir.' },
    { a: 'She told me the truth.', b: 'She said me the truth.', why: '"Say" kişiyi doğrudan almaz: say something (to someone). "Tell" kişiyi doğrudan alır: tell me.' },
    { a: 'I\'m waiting for you.', b: 'I\'m waiting you.', why: '"Wait" fiili "for" ile kullanılır. Türkçedeki "seni bekliyorum" doğrudan çevrilmez.' },
    { a: 'It depends on the weather.', b: 'It depends of the weather.', why: '"Depend" her zaman "on" ile kullanılır.' },
    { a: 'Could you explain it to me?', b: 'Could you explain me?', why: '"Explain" kişiyi doğrudan almaz: explain something to someone.' },
    { a: 'I\'ll call you when I arrive.', b: 'I\'ll call you when I will arrive.', why: 'Zaman bağlaçlarından (when, as soon as, before) sonra gelecek anlamında present simple kullanılır.' },
    { a: 'Can I borrow your charger?', b: 'Can I lend your charger?', why: 'Borrow = ödünç almak, lend = ödünç vermek. "Can you lend me your charger?" de doğru.' },
    { a: 'Let\'s join the meeting.', b: 'Let\'s join to the meeting.', why: '"Join" doğrudan nesne alır. Türkçedeki "-e katılmak" yapısı "to" eklemeye iter.' },
    { a: 'Can you check my code?', b: 'Can you control my code?', why: '"Control" = yönetmek, hâkim olmak. "Kontrol etmek" anlamı için check, review ya da go over kullanılır.' },
    { a: 'The food was absolutely delicious.', b: 'The food was very delicious.', why: '"Delicious" zaten güçlü bir sıfat. Güçlü sıfatlarla very yerine absolutely ya da really kullanılır.' },
    { a: 'I\'m going to have a party.', b: 'I\'m going to make a party.', why: 'Parti "have" ya da "throw" ile kullanılır: throw a party. "Make" tuzak.' },
    { a: 'I\'m used to waking up early.', b: 'I\'m used to wake up early.', why: '"Be used to" (alışkın olmak) sonrası -ing gelir. "Used to + fiil" = eskiden yapardım.' },
    { a: 'I made a mistake in the report.', b: 'I did a mistake in the report.', why: 'Make a mistake, make a decision, do homework, do the dishes: kalıp olarak ezberle.' },
    { a: 'We\'re on the bus.', b: 'We\'re in the bus.', why: 'Toplu taşıma araçlarında "on" (on the bus, on the train, on a plane). Araba ve taksi için "in".' },
    { a: 'Eventually, we fixed the bug.', b: 'Eventually, we might fix the bug.', why: '"Eventually" = sonunda, nihayetinde. "Belki/ihtimalen" anlamı yok, "possibly" ile karıştırılır.' },
    { a: 'I\'ll take the exam next week.', b: 'I\'ll give the exam next week.', why: 'Öğrenci sınava girer: take/sit an exam. "Give an exam" sınavı yapan öğretmendir.' }
  ];

  /* ---------- Vault seed deck ---------- */
  const deck = [
    // phrasal verbs
    ['figure out', 'çözmek, anlamak', 'I still can\'t figure out why the build fails.', 'phrasal'],
    ['come up with', 'bulmak, ortaya atmak (fikir)', 'She came up with a much simpler solution.', 'phrasal'],
    ['put off', 'ertelemek', 'Stop putting off the dentist.', 'phrasal'],
    ['run into', 'rastlamak, karşılaşmak', 'I ran into my old manager at the airport.', 'phrasal'],
    ['look into', 'incelemek, araştırmak', 'I\'ll look into it and get back to you.', 'phrasal'],
    ['get by', 'idare etmek', 'My German is enough to get by.', 'phrasal'],
    ['bring up', 'gündeme getirmek', 'Don\'t bring up politics at dinner.', 'phrasal'],
    ['back out', 'caymak, vazgeçmek', 'The client backed out at the last minute.', 'phrasal'],
    ['turn down', 'reddetmek', 'He turned down the offer.', 'phrasal'],
    ['end up', 'sonunda ... olmak', 'We ended up staying until midnight.', 'phrasal'],
    ['pull off', 'başarmak (zor bir şeyi)', 'I didn\'t think we\'d pull it off.', 'phrasal'],
    ['wrap up', 'toparlamak, bitirmek', 'Let\'s wrap up the meeting.', 'phrasal'],
    ['sort out', 'halletmek, çözmek', 'I need to sort out my visa.', 'phrasal'],
    ['catch up', 'hasret gidermek / yetişmek', 'We should catch up over coffee.', 'phrasal'],
    ['fall through', 'suya düşmek', 'Our plans fell through.', 'phrasal'],
    ['drop by', 'uğramak', 'Feel free to drop by anytime.', 'phrasal'],
    ['come across', 'rastlamak / izlenim vermek', 'He comes across as quite shy.', 'phrasal'],
    ['point out', 'belirtmek, dikkat çekmek', 'She pointed out a flaw in my logic.', 'phrasal'],
    ['run out of', 'tükenmek, bitmek', 'We ran out of time.', 'phrasal'],
    ['get across', 'anlatmak, iletmek', 'I struggled to get my point across.', 'phrasal'],
    // collocations
    ['raise a concern', 'endişe dile getirmek', 'I\'d like to raise a concern about security.', 'collocation'],
    ['meet a deadline', 'teslim tarihine yetişmek', 'We barely met the deadline.', 'collocation'],
    ['reach a consensus', 'uzlaşmaya varmak', 'The team couldn\'t reach a consensus.', 'collocation'],
    ['draw a conclusion', 'sonuç çıkarmak', 'It\'s too early to draw any conclusions.', 'collocation'],
    ['pose a risk', 'risk oluşturmak', 'Outdated libraries pose a real risk.', 'collocation'],
    ['bear in mind', 'aklında tutmak', 'Bear in mind that prices go up in summer.', 'collocation'],
    ['strike a balance', 'denge kurmak', 'It\'s hard to strike a balance between work and life.', 'collocation'],
    ['take into account', 'hesaba katmak', 'We didn\'t take traffic into account.', 'collocation'],
    ['a steep learning curve', 'zorlu öğrenme süreci', 'Rust has a steep learning curve.', 'collocation'],
    ['make a tough call', 'zor bir karar vermek', 'The manager had to make a tough call.', 'collocation'],
    // idioms
    ['the elephant in the room', 'kimsenin konuşmak istemediği bariz sorun', 'Nobody mentioned the budget, the elephant in the room.', 'idiom'],
    ['get the hang of it', 'işin püf noktasını kapmak', 'It\'s tricky at first, but you\'ll get the hang of it.', 'idiom'],
    ['on the same page', 'aynı fikirde, aynı noktada', 'Let\'s make sure we\'re all on the same page.', 'idiom'],
    ['a blessing in disguise', 'her işte bir hayır var', 'Losing that job was a blessing in disguise.', 'idiom'],
    ['cut corners', 'işi baştan savma yapmak', 'Don\'t cut corners on testing.', 'idiom'],
    ['play it by ear', 'duruma göre takılmak', 'We haven\'t planned anything; let\'s play it by ear.', 'idiom'],
    ['beat around the bush', 'lafı dolandırmak', 'Stop beating around the bush and tell me.', 'idiom'],
    ['under the weather', 'keyifsiz, hafif hasta', 'I\'m feeling a bit under the weather.', 'idiom'],
    ['call it a day', 'günü bitirmek, paydos etmek', 'It\'s eight o\'clock. Let\'s call it a day.', 'idiom'],
    ['cost an arm and a leg', 'çok pahalı olmak', 'Rent in London costs an arm and a leg.', 'idiom'],
    ['the ball is in your court', 'top sende, karar senin', 'I\'ve made my offer; the ball is in your court.', 'idiom'],
    ['hit the nail on the head', 'tam üstüne basmak', 'You hit the nail on the head.', 'idiom'],
    ['once in a blue moon', 'kırk yılda bir', 'I only eat fast food once in a blue moon.', 'idiom'],
    ['it\'s not rocket science', 'çok da zor değil', 'Come on, it\'s not rocket science.', 'idiom'],
    ['back to square one', 'başa dönmek', 'The test failed, so we\'re back to square one.', 'idiom'],
    // discourse markers
    ['that being said', 'bununla birlikte', 'It\'s expensive. That being said, it\'s worth it.', 'discourse'],
    ['as far as I\'m concerned', 'bana kalırsa', 'As far as I\'m concerned, the project is done.', 'discourse'],
    ['on top of that', 'üstüne üstlük', 'It was late, and on top of that, it was raining.', 'discourse'],
    ['to be fair', 'hakkını vermek gerekirse', 'To be fair, he did warn us.', 'discourse'],
    ['come to think of it', 'şimdi düşününce', 'Come to think of it, I\'ve never seen him angry.', 'discourse'],
    ['the thing is', 'mesele şu ki', 'The thing is, I don\'t have the time.', 'discourse'],
    ['for what it\'s worth', 'ne kadar işe yarar bilmem ama', 'For what it\'s worth, I think you\'re right.', 'discourse'],
    ['all things considered', 'her şey göz önüne alındığında', 'All things considered, it went well.', 'discourse'],
    ['in a nutshell', 'özetle', 'In a nutshell, we need more people.', 'discourse'],
    ['mind you', 'yine de, şunu da belirteyim', 'It\'s a great flat. Mind you, it\'s tiny.', 'discourse'],
    // situations
    ['I\'ve got a prescription to pick up', 'Alacağım bir reçetem var', 'Hi, I\'ve got a prescription to pick up for Yilmaz.', 'situation'],
    ['The tap is leaking', 'Musluk sızdırıyor', 'The kitchen tap is leaking again.', 'situation'],
    ['My card\'s been declined', 'Kartım reddedildi', 'Sorry, my card\'s been declined. Can I try another?', 'situation'],
    ['Is this seat taken?', 'Burası dolu mu?', 'Excuse me, is this seat taken?', 'situation'],
    ['I\'d like to make a complaint', 'Şikâyette bulunmak istiyorum', 'I\'d like to make a complaint about my room.', 'situation'],
    ['Could you split the bill?', 'Hesabı bölebilir misiniz?', 'Could you split the bill three ways?', 'situation'],
    ['I\'m just browsing', 'Sadece bakıyorum', 'No thanks, I\'m just browsing.', 'situation'],
    ['It\'s making a weird noise', 'Garip bir ses çıkarıyor', 'The washing machine is making a weird noise.', 'situation'],
    ['I\'m running late', 'Geç kalıyorum', 'Sorry, I\'m running about ten minutes late.', 'situation'],
    ['Could you pencil me in for Tuesday?', 'Salıya beni not edebilir misiniz?', 'Could you pencil me in for Tuesday afternoon?', 'situation']
  ].map(([en, tr, ex, tag], i) => ({ id: 's' + i, en, tr, ex, tag }));

  /* ---------- Writing prompts ---------- */
  const writePrompts = [
    'Write an email to your landlord about a broken heater that hasn\'t been fixed for a week.',
    'Describe the last series you watched and why someone should (or shouldn\'t) watch it.',
    'Your team wants to rewrite the app from scratch. Write a message explaining your concerns.',
    'Write a short review of a restaurant where the service was terrible but the food was great.',
    'Describe a place from your childhood using all five senses.',
    'Is it better to be a specialist or a generalist? Argue one side.',
    'Write a LinkedIn post about a mistake you learned from.',
    'Tell the story of a day when everything went wrong, but end it with a twist.',
    'Write a formal complaint to an airline about a cancelled flight.',
    'Explain how the internet works to your grandmother.',
    'Should cities ban cars from their centres? Give both sides, then your view.',
    'Write a thank-you note to a teacher who changed your life.',
    'Describe your ideal weekend in a city you have never visited.',
    'Persuade your manager to let the team work four days a week.'
  ];

  /* ---------- Immersion library ---------- */
  const library = {
    shows: [
      { n: 'Friends', lv: 1, why: 'Günlük konuşma, net telaffuz. Başlangıç rampası.' },
      { n: 'Modern Family', lv: 2, why: 'Aile dili, mizah, farklı yaşlardan konuşmacılar.' },
      { n: 'Brooklyn Nine-Nine', lv: 2, why: 'Hızlı espriler, iş yeri ve polis jargonu.' },
      { n: 'The Office (US)', lv: 3, why: 'Garip small talk ve iş yeri ironisi. Tepki ifadeleri için altın.' },
      { n: 'Ted Lasso', lv: 3, why: 'Amerikan + İngiliz aksanı bir arada, sıcak ve deyim dolu.' },
      { n: 'Sex Education', lv: 3, why: 'Genç İngiliz argosu ve doğal diyalog.' },
      { n: 'The Crown', lv: 4, why: 'Formal İngiliz İngilizcesi (RP) ve register farkları.' },
      { n: 'Succession', lv: 4, why: 'Hızlı, iğneleyici, iş ve güç dili. Sarkazm ustalığı.' },
      { n: 'Fleabag', lv: 4, why: 'Çok hızlı İngiliz zekâsı, kameraya konuşan iç ses.' },
      { n: 'Peaky Blinders', lv: 5, why: 'Birmingham aksanı. Kulağı zorlar, geliştirir.' },
      { n: 'Derry Girls', lv: 5, why: 'Kuzey İrlanda aksanı. Final sınavı gibi.' }
    ],
    podcasts: [
      { n: 'BBC 6 Minute English', u: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', why: 'Kısa, net, transkriptli. Günlük ısınma.' },
      { n: 'The English We Speak (BBC)', u: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak', why: '3 dakikada bir deyim.' },
      { n: 'Luke\'s English Podcast', u: 'https://teacherluke.co.uk/', why: 'Uzun, doğal İngiliz konuşması ve mizah.' },
      { n: 'All Ears English', u: 'https://www.allearsenglish.com/', why: 'Amerikan konuşma dili ve sosyal ifadeler.' },
      { n: 'This American Life', u: 'https://www.thisamericanlife.org/', why: 'Gerçek hikâyeler. Storytelling haftaları için.' },
      { n: 'Freakonomics Radio', u: 'https://freakonomics.com/', why: 'Ekonomi ve davranış: yazılım dışı kelime dağarcığı.' },
      { n: 'Syntax', u: 'https://syntax.fm/', why: 'Web geliştirme: işini İngilizce konuşmanın doğal hâli.' }
    ],
    youtube: [
      { n: 'Rachel\'s English', u: 'https://www.youtube.com/@rachelsenglish', why: 'Amerikan telaffuzu, bağlı konuşma, shadowing.' },
      { n: 'English with Lucy', u: 'https://www.youtube.com/@EnglishwithLucy', why: 'İngiliz telaffuzu ve C1 kelimeler.' },
      { n: 'Speak English With Vanessa', u: 'https://www.youtube.com/@SpeakEnglishWithVanessa', why: 'Gerçek hayattan konuşma kalıpları.' },
      { n: 'Learn English With TV Series', u: 'https://www.youtube.com/@LearnEnglishWithTVSeries', why: 'Dizi sahneleriyle dinleme ve ifade analizi.' },
      { n: 'Kurzgesagt', u: 'https://www.youtube.com/@kurzgesagt', why: 'Bilim anlatımı: net, zengin akademik kelimeler.' }
    ],
    tools: [
      { n: 'YouGlish', u: 'https://youglish.com/', why: 'Bir ifadeyi gerçek YouTube videolarında nasıl söylendiğiyle duy.' },
      { n: 'Cambridge Dictionary', u: 'https://dictionary.cambridge.org/', why: 'Tanım, telaffuz, örnek. Tek sözlük bu olsun.' },
      { n: 'Ludwig', u: 'https://ludwig.guru/', why: 'Cümlen doğal mı? Gerçek kaynaklarda ara.' },
      { n: 'Language Reactor', u: 'https://www.languagereactor.com/', why: 'Netflix ve YouTube\'da çift altyazı ve tek tıkla ifade kaydı.' },
      { n: 'italki', u: 'https://www.italki.com/', why: 'Haftada 1-2 ders: gerçek insanla konuşma pratiği.' },
      { n: 'Tandem', u: 'https://tandem.net/', why: 'Ücretsiz dil değişimi: sen Türkçe öğret, o İngilizce.' }
    ],
    method: [
      'İngilizce altyazıyla izle, Türkçe altyazıyı tamamen bırak.',
      'Bilmediğin ya da "ben böyle demezdim" dediğin her ifadede durdur ve Vault\'a ekle.',
      'Sevdiğin bir sahneyi 3 kez izle: önce anla, sonra mırıldan, sonra karakterle aynı anda söyle.',
      'Bölüm bitince 1 dakikada sesli özetle. Bu, pasif input\'u aktif output\'a çevirir.',
      'Haftada bir, altyazısız izle ve ne kadar anladığını not et.'
    ]
  };

  return { phases, weeks, areas, selfTalk, principles, routine, scenarios, freeBrief, phrasebook, freeTalks, cueCards, shadowSets, soundPairs, traps, deck, writePrompts, library };
})();
