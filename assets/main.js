(function(){
  var WA='919827215402';

  /* ---------- Mobile menu ---------- */
  var sheet=document.getElementById('sheet'),openBtn=document.getElementById('menu-open');
  function setMenu(open){
    if(!sheet)return;
    sheet.classList.toggle('open',open);
    if(openBtn)openBtn.setAttribute('aria-expanded',open);
    document.body.style.overflow=open?'hidden':'';
  }
  if(openBtn)openBtn.addEventListener('click',function(){setMenu(true)});
  if(sheet)sheet.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  /* ---------- Live open / closed status (Indore time) ---------- */
  function ist(){var d=new Date();return new Date(d.getTime()+d.getTimezoneOffset()*60000+5.5*3600000)}
  function paint(){
    var els=document.querySelectorAll('[data-status]');if(!els.length)return;
    var n=ist(),day=n.getDay(),m=n.getHours()*60+n.getMinutes(),wk=day>=1&&day<=5,open=wk&&m>=810&&m<1170,html;
    if(open)html='<b>Open now</b>, until 7:30 pm';
    else{
      var next=(wk&&m<810)?'today at 1:30 pm':(day>=1&&day<=4)?'tomorrow at 1:30 pm':'Monday at 1:30 pm';
      html='Closed now. Opens '+next;
    }
    els.forEach(function(el){el.classList.toggle('open',open);el.querySelector('span').innerHTML=html});
  }
  paint();setInterval(paint,60000);

  /* ---------- FAQ tabs + search ---------- */
  var tabs=document.querySelectorAll('.tab'),panels=document.querySelectorAll('.faq-panel'),q=document.getElementById('faq-q'),empty=document.getElementById('faq-empty');
  function filter(){
    var term=q?q.value.trim().toLowerCase():'',sel=document.querySelector('.tab[aria-selected="true"]'),active=sel?sel.getAttribute('aria-controls'):null,shown=0;
    panels.forEach(function(p){
      p.hidden=term?false:(active&&p.id!==active);
      p.querySelectorAll('details').forEach(function(d){
        var hit=!term||d.textContent.toLowerCase().indexOf(term)>-1;
        d.style.display=hit?'':'none';if(hit&&!p.hidden)shown++;
      });
    });
    if(empty)empty.style.display=shown?'none':'block';
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){tabs.forEach(function(x){x.setAttribute('aria-selected',x===t)});filter()})});
  if(q)q.addEventListener('input',filter);

  /* ---------- Booking form -> WhatsApp ---------- */
  var form=document.getElementById('book-form'),msg=document.getElementById('form-msg');
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=form.elements,miss=[];
    if(!f.first.value.trim())miss.push('first name');
    if(!f.last.value.trim())miss.push('last name');
    if(!f.phone.value.trim())miss.push('phone number');
    if(miss.length){msg.textContent='Please add your '+miss.join(', ')+'.';return}
    msg.textContent='';
    var text='Hello Hardiya Dental Clinic, I would like to book an appointment.\n\n'+
      'Name: '+f.first.value.trim()+' '+f.last.value.trim()+'\n'+
      'Phone: '+f.phone.value.trim()+(f.message.value.trim()?'\nMessage: '+f.message.value.trim():'');
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener');
  });

  /* =========================================================
     INTRO: a grumpy, germy tooth gets brushed until it sparkles
     ========================================================= */
  var intro=document.getElementById('intro');
  if(!intro)return;
  var force=/[?&]intro\b/.test(location.search),seen=false;
  try{seen=sessionStorage.getItem('hdc-intro2')==='1'}catch(e){}
  if(seen&&!force){intro.classList.add('hide');return}
  try{sessionStorage.setItem('hdc-intro2','1')}catch(e){}
  document.body.classList.add('intro-on');

  var NS='http://www.w3.org/2000/svg';
  function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
  var INK='#141B34';
  var svg=intro.querySelector('svg');
  var TOOTH='M8 2.5c-4 0-6.5 3-6.5 7.5 0 4.5 1.6 7.6 2.6 11.5 1 4 1.2 10.5 4 10.5 2.6 0 2.8-7.2 6.9-7.2s4.3 7.2 6.9 7.2c2.8 0 3-6.5 4-10.5 1-3.9 2.6-7 2.6-11.5 0-4.5-2.5-7.5-6.5-7.5-3.2 0-4.4 1.8-7 1.8S11.2 2.5 8 2.5z';

  // Ground shadow
  var shadow=el('ellipse',{cx:200,cy:332,rx:70,ry:10,fill:'rgba(20,27,52,.25)'},svg);

  // Germs (behind the tooth so they can peek out)
  var germLayer=el('g',{},svg);
  var germDefs=[[92,150,'#7BD34E'],[318,128,'#B48CFF'],[78,262,'#B48CFF'],[326,248,'#7BD34E'],[200,62,'#FFB547']];
  var germs=germDefs.map(function(d,i){
    var g=el('g',{},germLayer);
    for(var k=0;k<9;k++){var a=k/9*Math.PI*2;el('circle',{cx:Math.cos(a)*19,cy:Math.sin(a)*19,r:5.5,fill:d[2],stroke:INK,'stroke-width':2},g)}
    el('circle',{cx:0,cy:0,r:19,fill:d[2],stroke:INK,'stroke-width':2.5},g);
    el('circle',{cx:-6,cy:-3,r:5,fill:'#fff',stroke:INK,'stroke-width':1.5},g);
    el('circle',{cx:6,cy:-3,r:5,fill:'#fff',stroke:INK,'stroke-width':1.5},g);
    el('circle',{cx:-5,cy:-2,r:2.2,fill:INK},g);
    el('circle',{cx:7,cy:-2,r:2.2,fill:INK},g);
    el('path',{d:'M-6 8 Q0 4 6 8',fill:'none',stroke:INK,'stroke-width':2,'stroke-linecap':'round'},g);
    return {g:g,x:d[0],y:d[1],i:i,dir:d[0]<200?-1:1};
  });

  // The tooth character
  var charG=el('g',{},svg);
  var body=el('g',{},charG);
  var toothPath=el('path',{d:TOOTH,transform:'translate(-90 -102) scale(6)',fill:'#E9D27C',stroke:INK,'stroke-width':.45,'stroke-linejoin':'round'},body);
  var shine=el('path',{d:'M-56 -66 Q-62 -40 -54 -20',fill:'none',stroke:'#fff','stroke-width':9,'stroke-linecap':'round',opacity:0},body);
  var spots=el('g',{},body);
  [[-40,-62,9],[44,-48,7],[-20,26,8],[52,10,6],[10,-80,5]].forEach(function(s){el('circle',{cx:s[0],cy:s[1],r:s[2],fill:'#B89A3E',opacity:.75},spots)});
  var face=el('g',{},body);
  var eyes=el('g',{},face);
  [-30,30].forEach(function(x){
    var e=el('g',{transform:'translate('+x+' -26)'},eyes);
    el('ellipse',{cx:0,cy:0,rx:13,ry:16,fill:'#fff',stroke:INK,'stroke-width':2.5},e);
    el('circle',{cx:2,cy:3,r:7,fill:INK,'class':'pupil'},e);
    el('circle',{cx:4,cy:-1,r:2.4,fill:'#fff'},e);
  });
  var brows=el('path',{d:'M-44 -50 L-18 -42 M44 -50 L18 -42',stroke:INK,'stroke-width':4,'stroke-linecap':'round'},face);
  var cheeks=el('g',{opacity:0},face);
  el('ellipse',{cx:-50,cy:2,rx:12,ry:7,fill:'#FF7EB0'},cheeks);
  el('ellipse',{cx:50,cy:2,rx:12,ry:7,fill:'#FF7EB0'},cheeks);
  var mouth=el('path',{fill:'none',stroke:INK,'stroke-width':4.5,'stroke-linecap':'round','stroke-linejoin':'round'},face);
  var smileFill=el('path',{fill:INK,opacity:0},face);
  var tongue=el('path',{fill:'#FF7EB0',opacity:0},face);

  // Toothbrush
  var brush=el('g',{},svg);
  var brushInner=el('g',{transform:'rotate(-14)'},brush);
  el('rect',{x:46,y:-11,width:190,height:22,rx:11,fill:'#FF7EB0',stroke:INK,'stroke-width':2.5},brushInner);
  el('rect',{x:120,y:-6,width:80,height:12,rx:6,fill:'#FFD23F',stroke:INK,'stroke-width':2},brushInner);
  el('rect',{x:-10,y:-8,width:62,height:16,rx:8,fill:'#FF7EB0',stroke:INK,'stroke-width':2.5},brushInner);
  el('rect',{x:-62,y:-14,width:62,height:28,rx:10,fill:'#fff',stroke:INK,'stroke-width':2.5},brushInner);
  for(var b=0;b<6;b++){el('rect',{x:-58+b*9.6,y:12,width:7,height:32,rx:3,fill:b%2?'#3DDBB3':'#fff',stroke:INK,'stroke-width':1.6},brushInner)}

  // Foam bubbles
  var foamLayer=el('g',{},svg);
  var foam=[];
  for(var f=0;f<26;f++){
    var c=el('circle',{r:4+((f*37)%9),fill:'#fff',stroke:INK,'stroke-width':1.6,opacity:0},foamLayer);
    foam.push({c:c,t0:2050+f*85,dx:((f*53)%60)-30,rise:40+((f*29)%50),x0:0,y0:0,set:false});
  }

  // Sparkles
  var sparkLayer=el('g',{},svg);
  var STAR='M0 -20 C2 -6 6 -2 20 0 C6 2 2 6 0 20 C-2 6 -6 2 -20 0 C-6 -2 -2 -6 0 -20z';
  var sparks=[[78,92,'#FFD23F',1.3],[326,104,'#FFFFFF',1],[70,236,'#3DDBB3',.9],[334,226,'#FFD23F',1.15],[200,40,'#FF7EB0',.8],[128,316,'#FFFFFF',.7],[276,312,'#3DDBB3',.8]].map(function(s,i){
    var g=el('g',{},sparkLayer);el('path',{d:STAR,fill:s[2],stroke:INK,'stroke-width':2},g);
    return {g:g,x:s[0],y:s[1],s:s[3],i:i};
  });

  var nameWords=intro.querySelectorAll('.intro-name .w'),tag=intro.querySelector('.intro-tag'),bar=intro.querySelector('.intro-bar'),skip=intro.querySelector('.intro-skip');

  // easing helpers
  function cl(x){return x<0?0:x>1?1:x}
  function seg(t,a,b){return cl((t-a)/(b-a))}
  function eo(x){x=cl(x);return 1-Math.pow(1-x,3)}
  function eio(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  function back(x){x=cl(x);var c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}
  function bounce(x){x=cl(x);var n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375}
  function lerp(a,b,t){return a+(b-a)*t}
  function mix(c1,c2,t){var a=parseInt(c1.slice(1),16),b=parseInt(c2.slice(1),16);var r=Math.round(lerp(a>>16,b>>16,t)),g=Math.round(lerp((a>>8)&255,(b>>8)&255,t)),bl=Math.round(lerp(a&255,b&255,t));return 'rgb('+r+','+g+','+bl+')'}

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOTAL=reduce?1600:7600,start=null,done=false;

  function frame(now){
    if(start===null)start=now;
    var t=reduce?7000:now-start;
    bar.style.width=Math.min(100,(now-start)/TOTAL*100)+'%';

    // 1) Tooth drops in and bounces: 0-900
    var drop=bounce(seg(t,0,900));
    var y=lerp(-420,0,drop);
    var squash=1+0.14*Math.sin(Math.PI*seg(t,520,760))*(t<900?1:0);
    // happy jump at 4600-5300
    var jump=Math.sin(Math.PI*seg(t,4600,5200))*-46;
    var wobble=t>2000&&t<4300?Math.sin(t/38)*2.2:0;
    charG.setAttribute('transform','translate(200 '+(205+y+jump)+') rotate('+wobble+') scale('+(2-squash)+' '+squash+')');
    shadow.setAttribute('rx',Math.max(10,70*(0.4+0.6*drop)+jump*.5));
    shadow.setAttribute('opacity',drop);

    // 2) Germs pop in and wiggle: 900-1700; get knocked away during brushing
    germs.forEach(function(g){
      var p=back(seg(t,900+g.i*140,1250+g.i*140));
      var kick=seg(t,2300+g.i*380,2900+g.i*380);
      var ke=eo(kick);
      var x=g.x+g.dir*ke*260,yy=g.y-ke*180+ke*ke*80;
      var rot=Math.sin(t/120+g.i)*10+ke*540*g.dir;
      var s=p*(1-ke*.6);
      g.g.setAttribute('transform','translate('+x+' '+yy+') rotate('+rot+') scale('+s+')');
      g.g.style.opacity=kick>=1?0:1;
    });

    // 3) Brush slides in, scrubs, leaves: 1700-4400
    var bin=eo(seg(t,1700,2100)),bout=eio(seg(t,4100,4500));
    var scrub=t>2050&&t<4150?Math.sin((t-2050)/70)*58:0;
    var bx=lerp(560,200,bin)+scrub+bout*420, by=118+Math.sin(t/55)*4*(scrub?1:0)+(t>3000?lerp(0,46,seg(t,3000,3200))*(1-seg(t,3700,3900)):0);
    brush.setAttribute('transform','translate('+bx+' '+by+')');
    brush.style.opacity=t<1700||t>4500?0:1;

    // foam follows the bristles
    foam.forEach(function(fm){
      var p=seg(t,fm.t0,fm.t0+900);
      if(p>0&&!fm.set){fm.x0=bx-30+fm.dx;fm.y0=by+30;fm.set=true}
      if(p<=0||p>=1){fm.c.setAttribute('opacity',0);return}
      fm.c.setAttribute('cx',fm.x0+Math.sin(p*6+fm.dx)*8);
      fm.c.setAttribute('cy',fm.y0-fm.rise*eo(p));
      fm.c.setAttribute('opacity',(1-p)*.95);
      fm.c.setAttribute('transform','');
    });

    // 4) Tooth gets clean: colour, spots, expression
    var clean=eio(seg(t,2200,4100));
    toothPath.setAttribute('fill',mix('#E9D27C','#FFFFFF',clean));
    spots.setAttribute('opacity',1-clean);
    shine.setAttribute('opacity',seg(t,4100,4400));
    var happy=eo(seg(t,4200,4700));
    cheeks.setAttribute('opacity',happy);
    // brows: grumpy -> raised happy
    var b1=lerp(-50,-58,happy),b2=lerp(-42,-56,happy);
    brows.setAttribute('d','M-44 '+b1+' L-18 '+b2+' M44 '+b1+' L18 '+b2);
    brows.setAttribute('opacity',1-happy*.9);
    // mouth: frown -> big open smile
    var cy=lerp(-10,34,happy),w=lerp(16,30,happy);
    mouth.setAttribute('d','M'+(-w)+' 12 Q0 '+cy+' '+w+' 12');
    smileFill.setAttribute('d','M'+(-w)+' 12 Q0 '+cy+' '+w+' 12 Z');
    smileFill.setAttribute('opacity',happy>0.4?1:0);
    tongue.setAttribute('d','M-12 '+(12+ (cy-12)*.42)+' Q0 '+(cy-6)+' 12 '+(12+(cy-12)*.42)+' Q0 '+(12+(cy-12)*.3)+' -12 '+(12+(cy-12)*.42)+'z');
    tongue.setAttribute('opacity',happy>0.6?1:0);
    // eyes look at the brush, then wink
    var lookX=t>1700&&t<4400?cl((bx-200)/120)*4:0;
    eyes.querySelectorAll('.pupil').forEach(function(p){p.setAttribute('cx',2+lookX)});
    var blink=1;
    [[1500,1640],[3300,3420],[5500,5640]].forEach(function(r){var s=seg(t,r[0],r[1]);if(s>0&&s<1)blink=Math.abs(Math.cos(s*Math.PI))});
    eyes.setAttribute('transform','translate(0 -26) scale(1 '+Math.max(.08,blink)+') translate(0 26)');

    // 5) Sparkles burst: 4400-5400 and twinkle
    sparks.forEach(function(s){
      var p=back(seg(t,4400+s.i*90,4800+s.i*90));
      var tw=t>4800?1+Math.sin(t/160+s.i*1.7)*.15:1;
      s.g.setAttribute('transform','translate('+s.x+' '+s.y+') rotate('+(p*180+t/30)+') scale('+(p*s.s*tw)+')');
    });

    // 6) Name pops word by word: 5000-6400
    nameWords.forEach(function(w,i){
      var p=back(seg(t,5000+i*130,5450+i*130));
      w.style.opacity=cl(seg(t,5000+i*130,5150+i*130));
      w.style.transform='translateY('+(24*(1-p))+'px) rotate('+((i%2?4:-4)*(1-p))+'deg) scale('+(0.6+0.4*p)+')';
    });
    var tp=back(seg(t,6050,6500));
    tag.style.opacity=cl(seg(t,6050,6200));
    tag.style.transform='scale('+(0.5+0.5*tp)+') rotate('+(-3+3*tp)+'deg)';

    if((now-start)<TOTAL&&!done)requestAnimationFrame(frame);else finish();
  }
  function finish(){
    if(done)return;done=true;
    bar.style.width='100%';
    var a=intro.animate([{clipPath:'circle(150% at 50% 45%)'},{clipPath:'circle(0% at 50% 45%)'}],{duration:reduce?250:800,easing:'cubic-bezier(.7,0,.25,1)',fill:'forwards'});
    a.onfinish=function(){intro.classList.add('hide');document.body.classList.remove('intro-on')};
  }
  skip.addEventListener('click',finish);
  requestAnimationFrame(frame);
})();
