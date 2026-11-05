/* PINOT · Metas mensuales 2026. Referencia de planeación, NO lectura de inversión real. */
(() => {
  "use strict";
  const plans = Object.freeze({
    "2026-09": {
      label: "Septiembre 2026",
      note: "La inversión de Meta incluye $1.500.000 de Feria Pinot (alcance y frecuencia) excluidos del cálculo del CPL. La meta total es 118 leads.",
      items: [
        {platform:"Meta Ads",total:5560000,forCpl:4060000,leads:59},
        {platform:"Google Ads",total:2940000,forCpl:2940000,leads:59}
      ]
    },
    "2026-10": {
      label: "Octubre 2026",
      note: "El objetivo almacenado en Apps Script es 380 leads (220 Meta y 160 Google). En Meta se excluyen $1.500.000 del presupuesto para CPL. Son metas de planeación, no conversiones observadas.",
      items: [
        {platform:"Meta Ads",total:5560000,forCpl:4060000,leads:220},
        {platform:"Google Ads",total:2940000,forCpl:2940000,leads:160}
      ]
    },
    "2026-11": {
      label: "Noviembre 2026",
      note: "Nuevo escenario: 70% Meta y 30% Google. Meta proyecta 85 leads y Google 36, para 121 leads en total. El CPL combinado real de esta distribución objetivo se aproxima a $70.248.",
      items: [
        {platform:"Meta Ads",total:5950000,forCpl:5950000,leads:85},
        {platform:"Google Ads",total:2550000,forCpl:2550000,leads:36}
      ]
    }
  });
  const $ = id => document.getElementById(id);
  const money = value => "$" + new Intl.NumberFormat("es-CO",{maximumFractionDigits:0}).format(Math.round(value));
  const number = value => new Intl.NumberFormat("es-CO",{maximumFractionDigits:0}).format(value);
  let selected="2026-11";

  function metrics(p) {
    const total=p.items.reduce((n,x)=>n+x.total,0);
    const forCpl=p.items.reduce((n,x)=>n+x.forCpl,0);
    const leads=p.items.reduce((n,x)=>n+x.leads,0);
    return {total,forCpl,leads,cpl:leads>0?forCpl/leads:0,meta:total>0?p.items[0].total/total*100:0};
  }
  function render() {
    const p=plans[selected], m=metrics(p), google=100-m.meta;
    $("pinotPlanBudget").textContent=money(m.total);
    $("pinotPlanLeads").textContent=number(m.leads);
    $("pinotPlanLeadPeriod").textContent=p.label+" · objetivo mensual";
    $("pinotPlanCplBudget").textContent=money(m.forCpl);
    $("pinotPlanCpl").textContent=money(m.cpl);
    $("pinotPlanRows").innerHTML=p.items.map(item => {
      const part=m.total?Math.round(item.total/m.total*100):0;
      const cpl=item.leads?item.forCpl/item.leads:0;
      return "<tr><th scope='row'>"+item.platform.toUpperCase()+"</th><td>"+money(item.total)+"</td><td>"+money(item.forCpl)+"</td><td>"+number(item.leads)+"</td><td>"+money(cpl)+"</td><td>"+part+"%</td></tr>";
    }).join("");
    $("pinotPlanMix").textContent=Math.round(m.meta)+"% / "+Math.round(google)+"%";
    $("pinotPlanMetaBar").style.width=m.meta+"%";
    $("pinotPlanGoogleBar").style.width=google+"%";
    $("pinotPlanNotes").textContent=p.note;
    $("pinot-plan-detail").setAttribute("aria-labelledby","pinot-plan-tab-"+selected);
    document.querySelectorAll("[data-plan-period]").forEach(btn=>{
      const active=btn.dataset.planPeriod===selected;
      btn.setAttribute("aria-selected",String(active));
      btn.tabIndex=active?0:-1;
      btn.classList.toggle("is-current",active);
    });
  }
  function csvValue(v) { return '"'+String(v).replace(/"/g,'""')+'"'; }
  function exportPlan() {
    const p=plans[selected], m=metrics(p);
    const rows=[
      ["PINOT · METAS_MENSUALES",p.label],
      ["Periodo",selected],
      ["Estado","Proyección; no inversión ni leads reales"],
      ["Plataforma","Presupuesto Total","Presupuesto para CPL","Leads Proyectados","CPL Objetivo","Mix (%)"],
      ...p.items.map(x=>[x.platform,x.total,x.forCpl,x.leads,x.leads?x.forCpl/x.leads:0,m.total?x.total/m.total*100:0]),
      ["TOTAL",m.total,m.forCpl,m.leads,m.cpl,100],
      ["Notas",p.note]
    ];
    const blob=new Blob(["\ufeff"+rows.map(r=>r.map(csvValue).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"});
    const href=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=href; a.download="pinot_metas_"+selected+".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(href),1000);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    if(!$("pinot-plan-detail")) return;
    const tabs=[...document.querySelectorAll("[data-plan-period]")];
    tabs.forEach((btn,index)=>{
      btn.addEventListener("click",()=>{selected=btn.dataset.planPeriod;render();});
      btn.addEventListener("keydown",event=>{
        if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
        event.preventDefault();
        const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:
          (index+(event.key==="ArrowLeft"?-1:1)+tabs.length)%tabs.length;
        tabs[next].focus();tabs[next].click();
      });
    });
    $("pinotPlanDownload").addEventListener("click",exportPlan);
    render();
  });
})();
