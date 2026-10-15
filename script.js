const doctors = [
 {name:"Dr. Aysel Məmmədova",spec:"Dermatoloq",clinic:"Bakı Medical Center",rating:4.9,reviews:256,exp:8,price:30,slots:["10:00","11:30","14:00","16:30"],new:true},
 {name:"Dr. Rəşad Əliyev",spec:"Dermatoloq",clinic:"Modern Hospital",rating:4.7,reviews:180,exp:12,price:35,slots:["09:00","11:00","13:30","17:00"]},
 {name:"Dr. Nigar Quliyeva",spec:"Dermatoloq",clinic:"Medline Klinikası",rating:4.8,reviews:142,exp:6,price:25,slots:["10:00","12:30","15:00","18:00"],campaign:true},
 {name:"Dr. Elvin Kərimov",spec:"Terapevt",clinic:"Baku Health Center",rating:4.6,reviews:98,exp:10,price:28,slots:["09:30","12:00","15:30","19:00"]},
 {name:"Dr. Kamran Rüstəmov",spec:"Stomatoloq",clinic:"Modern Hospital",rating:4.9,reviews:211,exp:9,price:40,slots:["10:00","13:00","16:00"]},
 {name:"Dr. Leyla Əliyeva",spec:"Pediatr",clinic:"City Hospital",rating:4.8,reviews:167,exp:11,price:30,slots:["09:00","11:30","14:30","17:30"]}
];

let activeDoctors=[...doctors];

function renderDoctors(){
 const spec=document.getElementById("filterSpecialty").value;
 const sort=document.getElementById("sortDoctors").value;
 activeDoctors=doctors.filter(d=>!spec||d.spec===spec);
 if(sort==="price") activeDoctors.sort((a,b)=>a.price-b.price);
 else activeDoctors.sort((a,b)=>b.rating-a.rating);
 const el=document.getElementById("doctorList");
 el.innerHTML=activeDoctors.map((d,i)=>`
 <article class="doctor-card">
  <div class="avatar">♙</div>
  <div>
    <h3>${d.name} ${d.new?'<span class="tag">Yeni həkim</span>':''}</h3>
    <p>${d.spec} · ${d.clinic}</p>
    <div class="rating">★ ${d.rating} <span>(${d.reviews} rəy) · Təcrübə: ${d.exp} il</span></div>
    <div style="margin-top:8px;font-size:12px;color:#59657a"><b>${d.price} AZN</b> · Qəbul qiyməti</div>
  </div>
  <div class="slots">${d.slots.map(s=>`<button class="slot" onclick="bookDoctor('${d.name}','${s}')">${s}</button>`).join("")}</div>
 </article>`).join("") || `<p class="muted">Bu kriteriyalara uyğun həkim tapılmadı.</p>`;
}

