/* Pinot Luxury Audience Intelligence · Planning assumptions, not live ad data. */
(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const fmt = n => new Intl.NumberFormat("es-CO", {maximumFractionDigits:0}).format(n);
  const money = n => "$" + fmt(n);
  const millions = n => "$" + (n/1e6).toLocaleString("es-CO", {minimumFractionDigits:1,maximumFractionDigits:2}) + "M";
  const defaults = {budget:8500000,cpl:70000,google:45};
  const state = {...defaults, activeCluster:0, kwFilter:"Todas", kwQuery:""};
  const clusters = [
    {
      name:"Familias consolidadas",short:"Familias consolidadas",key:"01",age:"35–55 años",weight:35,
      image:"./assets/pinot-dining.webp",
      summary:"Más espacios, tranquilidad y una vida que crece con ellos.",
      quote:"«Queremos un hogar donde nuestra familia disfrute más cada día»",
      why:"Compradores que están evaluando un cambio residencial y ponderan espacios, servicios, localización y condiciones del proyecto. El ángulo de compra es bienestar cotidiano.",
      signals:["Búsquedas de apartamentos amplios en Envigado","Visitas a tipologías, servicios y zonas comunes","Contenido de arquitectura, diseño interior y vida familiar"],
      message:"Un hogar para los momentos que de verdad importan.",
      creative:"Carrusel: áreas, piscina, coworking y experiencia de vivir en Loma de las Brujas.",
      platform:"Meta descubrimiento + Search local",
      interests:["Arquitectura","Diseño de interiores","Decoración del hogar","Muebles de diseño","Proyectos inmobiliarios","Hogar y jardín"]
    },
    {
      name:"Ejecutivos y empresarios",short:"Ejecutivos",key:"02",age:"30–49 años",weight:30,
      image:"./assets/pinot-lobby.webp",
      summary:"Diseño, privacidad y ubicación para una nueva etapa.",
      quote:"«Mi casa tiene que estar a la altura de cómo quiero vivir»",
      why:"Perfiles que valoran comodidad, eficiencia de su tiempo, arquitectura y ubicación. No se asume profesión o ingresos a partir de la navegación.",
      signals:["Interacción con contenidos de diseño y arquitectura","Búsquedas de apartamentos premium y contemporáneos","Interés en agendar visitas o conocer condiciones"],
      message:"Diseñado para quienes no negocian su forma de vivir.",
      creative:"Video: experiencia de llegar a Pinot, zonas comunes y diseño contemporáneo.",
      platform:"Meta prospecting + Google premium",
      interests:["Arquitectura contemporánea","Diseño de interiores","Diseño de muebles","Viajes","Gastronomía","Bienes raíces"]
    },
    {
      name:"Patrimonio e inversión",short:"Patrimoniales",key:"03",age:"40–65 años",weight:20,
      image:"./assets/pinot-exterior.webp",
      summary:"Una decisión inmobiliaria con argumentos concretos.",
      quote:"«Quiero entender el proyecto, su ubicación y las condiciones antes de decidir»",
      why:"Personas que comparan características, constructor, fiducia, plazos y opciones de compra. Evitar prometer valorización o retornos no comprobados.",
      signals:["Búsquedas de apartamentos nuevos en Envigado","Consultas sobre precios, áreas y fiducia","Descargas de brochure o solicitudes de cita"],
      message:"Una ubicación para pensar el futuro con claridad.",
      creative:"Anuncio/landing con ubicación, Torre 2, metrajes, respaldo y cuota inicial verificada.",
      platform:"Google Search + remarketing informativo",
      interests:["Bienes raíces","Inversión inmobiliaria","Arquitectura","Vivienda nueva","Mercado inmobiliario","Diseño de interiores"]
    },
    {
      name:"Upgrade residencial",short:"Cambio de hogar",key:"04",age:"32–58 años",weight:15,
      image:"./assets/pinot-bedroom.webp",
      summary:"Pasar de un buen apartamento a uno extraordinario.",
      quote:"«Ya tenemos vivienda, ahora buscamos algo que se sienta diferente»",
      why:"Compradores que comparan vivienda actual con una nueva propuesta premium y consideran mudarse a Envigado o al sur del Valle de Aburrá.",
      signals:["Búsquedas de vivienda nueva y cambio de vivienda","Visitas repetidas a recorridos 360° o tipologías","Usuarios con señales explícitas de compra"],
      message:"Tu siguiente hogar no tiene por qué parecerse al anterior.",
      creative:"Antes/después aspiracional sin comparación negativa: amplitud, estilo, amenidades.",
      platform:"Meta remarketing + Search comparativo",
      interests:["Diseño de interiores","Mejoras del hogar","Arquitectura","Decoración","Proyectos residenciales","Vivienda nueva"]
    }
  ];
  const zones=[
    {name:"Loma de las Brujas",city:"Envigado · destino del proyecto",lat:6.1537,lng:-75.5767,priority:"CENTRO",pinot:true},
    {name:"Envigado consolidado",city:"El Escobero · sector sur",lat:6.1708,lng:-75.5835,priority:"ALTA"},
    {name:"El Poblado",city:"El Tesoro · Las Palmas",lat:6.1932,lng:-75.5575,priority:"ALTA"},
    {name:"Los Balsos / San Lucas",city:"Poblado · residencial",lat:6.1792,lng:-75.5668,priority:"ALTA"},
    {name:"Alto de Las Palmas",city:"Envigado / Oriente cercano",lat:6.1608,lng:-75.5246,priority:"TEST"},
    {name:"Sabaneta",city:"Sur del Valle de Aburrá",lat:6.1502,lng:-75.6162,priority:"TEST"}
  ];
  const campaigns=[
    {platform:"Meta Ads",name:"Prospección · Lifestyle",group:"Descubrimiento",share:32/55,channel:"meta",desc:"Reels y carruseles según motivación. Probar amplitud geográfica pertinente y señales de intención; no basarse únicamente en intereses.",kpi:"MQL / visita",icon:"◎"},
    {platform:"Meta Ads",name:"Remarketing · Alta intención",group:"Consideración",share:13/55,channel:"meta",desc:"Usuarios que visitaron producto, tipologías o recorrido 360°, con ventanas y señales consentidas. Evitar frecuencia excesiva.",kpi:"SQL / costo por cita",icon:"↺"},
    {platform:"Meta Ads",name:"Laboratorio creativo A/B",group:"Aprendizaje",share:10/55,channel:"meta",desc:"Testar diseño vs. ubicación vs. espacios, formatos verticales y formularios con preguntas de calificación.",kpi:"Calidad por mensaje",icon:"✦"},
    {platform:"Google Ads",name:"Search · Loma de las Brujas",group:"Intención local",share:28/45,channel:"google",desc:"Grupos por Envigado, Las Brujas, proyectos nuevos y apartamentos premium. Concordancia exacta y frase al inicio.",kpi:"SQL / visita",icon:"⌕"},
    {platform:"Google Ads",name:"Search · Premium",group:"Demanda calificada",share:10/45,channel:"google",desc:"Consultas de apartamento de lujo, rango de precios, compra en Envigado. Filtrar términos no pertinentes.",kpi:"Costo por lead útil",icon:"⌕"},
    {platform:"Google Ads",name:"Search · Marca Pinot",group:"Protección de marca",share:7/45,channel:"google",desc:"Capturar búsquedas por Pinot, torre 2 y comprar Pinot Envigado, con copy coherente y página de destino directa.",kpi:"Citas por búsqueda",icon:"P"}
  ];
  const kwGroups={
    "Marca":[
      ["pinot apartamentos","Alta","Exacta"],["pinot envigado","Alta","Exacta"],["pinot loma de las brujas","Alta","Exacta"],["pinot torre 2","Alta","Frase"],["proyecto pinot envigado","Alta","Frase"],["pinot apartamentos precio","Alta","Frase"],["pinot adquirir","Alta","Exacta"],["pinot arquitectura y concreto","Media","Frase"]
    ],
    "Ubicación":[
      ["apartamentos nuevos en envigado","Alta","Frase"],["apartamentos en loma de las brujas","Alta","Exacta"],["proyectos de apartamentos loma de las brujas","Alta","Frase"],["apartamentos en venta envigado loma de las brujas","Alta","Frase"],["proyectos de vivienda envigado antioquia","Media","Frase"],["apartamentos nuevos sur de medellin","Media","Frase"],["apartamentos en venta loma del escobero","Media","Frase"],["apartamentos nuevos cerca el poblado","Media","Frase"],["apartamentos con piscina envigado","Media","Frase"],["proyectos de lujo en envigado","Alta","Frase"],["apartamentos nuevos en las brujas envigado","Alta","Exacta"],["apartamentos nuevos loma del escobero envigado","Alta","Frase"],["apartamentos exclusivos el poblado envigado","Media","Frase"]
    ],
    "Premium":[
      ["apartamentos de lujo en envigado","Alta","Frase"],["apartamentos de lujo cerca de medellin","Media","Frase"],["apartamentos de 1300 millones envigado","Alta","Frase"],["apartamentos de 1500 millones envigado","Alta","Frase"],["apartamentos grandes envigado","Media","Frase"],["apartamentos exclusivos envigado","Alta","Frase"],["apartamentos modernos envigado venta","Media","Frase"],["apartamentos estrato 6 envigado","Media","Frase"],["apartamentos 3 habitaciones envigado venta","Media","Frase"],["apartamentos nuevos con coworking envigado","Media","Frase"],["apartamentos premium loma de las brujas","Alta","Exacta"],["apartamentos de mas de mil millones envigado","Alta","Frase"],["apartamentos de 160 metros envigado","Media","Frase"]
    ],
    "Inversión":[
      ["comprar apartamento nuevo envigado","Alta","Frase"],["invertir en apartamento envigado","Media","Frase"],["proyecto inmobiliario premium envigado","Media","Frase"],["apartamentos en planos envigado","Alta","Frase"],["apartamentos sobre planos envigado","Media","Frase"],["apartamentos nuevos cuota inicial envigado","Alta","Frase"],["apartamentos nuevos para inversion envigado","Media","Frase"],["comprar apartamento en envigado colombia","Alta","Frase"],["precio apartamentos loma de las brujas","Alta","Frase"],["apartamentos nuevos envigado financiacion","Media","Frase"]
    ]
  };
  const allKeywords=Object.entries(kwGroups).flatMap(([group,rows])=>rows.map(([phrase,priority,match])=>({group,phrase,priority,match})));
  const pageLabels={summary:"VISIÓN EJECUTIVA",audiences:"CLÚSTERES PREMIUM",territory:"MAPA DE OPORTUNIDAD",media:"ARQUITECTURA DE MEDIOS",keywords:"KEYWORD INTELLIGENCE",creatives:"CREATIVE STUDIO",simulator:"SIMULADOR",measurement:"CALIDAD & MEDICIÓN"};

  function setMenu(open, returnFocus=false){
    const mobile=window.matchMedia("(max-width: 900px)").matches;
    open=Boolean(open && mobile);
    $("#sidebar").classList.toggle("open",open);
    $("#sidebar").inert=mobile && !open;
    $("#navBackdrop").hidden=!open;
    $("#mobileToggle").setAttribute("aria-expanded",String(open));
    $(".main-column").inert=open;
    document.body.classList.toggle("menu-open",open);
    if(open) $("#mobileClose").focus();
    else if(returnFocus) $("#mobileToggle").focus();
  }
  function navigate(){
    let name=location.hash.replace("#","") || "summary";
    if(name==="mainContent"){$("#mainContent").focus();return;}
    if(!Object.prototype.hasOwnProperty.call(pageLabels,name)) name="summary";
    $$(".page").forEach(el=>el.classList.toggle("active",el.id===name));
    $$(".nav-link").forEach(el=>{
      const active=el.dataset.nav===name;
      el.classList.toggle("active",active);
      if(active) el.setAttribute("aria-current","page");
      else el.removeAttribute("aria-current");
    });
    $("#breadcrumb").textContent=pageLabels[name];
    document.title="PINOT | "+pageLabels[name];
    setMenu(false);
    window.scrollTo({top:0,behavior:"instant"});
    if(name==="territory") window.setTimeout(initializeMap,100);
  }
  function setupGallery(){
    const slides=[
      {image:"./assets/pinot-living.webp",alt:"Render oficial de la sala de Pinot, con balcón y vista a la ciudad",title:"Una nueva<br><i>perspectiva.</i>",caption:"Sala & vista · Render oficial"},
      {image:"./assets/pinot-exterior.webp",alt:"Render oficial de la fachada y zonas comunes de Pinot al atardecer",title:"Una ubicación.<br><i>Otro nivel.</i>",caption:"Arquitectura · Render oficial"},
      {image:"./assets/pinot-lobby.webp",alt:"Render oficial del lobby de Pinot",title:"Cada detalle<br><i>hace la diferencia.</i>",caption:"Lobby · Render oficial"}
    ];
    let active=0;
    function show(direction){
      active=(active+direction+slides.length)%slides.length;
      const slide=slides[active];
      $("#heroImage").src=slide.image;
      $("#heroImage").alt=slide.alt;
      $("#galleryTitle").innerHTML=slide.title;
      $("#galleryDescription").textContent=slide.caption;
      $("#galleryCount").textContent=String(active+1).padStart(2,"0")+" / 03";
    }
    $("#galleryPrev").addEventListener("click",()=>show(-1));
    $("#galleryNext").addEventListener("click",()=>show(1));
    $(".project-gallery").addEventListener("keydown",e=>{
      if(e.key==="ArrowLeft" || e.key==="ArrowRight"){
        e.preventDefault();show(e.key==="ArrowLeft"?-1:1);
      }
    });
  }
  function renderClusters(){
    $("#clusterCards").innerHTML=clusters.map((c,i)=>'<button class="cluster-card '+(state.activeCluster===i?'selected':'')+'" data-cluster="'+i+'" aria-pressed="'+(state.activeCluster===i)+'"><div class="cluster-photo"><img loading="lazy" src="'+c.image+'" alt="Imagen arquitectónica de Pinot"><span class="cluster-num">CLÚSTER / '+c.key+'</span></div><span>'+c.age+' · HIPÓTESIS</span><h3>'+c.name+'</h3><p>'+c.summary+'</p><div class="cluster-foot"><strong>'+c.weight+'% de inversión sugerida</strong><span>↗</span></div></button>').join("");
    $$(".cluster-card").forEach(btn=>btn.addEventListener("click",()=>{state.activeCluster=Number(btn.dataset.cluster);renderClusters();$("#clusterDetail").scrollIntoView({block:"nearest",behavior:"smooth"});}));
    let c=clusters[state.activeCluster];
    $("#metaInterests").innerHTML='<div class="interest-content"><div><span class="label-mini">CLÚSTER SELECCIONADO</span><h4>'+c.name+'</h4><p>Prueba estos términos en Ads Manager. Si no existen, elige alternativas verificables o deja la segmentación amplia.</p></div><div class="interest-chips">'+c.interests.map(v=>'<span>✧ '+v+'</span>').join("")+'</div></div>';
    $("#clusterDetail").innerHTML='<div class="cluster-detail-head"><h2>'+c.name+'</h2><span>PERFIL '+c.key+' / '+c.age+'</span></div><div class="cluster-detail-grid"><div><h4>EL INSIGHT HUMANO</h4><blockquote class="cluster-quote">'+c.quote+'</blockquote><p>'+c.why+'</p></div><div><h4>SEÑALES A VALIDAR</h4><ul>'+c.signals.map(s=>'<li>'+s+'</li>').join("")+'</ul></div><div><h4>MENSAJE & ACTIVACIÓN</h4><p><b>'+c.message+'</b></p><p>'+c.creative+'</p><p style="color:#997187;font-weight:800">→ '+c.platform+'</p></div></div>';
  }
  let leafletMap=null,markers=[];
  function initializeMap(){
    if(leafletMap){leafletMap.invalidateSize();return}
    if(!window.L){
      $("#territoryMap").innerHTML='<div style="height:100%;display:grid;place-items:center;text-align:center;padding:28px"><div>El mapa requiere conexión a Leaflet / OpenStreetMap.<br><a style="text-decoration:underline;color:#674052" href="https://www.openstreetmap.org/#map=12/6.167/-75.568" target="_blank" rel="noopener">Ver mapa real en OpenStreetMap ↗</a></div></div>';
      return;
    }
    leafletMap=L.map("territoryMap",{zoomControl:false,scrollWheelZoom:false}).setView([6.175,-75.568],12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors",maxZoom:19}).addTo(leafletMap);
    L.control.zoom({position:"bottomright"}).addTo(leafletMap);
    markers=zones.map((z,i)=>{
      const custom=L.divIcon({className:"",html:'<div class="map-pin '+(z.pinot?"pinot":"")+'"></div>',iconSize:[20,20],iconAnchor:[10,10]});
      return L.marker([z.lat,z.lng],{icon:custom}).addTo(leafletMap).bindPopup('<strong>'+z.name+'</strong><br>'+z.city+(z.pinot?'<br>Referencia aproximada, no ubicación GPS exacta':''));
    });
  }
  function renderZones(){
    $("#zoneList").innerHTML=zones.map((z,i)=>'<button class="zone-row" data-zone="'+i+'"><span class="zone-rank">'+String(i+1).padStart(2,"0")+'</span><div><strong>'+z.name+'</strong><small>'+z.city+'</small></div><span class="zone-priority">'+z.priority+'</span></button>').join("");
    $$(".zone-row").forEach(btn=>btn.addEventListener("click",()=>{if(!leafletMap)initializeMap();let i=Number(btn.dataset.zone),z=zones[i];if(leafletMap){leafletMap.flyTo([z.lat,z.lng],14,{duration:1});markers[i].openPopup();}}));
  }
  function renderCampaigns(){
    let googlePart=state.google/100, metaPart=1-googlePart;
    $("#campaignGrid").innerHTML=campaigns.map(c=>{
      let percent=(c.channel==="google"?googlePart:metaPart)*c.share;
      return '<article class="campaign-card"><div class="campaign-head"><div class="platform-mark">'+c.icon+'</div><div><strong>'+c.name+'</strong><span>'+c.platform.toUpperCase()+' · '+c.group.toUpperCase()+'</span></div><b>'+money(Math.round(state.budget*percent))+'</b></div><p class="campaign-desc">'+c.desc+'</p><div class="campaign-meter"><span style="width:'+(percent*100)+'%"></span></div><div class="campaign-foot"><span>PARTICIPACIÓN: <b>'+Math.round(percent*100)+'%</b></span><span>INDICADOR: <b>'+c.kpi+'</b></span></div></article>';
    }).join("");
  }
  function renderKeywords(){
    const rows=allKeywords.filter(k=>(state.kwFilter==="Todas"||k.group===state.kwFilter)&&k.phrase.toLocaleLowerCase("es").includes(state.kwQuery.toLocaleLowerCase("es")));
    $("#keywordCount").textContent=allKeywords.length;
    $("#keywordRows").innerHTML=rows.length?rows.map(k=>'<tr><td>'+k.phrase+'</td><td><span class="intent-tag">'+k.group+'</span></td><td><span class="priority-dot '+(k.priority==="Media"?"medium":"")+'"></span>'+k.priority+'</td><td>'+k.match+'</td></tr>').join(""):'<tr><td colspan="4">No hay resultados para esta búsqueda.</td></tr>';
    $$("#kwFilters button").forEach(btn=>btn.classList.toggle("selected",btn.dataset.filter===state.kwFilter));
  }
  const leadsByCluster=(n)=>{
    const floors=clusters.map(c=>Math.floor(n*c.weight/100));
    const remains=n-floors.reduce((a,b)=>a+b,0);
    const remainders=clusters.map((c,i)=>({i,r:n*c.weight/100-floors[i]})).sort((a,b)=>b.r-a.r);
    for(let i=0;i<remains;i++) floors[remainders[i].i]++;
    return floors;
  };
  function renderForecast(leads){
    const allocated=leadsByCluster(leads);
    $("#clusterForecast").innerHTML=clusters.map((c,i)=>'<div class="forecast-row"><label>'+c.short+'</label><div class="bar-track"><div class="bar-fill" style="width:'+c.weight+'%"></div></div><b>'+allocated[i]+' leads</b></div>').join("");
  }
  function recalc(){
    const b=state.budget,c=state.cpl,g=state.google,meta=b*(1-g/100),google=b*g/100,leads=Math.round(b/c);
    const metaLeads=Math.round(leads*(1-g/100)),googleLeads=leads-metaLeads;
    $("#budgetVal").textContent=money(b);$("#cplVal").textContent=money(c);$("#googleVal").textContent=g+"%";
    $("#summaryBudget").innerHTML=(b/1e6).toLocaleString("es-CO",{minimumFractionDigits:1,maximumFractionDigits:1}).replace(/^/,"$")+" <small>M</small>";
    $("#summaryCpl").textContent=money(c);$("#summaryLeads").innerHTML=fmt(leads)+' <small>/mes</small>';
    $("#metaSum").textContent=millions(meta);$("#googleSum").textContent=millions(google);
    $("#metaPercent").textContent=(100-g)+"%";$("#googlePercent").textContent=g+"%";
    $("#allocationRing").style.background="conic-gradient(#644051 0 "+(100-g)+"%,#d7bda6 "+(100-g)+"% 100%)";
    $("#allocationRing").setAttribute("role","img");
    $("#allocationRing").setAttribute("aria-label","Distribución: Meta "+(100-g)+"%, Google "+g+"%. Inversión total "+money(b)+" pesos");
    $(".ring-center strong").textContent=millions(b);
    $("#mediaTotal").textContent=money(b);$("#mediaMeta").textContent=money(meta);$("#mediaGoogle").textContent=money(google);
    $("#mediaMetaShare").textContent=(100-g)+"% del escenario";$("#mediaGoogleShare").textContent=g+"% del escenario";
    $("#simLeadBig").textContent=fmt(leads);
    $("#simMeta").textContent=money(meta);$("#simGoogle").textContent=money(google);
    $("#simMetaLeads").textContent="≈ "+fmt(metaLeads)+" leads";$("#simGoogleLeads").textContent="≈ "+fmt(googleLeads)+" leads";
    $(".sim-gradient-line").style.background="linear-gradient(90deg,#ac7e89 "+(100-g)+"%,#e0c5b0 "+(100-g)+"%)";
    ["budget","cpl","google"].forEach(key=>{
      const slider=$("#"+key+"Slider");
      const progress=(Number(slider.value)-Number(slider.min))/(Number(slider.max)-Number(slider.min))*100;
      slider.style.setProperty("--range-progress",progress+"%");
      slider.setAttribute("aria-valuetext",key==="google"?g+" por ciento":money(state[key])+" pesos");
    });
    renderCampaigns();renderForecast(leads);
  }
  function setupSimulator(){
    const budget=$("#budgetSlider"),cpl=$("#cplSlider"),google=$("#googleSlider");
    function update(){state.budget=Number(budget.value);state.cpl=Number(cpl.value);state.google=Number(google.value);recalc();}
    [budget,cpl,google].forEach(el=>el.addEventListener("input",update));
    $("#resetSim").addEventListener("click",()=>{budget.value=defaults.budget;cpl.value=defaults.cpl;google.value=defaults.google;update()});
    recalc();
  }
  function csvQuote(value){const s=String(value);return '"'+s.replace(/"/g,'""')+'"'}
  function downloadCsv(){
    const leads=Math.round(state.budget/state.cpl),meta=state.budget*(1-state.google/100);
    const rows=[
      ["PINOT - PROYECCIÓN ESTRATÉGICA / NO DATA REAL","Valor"],
      ["Proyecto","Pinot Apartamentos, Loma de las Brujas, Envigado"],
      ["Presupuesto mensual COP",state.budget],["CPL objetivo COP",state.cpl],["Leads estimados",leads],
      ["Meta Ads COP",meta],["Google Ads COP",state.budget-meta],
      ["Aviso","Las cifras son proyecciones. No corresponden a plataformas conectadas."],
      [],["Clúster","Peso (%)","Leads proyectados"],
      ...clusters.map((c,i)=>[c.name,c.weight,leadsByCluster(leads)[i]]),
      [],["Campaña","Plataforma","Presupuesto propuesto COP"],
      ...campaigns.map(c=>[c.name,c.platform,Math.round(state.budget*(c.channel==="google"?state.google/100:1-state.google/100)*c.share)]),
      [],["Keyword propuesta","Categoría","Prioridad","Concordancia sugerida"],
      ...allKeywords.map(k=>[k.phrase,k.group,k.priority,k.match])
    ];
    const csv="\ufeff"+rows.map(r=>r.map(csvQuote).join(";")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),href=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=href;a.download="pinot_plan_audiencias_medios.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);
  }
  function setup(){
    $$(".page button[data-goto]").forEach(b=>b.addEventListener("click",()=>{location.hash="#"+b.dataset.goto}));
    $("#mobileToggle").addEventListener("click",()=>setMenu(!$("#sidebar").classList.contains("open")));
    $("#mobileClose").addEventListener("click",()=>setMenu(false,true));
    $("#navBackdrop").addEventListener("click",()=>setMenu(false,true));
    $$(".side-nav a, .brand-mark").forEach(link=>link.addEventListener("click",()=>{
      if($("#sidebar").classList.contains("open")){setMenu(false);$("#mainContent").focus();}
    }));
    window.matchMedia("(max-width: 900px)").addEventListener("change",()=>setMenu(false));
    document.addEventListener("keydown",e=>{
      if(!$("#sidebar").classList.contains("open")) return;
      if(e.key==="Escape"){e.preventDefault();setMenu(false,true);}
      if(e.key==="Tab"){
        const items=$$("a[href], button",$("#sidebar"));
        const first=items[0],last=items[items.length-1];
        if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    $("#kwSearch").setAttribute("aria-label","Buscar palabras clave");
    $("#kwSearch").addEventListener("input",e=>{state.kwQuery=e.target.value;renderKeywords()});
    $$("#kwFilters button").forEach(b=>b.addEventListener("click",()=>{state.kwFilter=b.dataset.filter;renderKeywords()}));
    $("#exportBtn").addEventListener("click",downloadCsv);
    window.addEventListener("hashchange",navigate);
    renderClusters();renderZones();renderKeywords();setupSimulator();setupGallery();navigate();
  }
  document.addEventListener("DOMContentLoaded",setup);
})();
