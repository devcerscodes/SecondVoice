/* Second Voice — hand-drawn editorial portraits. No external assets. */
(function () {
  'use strict';
  const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const line = (d, color, width = 2.5) => path(d, 'none', `stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`);
  const rect = (x,y,w,h,r,c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
  const circle = (x,y,r,c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const badge = (c = '#D1B66F') => rect(94,130,19,10,2,'#F6F1E7') + rect(97,133,4,4,1,c) + line('M104 134h6', '#78828B', 2);
  const lanyard = (c) => line('M65 117l15 30 15-30',c,4) + rect(72,142,17,19,2,'#F8F5EB') + rect(75,146,6,6,1,'#A7B4BD') + line('M75 155h10','#85929B',2);
  const coat = (c) => path('M31 164l8-30q5-12 25-17l16 13 16-13q20 5 25 17l8 30Z', c);
  const lapels = (c) => path('M63 116l17 16-13 18-11-27ZM97 116l-17 16 13 18 11-27Z',c);
  const hair = {
    bun: (a,b) => circle(86,30,15,a)+path('M51 72Q45 38 71 35q33-9 38 29l-6 21-6-29q-23 8-39 0l-2 27Z',a)+path('M57 51q14-19 36-9-20-3-36 15Z',b),
    short: (a,b) => path('M52 76l-3-23q3-22 30-23l25 11 7 17-6 23-5-24-15-7-25 10-4 19Z',a)+path('M54 52q10-24 38-13L75 42Z',b),
    slick: (a,b) => path('M51 78l-3-24q0-24 30-23 33-2 34 29l-7 20-5-24q-23 6-41-3l-3 25Z',a)+line('M57 44q20-13 43 3M57 49q21-9 44 3',b,3),
    long: (a,b) => path('M44 126l3-66q1-29 31-29 32-2 35 33l6 62-25 11-37-3Z',a)+path('M52 119l3-57q2-21 22-23-14 15-14 35l1 54Z',b),
    wave: (a,b) => path('M43 128q-9-13 2-28-9-16 3-29-7-31 22-39 30-9 41 19 9 12 2 29 13 17 1 30 13 16 0 26l-24-5-31 5Z',a)+path('M50 122q-10-13 3-29-8-13 2-26-3-24 21-28-16 15-13 32-11 15-5 28-12 16 2 27Z',b),
    curls: (a,b) => path('M48 84q-14-8-4-21-8-14 7-21-1-16 16-16 13-13 25-2 18-5 22 12 16 5 10 20 10 14-4 23l-15 9-47-1Z',a)+path('M49 56q-3-12 10-12 0-12 13-11 10-9 19-1-17 0-20 13-15-3-17 13Z',b),
    bald: (a,b) => path('M52 58l8-8-3 34-7-6Zm48-8 9 9 1 19-7 6Z',a)+line('M53 62l2 12M105 62l2 12',b,3),
    bob: (a,b) => path('M46 117l1-58q1-29 32-29 30 0 33 30l2 56-20 5-29 1Z',a)+path('M52 110l2-51q1-21 23-23-13 10-15 29v50Z',b)
  };
  // All blinkable geometry stays here; eyebrows remain on the face.
  const eyes = (mood = 'steady') => [62,87].map((x) => {
    const tired = mood === 'tired', lively = mood === 'lively';
    const top = tired ? 72.5 : lively ? 71 : 71.5;
    const bottom = tired ? 84.5 : 85;
    const lid = `M${x} 76Q${x+6} ${top} ${x+12} 76`;
    return path(`${lid}Q${x+6} ${bottom} ${x} 76Z`,'#FFF9EE')
      + circle(x+6,75.8,2.8,'#292B29') + circle(x+5.2,74.7,.8,'#FFFFFF')
      + line(lid,'#3E302B',tired ? 2.5 : 2.2);
  }).join('');
  const mouths = {
    gentle: 'M73 96Q80 100 87 95Q85 102 79 101Q75 101 73 96Z',
    polite: 'M73 97Q80 99 87 96Q85 101 80 100Q76 100 73 97Z',
    neutral: 'M73 98Q80 96.5 87 98Q81 100 74 99Z',
    open: 'M73 95Q80 99 87 94Q87 103 80 103Q74 103 73 95Z'
  };
  function portrait(o) {
    return (uid) => {
      const s=o.skin, sh=o.shade, h=o.hair, hi=o.light;
      let back = o.style==='long'||o.style==='wave'||o.style==='bob'||o.style==='curls';
      return rect(0,0,160,160,0,o.bg)
        + (o.behind || '')
        + (back ? hair[o.style](h,hi) : '')
        + coat(o.clothes)
        + path('M68 97h24v23l-12 14-14-15Z',s)
        + path('M68 98h24v11q-11 10-24-1Z',sh)
        + (o.outfit || line('M61 119q19 23 38 0',o.seam||hi,3))
        + path('M55 69q-11-6-10 7 0 11 12 10M103 69q11-6 10 7 0 11-12 10',s)
        + line('M49 75l4 5M110 75l-4 5',sh,2)
        + path(o.face,s)
        + path(o.cheek || 'M102 76q0 26-22 32 14-1 22-14l4-20Z',sh)
        + ((!back) ? hair[o.style](h,hi) : (o.fringe || path('M53 68q-3-27 23-30 28-5 30 30l-8-15q-20 7-37-1Z',h)))
        + (o.beard || '')
        + line(o.brows||'M62 67l12-2M87 65l12 3',h,3)
        + `<g class="eyes">${eyes(o.gaze)}</g>`
        + path(o.nose||'M80 74l-4 13 9 1-3-4Z',sh)
        + path(mouths[o.expression || 'gentle'],o.lip||'#754A3B','class="mouth"')
        + (o.detail||'') + (o.prop||'');
    };
  }
  const oval='M55 61q1-23 25-23 24 0 25 24l-2 24q-3 19-23 24-21-6-24-24Z';
  const square='M54 59q3-22 26-22 24 0 26 23l-2 34-12 15H69L56 95Z';
  const slim='M58 57q4-20 23-20 22 0 23 23l-4 32-20 19-19-17Z';
  window.SV_PORTRAITS = {
    gp: portrait({skin:'#B57B52',shade:'#965D3D',hair:'#1D1410',light:'#493127',style:'bun',bg:'#CFEDE8',clothes:'#F9FAF6',face:oval,brows:'M62 67q6-4 12-2M87 65l12 3',outfit:path('M65 117l15 12 15-12v43H65Z','#E9EEF3')+lapels('#D8E1E2'),prop:line('M61 120v14q0 13 10 13t10-13v-14','#344D54',4)+line('M97 122v23l-7 6','#344D54',4)+circle(89,152,6,'#344D54')+circle(89,152,3,'#B4CBCB')}),
    landlord: portrait({expression:'neutral',skin:'#F2C9A5',shade:'#D4A17E',hair:'#6B5A4A',light:'#A19585',style:'bald',bg:'#E8E2D4',clothes:'#6B7B5E',face:'M54 60q0-27 26-27t26 27l-2 31q-2 23-24 23-23-3-25-23Z',brows:'M61 66l13 2M87 65q6-4 12-1',outfit:path('M65 117l15 13 15-13-3 43H69Z','#E5DFCF')+line('M63 118l17 25 17-25M80 143v19','#46583E',4)+circle(81,152,2,'#D8CDB4'),detail:line('M68 51q12-4 24 0M65 83l8 1M88 83l9-1','#D4A17E',2),prop:path('M121 148l-7-50-8-11q-5-5-9 0l1 14 7 10 2 38Z','#F2C9A5')+rect(103,66,14,35,4,'#343E3A')+rect(106,70,8,21,2,'#718B86')}),
    garage: portrait({skin:'#D9A47C',shade:'#BB835E',hair:'#3A2A1C',light:'#725036',style:'short',bg:'#DCE4EE',clothes:'#2F4A6D',face:square,brows:'M61 65l13-2M87 64l12 4',beard:path('M57 86l9 9 14 5 15-5 8-10-2 15-12 10H71l-13-11Z','#79604B'),expression:'polite',outfit:lapels('#426185')+line('M80 132v30M44 145h22','#192F4C',3)+badge(),prop:path('M101 154l-3-15q-1-6 4-6h7q6 0 6 5l-2 16Z','#D9A47C')+`<g transform="translate(108 132) rotate(22)">${path('M-8-17l4 7 7-1 4-7q8 10-2 17v27h-8V-1q-12-5-5-16Z','#ABB8BF')}${line('M0 5v16','#6F818F',2)}</g>`}),
    luggage: portrait({gaze:'tired',expression:'neutral',skin:'#8A5634',shade:'#704127',hair:'#1A1A1A',light:'#39302C',style:'long',bg:'#F1DCE3',clothes:'#7A1F3D',face:slim,fringe:path('M53 68q-4-34 26-33 28-1 28 34L91 47 59 65Z','#1A1A1A'),brows:'M63 67h11M87 67h11',outfit:lapels('#9B3D58'),detail:line('M63 82l10 1M88 83l10-1','#704127',2),prop:lanyard('#D9B576')}),
    restaurant: portrait({skin:'#F2C9A5',shade:'#D4A17E',hair:'#2A1C14',light:'#614532',style:'slick',bg:'#F6E3D6',clothes:'#1C1C1C',face:slim,brows:'M62 66l12 2M87 65l12-3',expression:'polite',outfit:lapels('#353535')+circle(80,135,2,'#E7E4D9'),prop:path('M59 137h42v29H59Z','#F5F2E9')+line('M59 138l-5-20M101 138l5-20','#F5F2E9',4)+line('M66 149h28','#C6C5BE',3)}),
    bank: portrait({skin:'#F5D7BE',shade:'#DDB497',hair:'#8B5A2B',light:'#B17E46',style:'bob',bg:'#DDE3F0',clothes:'#2E3A59',face:oval,fringe:path('M53 66q-2-31 26-32 30 0 28 33L93 47Q79 61 53 66Z','#8B5A2B'),brows:'M62 66l12-1M87 65l12 1',outfit:path('M66 117l14 13 14-13v44H66Z','#E9E9E4')+lapels('#435174'),prop:lanyard('#9E7B42')}),
    barber: portrait({gaze:'lively',expression:'open',skin:'#D9A47C',shade:'#BB835E',hair:'#B4421B',light:'#DE7540',style:'curls',bg:'#F7DED2',clothes:'#151515',face:'M55 60q2-24 25-24t25 24l-3 29q-7 21-22 21-17-2-23-21Z',fringe:path('M51 68q-8-16 5-21 0-13 14-9 8-13 20-2 14-3 16 12 9 5 1 18l-8-12q-10 5-16-4-8 10-17 3Z','#B4421B'),brows:'M62 64q6-5 12-2M87 62q7-3 12 2',outfit:line('M59 120q21 23 42 0','#47423C',4),detail:circle(51,87,4,'#D9B15F')+circle(109,87,4,'#D9B15F'),prop:path('M103 155l-3-13q-1-6 4-7l8 1q5 2 3 7l-2 12Z','#D9A47C')+`<g transform="translate(112 139) rotate(-20)" stroke="#C5D0D0" stroke-width="3.5" fill="none"><circle cx="-5" cy="10" r="5"/><circle cx="7" cy="10" r="5"/><path d="M-3 6L9-16M5 6L-5-16"/></g>`}),
    returns: portrait({expression:'neutral',skin:'#F2C9A5',shade:'#D4A17E',hair:'#C9A227',light:'#E7C55D',style:'short',bg:'#DCE7F5',clothes:'#1E5AA8',face:square,brows:'M62 66h12M87 66h12',outfit:lapels('#3875BD')+line('M80 131v14','#123E7D',3)+circle(80,137,1.5,'#E6E8DF'),prop:badge('#1E5AA8')}),
    party: portrait({gaze:'lively',expression:'open',skin:'#F5D7BE',shade:'#DDB497',hair:'#B8860B',light:'#D8AB43',style:'wave',bg:'#FBE5DA',clothes:'#E0501A',face:oval,fringe:path('M52 66q-2-32 27-31 28-1 28 30L91 45Q73 62 52 66Z','#B8860B'),brows:'M62 64l12-3M87 63q6-4 12 0',outfit:line('M60 119l20 20 20-20','#F39961',4),prop:path('M107 160l2-15q1-5 6-5h7q6 1 4 6l-4 14Z','#F5D7BE')+path('M108 115h23l-3 16q-2 7-9 7t-9-7Z','#F9F4E9')+path('M111 125h17l-2 7q-7 7-13-1Z','#A44A50')+line('M119 138v15M112 154h14','#F9F4E9',3)}),
    meeting: portrait({skin:'#B57B52',shade:'#965D3D',hair:'#1A1A1A',light:'#403C38',style:'curls',bg:'#D3EEEA',clothes:'#0E7468',face:square,fringe:path('M51 68q-7-15 5-20-2-14 13-12 8-12 19-2 14-5 18 10 12 6 3 23l-9-12q-11 4-16-5-9 9-17 3Z','#1A1A1A'),brows:'M62 66l12-3M87 64l12 3',expression:'polite',outfit:path('M65 118l15 15 15-15-7 24H73Z','#095A52'),prop:rect(105,74,5,13,2,'#F3EFE5')+circle(107.5,77,1.5,'#B4BDBA')}),
    raise: portrait({skin:'#F2C9A5',shade:'#D4A17E',hair:'#8A8A8A',light:'#B7B6B1',style:'short',bg:'#E4E7EC',clothes:'#E5E7EB',face:square,brows:'M61 66q7-4 13 0M87 66q6-4 12 0',outfit:lapels('#FAFAF5')+path('M75 125h10l-3 8 5 24-7 7-7-7 5-24Z','#45516B'),detail:line('M66 52h27M65 57h23M62 86l10 1M88 87l10-1','#D4A17E',2)+`<g fill="none" stroke="#56616B" stroke-width="2.5"><rect x="59" y="70" width="18" height="13" rx="4"/><rect x="84" y="70" width="18" height="13" rx="4"/><path d="M77 74h7"/></g>`}),
    interview: portrait({gaze:'steady',skin:'#8A5634',shade:'#704127',hair:'#111111',light:'#39302C',style:'bun',bg:'#E1E5F0',clothes:'#3B4A6B',face:slim,brows:'M62 65l12 2M87 66l12-3',expression:'polite',outfit:path('M66 117l14 13 14-13v43H66Z','#D8D5CA')+lapels('#526080'),detail:circle(51,86,3,'#D7BC7A')+circle(109,86,3,'#D7BC7A'),prop:line('M66 137l-7 10','#D7BC7A',3)}),
    witness: portrait({gaze:'steady',skin:'#D9A47C',shade:'#BB835E',hair:'#2A1C14',light:'#5B4436',style:'short',bg:'#DDE2EA',clothes:'#1F2A44',face:square,brows:'M61 68l13-1M87 67l12 1',outfit:path('M47 124l16-7 17 17 17-17 16 7 12 39H35Z','#F2E34B')+path('M65 119l15 15 15-15-8 44H73Z','#1F2A44')+line('M43 147h27M91 147h27','#E7E9D6',7),prop:path('M49 54q0-26 31-26t31 26Z','#1F2A44')+rect(48,51,64,10,1,'#EFF0E6')+path('M49 51h8v5h8v-5h8v5h8v-5h8v5h8v-5h8v5h7v5h-7v-5h-8v5h-8v-5h-8v5h-8v-5h-8v5h-8v-5h-8Z','#24292C')+path('M46 62q34-5 68 0-10 11-34 10T46 62Z','#192133')+path('M76 36h8l3 6-7 6-7-6Z','#C9BC88')+rect(97,128,12,17,2,'#273348')}),
    sam: portrait({skin:'#F2C9A5',shade:'#D4A17E',hair:'#4A3426',light:'#7C573D',style:'curls',bg:'#D3EEEA',clothes:'#0E7468',face:oval,fringe:path('M51 66q-5-14 7-19-1-14 13-10 8-12 19-2 15-2 16 13 9 6 1 18l-8-13q-11 5-17-3-10 10-17 2Z','#4A3426'),brows:'M62 65l12 2M87 63l12-2',expression:'polite',outfit:lapels('#258B7C')+line('M80 132v27','#09594F',3),prop:path('M108 155l-7-7-6-13q-2-5 2-7 4-2 6 4l5 8 16 3-1 11Z','#F2C9A5')+rect(101,126,25,26,4,'#F7F0DE')+line('M126 131h5q10 9-1 15h-4','#F7F0DE',5)+path('M125 134q8-4 8 2l-1 9q-2 5-7 3l-3-3q-2-3 2-4l4-1-4-1Z','#F2C9A5')+path('M107 119q-5-6 0-13M117 119q-5-6 0-13','none','class="steam" stroke="#FAF7EE" stroke-width="3" stroke-linecap="round"')}),
    hotel: portrait({skin:'#B57B52',shade:'#965D3D',hair:'#2A1C14',light:'#5A3C29',style:'long',bg:'#E1E5F0',clothes:'#24324F',face:oval,fringe:path('M53 68q-4-34 27-33 29 0 26 32L91 46Q74 62 53 68Z','#2A1C14'),outfit:lapels('#3B4E70')+path('M69 118l11 12 11-12-11 25Z','#C8B58B'),prop:badge()}),
    transit: portrait({skin:'#D9A47C',shade:'#BB835E',hair:'#1A1A1A',light:'#47433A',style:'short',bg:'#D7EAE4',clothes:'#2F5D50',face:square,beard:path('M55 79l9 14 16 3 16-3 9-14-3 21-12 12H70l-13-12Z','#1A1A1A')+path('M61 93l9 9 10 3 10-3 8-9-4 13-14 7-13-7Z','#47433A'),expression:'polite',outfit:lapels('#447969')+path('M71 126h18v36H71Z','#D5CDB8')+line('M60 144v18M100 144v18','#24493F',3)}),
    phone: portrait({skin:'#F2C9A5',shade:'#D4A17E',hair:'#6B3E26',light:'#996044',style:'bun',bg:'#F1DCE3',clothes:'#7A1F3D',face:oval,brows:'M62 66q6-4 12-1M87 65q6-3 12 1',outfit:line('M60 120q20 22 40 0','#A3445E',4),behind:line('M48 77V57Q48 22 80 22T112 57V77','#333B45',4),prop:rect(45,69,10,18,4,'#333B45')+rect(105,69,10,18,4,'#333B45')+line('M110 85q-1 11-19 12','#333B45',3)+rect(87,94,9,5,2.5,'#333B45')})
  };
}());
