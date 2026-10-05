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
    if(open)html='<b>Open now</b>, until 7:30 pm. By appointment only.';
    else{
      var next=(wk&&m<810)?'today at 1:30 pm':(day>=1&&day<=4)?'tomorrow at 1:30 pm':'Monday at 1:30 pm';
      html='Closed now. Opens '+next+'.';
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

  /* ---------- Contact form -> WhatsApp ---------- */
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

  /* ---------- Intro: crooked teeth get braces and straighten into a smile ---------- */
  var intro=document.getElementById('intro');
  if(!intro)return;
  var force=/[?&]intro\b/.test(location.search),seen=false;
  try{seen=sessionStorage.getItem('hdc-intro')==='1'}catch(e){}
  if(seen&&!force){intro.classList.add('hide');return}
  try{sessionStorage.setItem('hdc-intro','1')}catch(e){}
  document.body.classList.add('intro-on');

  var NS='http://www.w3.org/2000/svg',svg=intro.querySelector('svg.mouth'),layer=svg.querySelector('#teeth'),
      wireU=svg.querySelector('#wireU'),wireL=svg.querySelector('#wireL'),logo=svg.querySelector('#logoTooth'),
      glint=svg.querySelector('#glintRect'),nameEl=intro.querySelector('.intro-name'),tagEl=intro.querySelector('.intro-tag'),
      bar=intro.querySelector('.intro-bar'),skip=intro.querySelector('.intro-skip');
  var CX=380;

  // Build two arches (upper hangs down from gum line, lower stands up)
  function arch(widths,heights,edgeY,curve,upper){
    var out=[],x=0,half=[];
    for(var i=0;i<widths.length;i++){half.push({w:widths[i],h:heights[i]})}
    // right side
    x=2;
    half.forEach(function(t,i){out.push({w:t.w,h:t.h,cx:CX+x+t.w/2,i:i,side:1});x+=t.w+4});
    x=2;
    half.forEach(function(t,i){out.push({w:t.w,h:t.h,cx:CX-x-t.w/2,i:i,side:-1});x+=t.w+4});
    out.forEach(function(t){
      var dx=t.cx-CX;
      t.edge=edgeY-curve*dx*dx;              // incisal edge rises toward the back
      t.ang=Math.atan(-2*curve*dx)*180/Math.PI*(upper?1:1);
      t.upper=upper;
      // crooked start
      var s=(t.i*7+(t.side>0?3:5))%5-2;
      t.rot0=(s*7)+(t.side*3);
      t.dy0=((t.i*13+(t.side>0?2:9))%7-3)*5;
      t.dx0=((t.i*5+(t.side>0?1:4))%5-2)*4;
    });
    return out;
  }
  var upper=arch([54,44,42,37,35],[100,86,90,76,70],152,0.00036,true);
  var lower=arch([38,40,42,39,37],[70,72,78,70,66],162,-0.00030,false);
  var teeth=upper.concat(lower);

  teeth.forEach(function(t){
    var g=document.createElementNS(NS,'g');
    var r=document.createElementNS(NS,'rect');
    r.setAttribute('class','tooth');r.setAttribute('width',t.w);r.setAttribute('height',t.h);
    r.setAttribute('x',-t.w/2);r.setAttribute('y',t.upper?-t.h:0);
    r.setAttribute('rx',Math.min(t.w*.34,16));
    var b=document.createElementNS(NS,'rect');
    var bw=Math.max(14,t.w*.36);
    b.setAttribute('class','bracket');b.setAttribute('width',bw);b.setAttribute('height',13);b.setAttribute('rx',3);
    var by=t.upper?-t.h*.42:t.h*.42;
    b.setAttribute('x',-bw/2);b.setAttribute('y',by-6.5);
    t.by=by;
    g.appendChild(r);g.appendChild(b);layer.appendChild(g);
    t.g=g;t.b=b;
  });
  // Gums sit behind the teeth at the final, aligned positions
  function gumPath(set,inset){
    var pts=set.map(function(t){var a=t.ang*Math.PI/180,oy=t.upper?-(t.h-inset):(t.h-inset);return [t.cx-Math.sin(a)*oy,t.edge+Math.cos(a)*oy]}).sort(function(a,b){return a[0]-b[0]});
    var first=pts[0],last=pts[pts.length-1],d='M'+(first[0]-10)+' '+(first[1]+(set[0].upper?8:-8));
    pts.forEach(function(p){d+=' L'+p[0]+' '+p[1]});
    return d+' L'+(last[0]+10)+' '+(last[1]+(set[0].upper?8:-8));
  }
  var gums=svg.querySelector('#gums');
  [[upper,10],[lower,10]].forEach(function(s){var p=document.createElementNS(NS,'path');p.setAttribute('d',gumPath(s[0],s[1]));p.setAttribute('class','gum');gums.appendChild(p)});
  var glintTeeth=svg.querySelector('#glintClip');
  teeth.forEach(function(t){var c=t.g.querySelector('.tooth').cloneNode();c.removeAttribute('class');t.clip=c;glintTeeth.appendChild(c)});

  var ease=function(x){return x<0?0:x>1?1:(x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2)};
  var easeOut=function(x){x=x<0?0:x>1?1:x;return 1-Math.pow(1-x,3)};
  var back=function(x){x=x<0?0:x>1?1:x;var c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
  var seg=function(t,a,b){return (t-a)/(b-a)};

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOTAL=reduce?1800:7800,start=null,done=false;

  function frame(now){
    if(start===null)start=now;
    var t=reduce?99999:now-start;
    bar.style.width=Math.min(100,(now-start)/TOTAL*100)+'%';

    // 1. A single tooth (the clinic mark) draws itself: 0 - 1100ms
    var lp=easeOut(seg(t,0,1100));
    logo.style.strokeDashoffset=1-lp;
    logo.style.opacity=1-easeOut(seg(t,1100,1500));
    logo.setAttribute('transform','translate(380 150) scale('+(4.2-1.2*easeOut(seg(t,1000,1500)))+') translate(-15 -17)');

    // 2. Teeth appear crooked, centre outward: 1200 - 2200ms
    // 3. Brackets clip on: 2200 - 3000ms, wire threads through: 2600 - 3400ms
    // 4. Teeth straighten: 3400 - 5000ms
    // 5. Braces come off: 5100 - 5700ms, glint: 5500 - 6200ms
    var align=ease(seg(t,3400,5000));
    var ptsU=[],ptsL=[];
    teeth.forEach(function(tt){
      var order=tt.i+(tt.upper?0:.5);
      var pop=back(seg(t,1200+order*110,1650+order*110));
      var rot=tt.rot0*(1-align)+tt.ang*align;
      var dx=tt.dx0*(1-align),dy=tt.dy0*(1-align);
      var x=tt.cx+dx,y=tt.edge+dy;
      var tf='translate('+x+' '+y+') rotate('+rot+') scale('+Math.max(0,pop)+')';
      tt.g.setAttribute('transform',tf);tt.clip.setAttribute('transform',tf);
      tt.g.style.opacity=Math.min(1,Math.max(0,seg(t,1200+order*110,1400+order*110)));
      var bp=back(seg(t,2200+order*70,2500+order*70)),off=1-easeOut(seg(t,5100,5700));
      tt.b.style.opacity=Math.min(1,Math.max(0,bp))*off;
      tt.b.setAttribute('transform','scale('+Math.max(0,bp)+')');
      tt.b.style.transformBox='fill-box';tt.b.style.transformOrigin='center';
      // bracket centre in svg space
      var a=rot*Math.PI/180,px=x-Math.sin(a)*tt.by,py=y+Math.cos(a)*tt.by;
      (tt.upper?ptsU:ptsL).push([px,py]);
    });
    function path(pts){pts.sort(function(a,b){return a[0]-b[0]});var d='M'+pts[0][0]+' '+pts[0][1];for(var i=1;i<pts.length;i++){var p=pts[i-1],c=pts[i],mx=(p[0]+c[0])/2,my=(p[1]+c[1])/2;d+=' Q'+p[0]+' '+p[1]+' '+mx+' '+my}var l=pts[pts.length-1];return d+' L'+l[0]+' '+l[1]}
    wireU.setAttribute('d',path(ptsU));wireL.setAttribute('d',path(ptsL));
    var wp=easeOut(seg(t,2600,3400)),woff=1-easeOut(seg(t,5100,5600));
    [wireU,wireL].forEach(function(w){w.style.strokeDashoffset=1-wp;w.style.opacity=woff});

    gums.style.opacity=easeOut(seg(t,1300,2000));
    var gp=ease(seg(t,5500,6300));
    glint.setAttribute('x',-260+gp*1300);

    // 6. Name: 5700 - 6500ms
    var np=easeOut(seg(t,5700,6500)),tp=easeOut(seg(t,6000,6800));
    nameEl.style.opacity=np;nameEl.style.transform='translateY('+(16*(1-np))+'px)';
    tagEl.style.opacity=tp;tagEl.style.transform='translateY('+(12*(1-tp))+'px)';

    if((now-start)<TOTAL&&!done)requestAnimationFrame(frame);else finish();
  }
  function finish(){
    if(done)return;done=true;
    bar.style.width='100%';
    var anim=intro.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:reduce?300:900,easing:'cubic-bezier(.7,0,.2,1)',fill:'forwards'});
    anim.onfinish=function(){intro.classList.add('hide');document.body.classList.remove('intro-on')};
  }
  skip.addEventListener('click',finish);
  requestAnimationFrame(frame);
})();
