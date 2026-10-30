/* Pinot · Flow November 2026. Synchronized with the existing global simulator. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const fmt = n => new Intl.NumberFormat("es-CO",{maximumFractionDigits:0}).format(n);
  const money = n => "$"+fmt(Math.round(n));
  let current = {budget:8500000,cpl:70000,google:42,campaigns:[]};
  let filter = "all";
  const campaignImages = {
    "HERO 1":"./assets/pinot-living.webp",
    "BBD":"./assets/pinot-dining.webp",
    "CARGOS":"./assets/pinot-lobby.webp",
    "MARCAS":"./assets/pinot-bedroom.webp",
    "PMAX":"./assets/pinot-exterior.webp",
    "KW":"./assets/pinot-living.webp"
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  function allocation() {
    const {budget,cpl,google,campaigns}=current;
    const entries=campaigns.map((c,i)=>{
      const share=c.share*(c.channel==="google"?google/100:1-google/100);
      const spend=budget*share, raw=spend/cpl;
      return {...c,i,share,spend,raw,leads:Math.floor(raw)};
    });
    const total=Math.round(budget/cpl);
    let outstanding=total-entries.reduce((s,c)=>s+c.leads,0);
    const ordered=entries.slice().sort((a,b)=>(b.raw-b.leads)-(a.raw-a.leads)||a.i-b.i);
    for(let i=0;i<outstanding;i++) ordered[i%ordered.length].leads++;
    return {entries,total};
  }
  function update(id,value){const node=$(id);if(node)node.textContent=value;}
  function renderCards(entries){
    const groups = [
      {channel:"meta", label:"META ADS", count:"04 CAMPAÑAS", title:"01 / De la inspiración al interés", subtitle:"La marca se descubre. La conexión se construye.",symbol:"∞"},
      {channel:"google", label:"GOOGLE ADS", count:"02 CAMPAÑAS", title:"02 / De la búsqueda a la intención", subtitle:"La intención aparece. La oportunidad se captura.",symbol:"G"}
    ];
    $("flowCampaignGrid").innerHTML=groups.filter(g=>filter==="all"||filter===g.channel).map(g=>{
      const matching=entries.filter(c=>c.channel===g.channel);
      return '<div class="flow-campaign-group flow-campaign-'+g.channel+'"><div class="flow-campaign-group-head"><div><span>'+g.label+' / '+g.count+'</span><h3>'+g.title+'</h3><p>'+g.subtitle+'</p></div><b>'+g.symbol+'</b></div><div class="flow-campaign-cards">'+matching.map((c,i)=>'<article class="flow-new-card"><div class="flow-card-image"><img src="'+escapeHtml(c.image||campaignImages[c.name]||"./assets/pinot-living.webp")+'" alt="Render del proyecto Pinot para campaña '+escapeHtml(c.name)+'" loading="lazy"><div class="flow-card-image-top"><span>'+String(i+1).padStart(2,"0")+' / '+g.label+'</span><span>'+Math.round(c.share*1000)/10+'% DENTRO DEL MEDIO</span></div></div><div class="flow-card-body"><div class="flow-card-label"><span>'+escapeHtml(c.group)+'</span><span>↗</span></div><h4>'+escapeHtml(c.name)+'</h4><p>'+escapeHtml(c.desc)+'</p><div class="flow-card-budget"><span>INVERSIÓN MENSUAL</span><strong>'+money(c.spend)+'</strong></div><div class="flow-card-foot"><div><small>SHARE TOTAL</small><strong>'+Math.round(c.share*1000)/10+'%</strong></div><div><small>CPL OBJETIVO</small><strong>'+money(current.cpl)+'</strong></div><div><small>LEADS EST.</small><strong>'+fmt(c.leads)+'</strong></div></div><div class="flow-card-progress"><i style="width:'+Math.max(2,c.share*100)+'%"></i></div></div></article>').join("")+'</div></div>';
    }).join("");
    /* Show % against total budget, not the relative intra-channel share. */
    $("flowCampaignGrid").querySelectorAll(".flow-new-card").forEach(card=>{
      const span=card.querySelector(".flow-card-foot > div:first-child strong");
      const index=Array.from(card.parentNode.children).indexOf(card);
      const group=card.closest(".flow-campaign-group").classList.contains("flow-campaign-meta")?"meta":"google";
      const matched=entries.filter(c=>c.channel===group)[index];
      if(span && matched)span.textContent=(Math.round(matched.share*1000)/10).toLocaleString("es-CO")+"%";
    });
  }
  function render(){
    if(!$("flowKpiBudget"))return;
    const {budget,cpl,google}=current;
    const {entries,total}=allocation();
    const meta=budget*(1-google/100),gBudget=budget-meta;
    const metaLeads=entries.filter(c=>c.channel==="meta").reduce((s,c)=>s+c.leads,0);
    const gLeads=total-metaLeads;
    update("flowKpiBudget",money(budget));
    update("flowKpiCpl",money(cpl));
    $("flowKpiLeads").innerHTML=fmt(total)+' <i>leads</i>';
    update("flowMetaShare",(100-google)+"%");
    update("flowGoogleShare",google+"%");
    update("flowMetaBudget",money(meta));
    update("flowGoogleBudget",money(gBudget));
    update("flowMixLabel",(100-google)+"% META / "+google+"% GOOGLE");
    $("flowMixBar").firstElementChild.style.width=(100-google)+"%";
    $("flowMixBar").lastElementChild.style.width=google+"%";
    update("flowBudgetText",money(budget));
    update("flowCplText",money(cpl));
    update("flowGoogleText",google+"%");
    update("flowResultLeads",fmt(total));
    update("flowResultMetaBudget",money(meta));
    update("flowResultGoogleBudget",money(gBudget));
    update("flowResultMetaLeads",fmt(metaLeads)+" leads");
    update("flowResultGoogleLeads",fmt(gLeads)+" leads");
    for(const [key,val] of [["Budget",budget],["Cpl",cpl],["Google",google]]){
      const el=$("flow"+key+"Slider");
      if(el){el.value=val;el.style.setProperty("--flow-progress",(Number(el.value)-Number(el.min))/(Number(el.max)-Number(el.min))*100+"%");}
    }
    renderCards(entries);
    document.querySelectorAll("[data-flow-filter]").forEach(btn=>{
      const active=btn.dataset.flowFilter===filter;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-pressed",String(active));
    });
  }
  function dispatchSlider(key,val){
    const corresponding={Budget:"budgetSlider",Cpl:"cplSlider",Google:"googleSlider"}[key];
    const slider=$(corresponding);
    slider.value=val;
    slider.dispatchEvent(new Event("input",{bubbles:true}));
  }
  function setup(){
    if(!$("flowCampaignGrid"))return;
    for(const key of ["Budget","Cpl","Google"]){
      $("flow"+key+"Slider").addEventListener("input",e=>dispatchSlider(key,Number(e.target.value)));
    }
    document.querySelectorAll("[data-flow-filter]").forEach(btn=>btn.addEventListener("click",()=>{
      filter=btn.dataset.flowFilter;
      render();
    }));
    $("flowReset").addEventListener("click",()=>{
      $("budgetSlider").value=8500000;
      $("cplSlider").value=70000;
      dispatchSlider("Google",42);
    });
    $("flowExport").addEventListener("click",()=>$("exportBtn").click());
    render();
  }
  window.addEventListener("pinot:planning",e=>{current=e.detail;render();});
  document.addEventListener("DOMContentLoaded",setup);
})();