function filterDoctors(spec){
 document.getElementById("filterSpecialty").value=spec;
 document.getElementById("doctors").scrollIntoView({behavior:"smooth"});
 renderDoctors();
}
function searchDoctors(){
 const spec=document.getElementById("specialtySearch").value;
 document.getElementById("filterSpecialty").value=spec;
 document.getElementById("doctors").scrollIntoView({behavior:"smooth"});
 renderDoctors();
}
function bookDoctor(name,time){
 openBooking(`Növbə: ${name}`,`${time} — Bu gün`);
}
function bookCampaign(name){openBooking(name,"Kampaniya vaxtı");}
function openBooking(title,subtitle){
 document.getElementById("modalContent").innerHTML=`
 <span class="eyebrow">NÖVBƏ GÖTÜR</span><h2>${title}</h2><p>${subtitle}</p>
 <div class="form"><input id="bookName" placeholder="Ad və soyad"><input id="bookPhone" placeholder="Telefon nömrəsi"><button class="btn primary" onclick="confirmBooking()">Növbəni təsdiqlə</button></div>`;
 document.getElementById("modalBackdrop").classList.add("open");
}
function confirmBooking(){
 const n=document.getElementById("bookName").value.trim();
 if(!n){showToast("Zəhmət olmasa adınızı daxil edin");return}
 closeModal();showToast(`✓ ${n}, növbəniz təsdiqləndi!`);
}
function openModal(type){
 document.getElementById("modalContent").innerHTML=type==="login"?
 `<span class="eyebrow">HEALTHWAY</span><h2>Xoş gəlmisiniz</h2><p>Hesabınıza daxil olun.</p><div class="form"><input placeholder="Telefon və ya e-mail"><input type="password" placeholder="Şifrə"><button class="btn primary" onclick="closeModal();showToast('Demo giriş uğurludur')">Daxil ol</button></div>`:
 `<span class="eyebrow">HEALTHWAY</span><h2>Hesab yarat</h2><p>Həkim qəbulunu daha rahat idarə et.</p><div class="form"><input placeholder="Ad və soyad"><input placeholder="Telefon"><input type="password" placeholder="Şifrə"><button class="btn primary" onclick="closeModal();showToast('Demo hesab yaradıldı')">Qeydiyyatdan keç</button></div>`;
 document.getElementById("modalBackdrop").classList.add("open");
}
function closeModal(e){if(!e||e.target.id==="modalBackdrop")document.getElementById("modalBackdrop").classList.remove("open")}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function toggleMenu(){document.querySelector(".nav nav").style.display="flex";document.querySelector(".nav nav").style.position="absolute";document.querySelector(".nav nav").style.top="76px";document.querySelector(".nav nav").style.left="0";document.querySelector(".nav nav").style.right="0";document.querySelector(".nav nav").style.padding="20px";document.querySelector(".nav nav").style.background="#fff";document.querySelector(".nav nav").style.flexDirection="column"}
document.getElementById("dateSearch").valueAsDate=new Date();
renderDoctors();


