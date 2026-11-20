/* Shared financial model: COP, aggregate results, no live advertising writes. */
(function (root) {
  'use strict';
  const periods = {
    '2026-12': {label:'Diciembre 2026',short:'DIC 2026',days:31,google:25,buffer:1.20,
      shares:{HERO:30,MARCAS:25,CARGOS:5,BBD:15,SEARCH:25,PMAX:0},
      title:'Cerrar el año. Abrir una conversación.',
      description:'Concentrar el esfuerzo antes del 22 de diciembre, convertir interés en formularios y sostener conversaciones cuando haya atención comercial.',
      phaseShares:[26,26,24,16,8],
      phases:[['01–07 dic',7,'Descubrimiento con información','Recorrido, ubicación y condiciones verificadas.'],['08–14 dic',7,'Resolver dudas de compra','Tipologías y alternativas de pago; formulario con revisión.'],['15–21 dic',7,'Agendar con anticipación','Citas según disponibilidad real del equipo comercial.'],['22–28 dic',7,'Continuidad controlada','Menor presión; mantener Search y atender interesados.'],['29–31 dic',3,'Puente a enero','Solicitudes para enero; pausar mensajes si no hay asesores.']]},
    '2027-01': {label:'Enero 2027',short:'ENE 2027',days:31,google:30,buffer:1.10,
      shares:{HERO:30,MARCAS:25,CARGOS:5,BBD:10,SEARCH:30,PMAX:0},
      title:'Un nuevo año. La intención de avanzar.',
      description:'Retomar interesados de diciembre, resolver financiación y disponibilidad, y aumentar gradualmente la captura de búsquedas con intención de compra.',
      phaseShares:[10,20,25,30,15],
      phases:[['01–07 ene',7,'Reactivar con contexto','Retomar consultas pendientes y confirmar disponibilidad.'],['08–14 ene',7,'Presentar el proyecto','Recorridos, distribución y condiciones vigentes.'],['15–21 ene',7,'Convertir comparación en cita','Responder objeciones y ofrecer agenda comercial.'],['22–28 ene',7,'Priorizar calidad','Mover inversión según contacto efectivo y visitas.'],['29–31 ene',3,'Cerrar aprendizajes','Seguimiento a citas y diagnóstico para febrero.']]}
  };
  const scenarios={base:{label:'Base',factor:1},conservative:{label:'Conservador',factor:1.25},efficient:{label:'Eficiente',factor:.85}};
  const definitions={
    HERO:{name:'Hero · proyecto y ubicación',platform:'Meta Ads',channel:'meta',metric:'forms',unit:'formularios',objective:'Clientes potenciales · formulario',image:'pinot-living.webp'},
    MARCAS:{name:'Marcas · diseño y espacios',platform:'Meta Ads',channel:'meta',metric:'forms',unit:'formularios',objective:'Clientes potenciales · formulario',image:'pinot-bedroom.webp'},
    CARGOS:{name:'Cargos · prueba de mensaje',platform:'Meta Ads',channel:'meta',metric:'forms',unit:'formularios',objective:'Clientes potenciales · formulario',image:'pinot-lobby.webp'},
    BBD:{name:'BBD · conversaciones',platform:'Meta Ads',channel:'meta',metric:'chats',unit:'conversaciones',objective:'Mensajes / WhatsApp',image:'pinot-dining.webp'},
    SEARCH:{name:'Search · marca y categoría',platform:'Google Ads',channel:'google',metric:'conversions',unit:'conversiones',objective:'Capturar búsquedas con intención',image:'pinot-exterior.webp'},
    PMAX:{name:'Performance Max · en reserva',platform:'Google Ads',channel:'google',metric:'conversions',unit:'conversiones',objective:'Sin inversión en el plan base',image:'pinot-exterior.webp'}
  };
  function apportion(total,weights){
    const sum=weights.reduce((a,b)=>a+b,0);
    if(!sum||!total)return weights.map(()=>0);
    const raw=weights.map(w=>total*w/sum),out=raw.map(Math.floor);
    const order=raw.map((r,i)=>({i,f:r-out[i]})).sort((a,b)=>b.f-a.f||a.i-b.i);
    for(let j=0,left=total-out.reduce((a,b)=>a+b,0);j<left;j++)out[order[j%order.length].i]++;
    return out;
  }
  function defaults(period){return {budget:8500000,google:periods[period].google,scenario:'base'};}
  function normalize(period,value={}){
    const d=defaults(period);
    return {budget:Number.isFinite(value.budget)&&value.budget>=0&&value.budget<=1e12?Math.round(value.budget):d.budget,
      google:Number.isFinite(value.google)&&value.google>=0&&value.google<=100?value.google:d.google,
      scenario:scenarios[value.scenario]?value.scenario:'base'};
  }
  function calculate(period,settings,history){
    if(!periods[period])throw new Error('Período desconocido');
    const p=periods[period],s=normalize(period,settings),factor=scenarios[s.scenario].factor;
    const ids=Object.keys(definitions);
    const shares=ids.map(id=>definitions[id].channel==='google'?(id==='SEARCH'?s.google:0):p.shares[id]/(100-p.google)*(100-s.google));
    const spends=apportion(s.budget,shares);
    const entries=ids.map((id,i)=>{
      const h=history.campaigns.find(x=>x.id===id);
      const latest=h.months[h.months.length-1];
      const latestCount=h.metric==='forms'?latest.forms:h.metric==='chats'?latest.chats:latest.results;
      const latestCost=latestCount>0?latest.spend/latestCount:null;
      const referenceCost=Math.max(h.cost,latestCost||0);
      const step=id==='BBD'?100:1000;
      const baseGoal=Math.ceil(referenceCost*p.buffer/step)*step;
      const goal=Math.ceil(baseGoal*factor/step)*step;
      return {...definitions[id],id,share:shares[i],spend:spends[i],daily:spends[i]/p.days,history:h,latestCost,referenceCost,baseGoal,goal,raw:spends[i]/goal,results:0};
    });
    const totals={forms:0,chats:0,conversions:0};
    for(const metric of Object.keys(totals)){
      const rows=entries.filter(e=>e.metric===metric);
      const count=Math.round(rows.reduce((sum,e)=>sum+e.raw,0));
      const assigned=apportion(count,rows.map(e=>e.raw));
      rows.forEach((e,i)=>e.results=assigned[i]);totals[metric]=count;
    }
    const meta=entries.filter(e=>e.channel==='meta').reduce((a,e)=>a+e.spend,0);
    const google=s.budget-meta;
    const registrationBudget=entries.filter(e=>e.metric!=='chats').reduce((a,e)=>a+e.spend,0);
    const registrations=totals.forms+totals.conversions;
    const phaseSpends=apportion(s.budget,p.phaseShares);
    const phases=p.phases.map((v,i)=>({label:v[0],days:v[1],title:v[2],action:v[3],share:p.phaseShares[i],spend:phaseSpends[i],daily:phaseSpends[i]/v[1]}));
    return {period,p,settings:s,entries,totals,meta,google,registrationBudget,registrations,costPerRegistration:registrations?registrationBudget/registrations:null,phases};
  }
  const api={periods,scenarios,definitions,defaults,normalize,apportion,calculate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.PinotFlowModel=api;
})(typeof window!=='undefined'?window:globalThis);