/* HealthWay chatbot — local demo assistant (no external API required) */
(function initHealthWayChat(){
 const root=document.getElementById("hwChat");
 if(!root)return;
 const panel=document.getElementById("hwChatPanel");
 const launcher=document.getElementById("hwChatLauncher");
 const closeBtn=document.getElementById("hwChatClose");
 const messages=document.getElementById("hwChatMessages");
 const form=document.getElementById("hwChatForm");
 const input=document.getElementById("hwChatInput");
 const suggestions=document.getElementById("hwChatSuggestions");
 let welcomed=false;

 function setOpen(open){
   root.classList.toggle("is-open",open);
   launcher.setAttribute("aria-expanded",String(open));
   panel.setAttribute("aria-hidden",String(!open));
   if(open){
     if(!welcomed){
       addMessage("bot","Salam! Mən HealthWay-in virtual köməkçisiyəm. 😊\nSizə uyğun həkimi tapmağa, qəbul qiymətlərini öyrənməyə və növbə götürmə prosesini izah etməyə kömək edə bilərəm.");
       welcomed=true;
     }
     window.setTimeout(()=>input.focus(),120);
   }
 }
 function addMessage(type,text){
   const item=document.createElement("div");
   item.className="hw-chat-msg "+type;
   item.textContent=text;
   messages.appendChild(item);
   messages.scrollTop=messages.scrollHeight;
 }
 function goDoctors(spec){
   const filter=document.getElementById("filterSpecialty");
   if(filter){
     filter.value=spec||"";
     if(typeof renderDoctors==="function")renderDoctors();
     document.getElementById("doctors")?.scrollIntoView({behavior:"smooth",block:"start"});
   }
 }
 function replyTo(raw){
   const q=raw.toLocaleLowerCase("az");
   const specialties=["Dermatoloq","Stomatoloq","Kardioloq","Ginekoloq","Pediatr","Terapevt"];
   const found=specialties.find(s=>q.includes(s.toLocaleLowerCase("az")));
   if(found){
     addMessage("bot",found+" üzrə həkim seçimlərini sizin üçün açdım. Həkim kartlarında qəbul qiymətini və mövcud saatları görə bilərsiniz.");
     goDoctors(found);
     return;
   }
   if(/salam|salamlar|hello|hi\b/.test(q)){
     addMessage("bot","Salam! 😊 Sizə necə kömək edə bilərəm? Həkim axtara, növbə götürmə qaydasını və ya qiymətləri öyrənə bilərsiniz.");
   }else if(/həkim|hekim|doktor|ixtisas|dermat|stomat|kardiolo|ginekolo|pediatr|terapevt/.test(q)){
     addMessage("bot","Əlbəttə! Hansı ixtisas üzrə həkim axtarırsınız?\nMəsələn: Dermatoloq, Stomatoloq, Kardioloq, Ginekoloq, Pediatr və ya Terapevt. İxtisasın adını yazın, uyğun həkimləri açım.");
   }else if(/növbə|novbe|qəbul|qebul|randevu|rezerv|vaxt götür|vaxt gotur/.test(q)){
     addMessage("bot","Növbə götürmək çox asandır:\n1. “Həkimlər” bölməsindən həkim seçin.\n2. Həkim kartındakı uyğun saatı seçin.\n3. Açılan pəncərədə adınızı daxil edib təsdiqləyin.\n\nBu demo versiyada növbə təsdiqi nümunə xarakterlidir.");
   }else if(/qiymət|qiymet|neçəyə|neceye|azn|ödəniş|odenis|pul|ucuz/.test(q)){
     const prices=doctors.map(d=>d.price);
     const low=Math.min(...prices),high=Math.max(...prices);
     addMessage("bot",`Hazırkı demo siyahısında qəbul qiymətləri ${low}–${high} AZN aralığındadır. Qiymət həkimə və xidmətə görə dəyişə bilər. Dəqiq məbləği həkim kartından yoxlayın.`);
     goDoctors("");
   }else if(/kampaniya|endirim|pulsuz|aksiya|təklif|teklif/.test(q)){
     addMessage("bot","Kampaniyaları görmək üçün “Kampaniyalar” bölməsinə keçin. Orada mövcud demo təklifləri və uyğun həkimlə növbə götürmək imkanı göstərilir.");
     document.getElementById("campaigns")?.scrollIntoView({behavior:"smooth",block:"start"});
   }else if(/ünvan|unvan|harada|yerləş|yerles|baku|bakı|sumqayıt|xırdalan/.test(q)){
     addMessage("bot","Axtarış sahəsində şəhəri seçə bilərsiniz: Bakı, Xırdalan və ya Sumqayıt. Həkim kartlarında klinikanın adı göstərilir. Zəhmət olmasa, axtardığınız ixtisası da yazın.");
     document.getElementById("home")?.scrollIntoView({behavior:"smooth",block:"start"});
   }else if(/əlaqə|elaqe|telefon|operator|insanla danış|insanla danis/.test(q)){
     addMessage("bot","Bu, HealthWay saytının demo köməkçisidir və hazırda canlı operatora qoşulmur. Burada həkim axtarışı və növbə götürmə ilə bağlı ümumi məlumat verə bilərəm.");
   }else if(/xəstə|xeste|ağrı|agri|dərman|derman|müalicə|mualice|simptom|təcili|tecili/.test(q)){
     addMessage("bot","Sağlamlığınız vacibdir. Mən diaqnoz qoya və müalicə təyin edə bilmirəm. Tibbi sualınız üçün ixtisaslı həkimə müraciət edin; təcili və ya həyati təhlükəli vəziyyətdə yerli təcili tibbi yardımla əlaqə saxlayın.");
   }else{
     addMessage("bot","Sizi düzgün yönləndirmək üçün bir az dəqiqləşdirə bilərsiniz? Həkim axtarışı, növbə götürmə, qəbul qiymətləri və kampaniyalar barədə kömək edə bilərəm.");
   }
 }
 function send(text){
   const value=(text||"").trim();
   if(!value)return;
   addMessage("user",value);
   input.value="";
   suggestions.style.display="none";
   window.setTimeout(()=>replyTo(value),180);
 }
 launcher.addEventListener("click",()=>setOpen(!root.classList.contains("is-open")));
 closeBtn.addEventListener("click",()=>setOpen(false));
 form.addEventListener("submit",e=>{e.preventDefault();send(input.value)});
 suggestions.addEventListener("click",e=>{
   const button=e.target.closest("button[data-chat]");
   if(!button)return;
   const key=button.dataset.chat;
   const prompts={
     doctor:"Həkim tapmaq istəyirəm",
     booking:"Növbəni necə götürüm?",
     price:"Qəbul qiymətləri",
     campaign:"Kampaniyalar"
   };
   send(prompts[key]||button.textContent);
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&root.classList.contains("is-open"))setOpen(false)});
})();
