const CAT={heritage:{n:'Historical Places & Heritage Houses',e:'🏛️',c:'#6b4a2f'},church:{n:'Churches & Cultural Landmarks',e:'⛪',c:'#7a5fb5'},mountain:{n:'Mountains & Adventure',e:'⛰️',c:'#1f5c3a'}};
const D=[
{id:'church',img:'places/church.jpg',name:'St. Francis of Assisi Parish Church (Sariaya Church)',cat:'church',lat:13.9636,lng:121.5235,feat:1,addr:'4322 Maharlika Highway, Poblacion',desc:'The Spanish-era parish church of Sariaya, recorded as built in 1748 and listed among the Philippines’ cultural properties. The turreted Natalio Enriquez ancestral house stands beside it.',act:'Heritage sightseeing, church visit, town-plaza stroll'},
{id:'gala',img:'places/gala.jpg',name:'Gala-Rodriguez Ancestral House',cat:'heritage',lat:13.961951,lng:121.524808,feat:1,addr:'Rizal Street, Poblacion',desc:'Completed May 4, 1935 and designed by architect Juan Nakpil. One of several grand houses of the town’s illustrados along Rizal Street.',act:'Exterior viewing; interior access varies — inquire locally'},
{id:'villa',img:'places/villa.jpg',name:'Don Catalino Rodriguez Ancestral House (Villa Sariaya)',cat:'heritage',lat:13.96293,lng:121.52501,feat:1,addr:'Poblacion',desc:'Built in 1922 and one of three houses declared Heritage Houses by the National Historical Institute in Sariaya. Visitors have reportedly been able to rent costumes for souvenir photos for a fee.',act:'Photography, heritage tour'},
{id:'banahaw',img:'places/banahaw.jpg',name:'Mount Banahaw',cat:'mountain',lat:14.0667,lng:121.4917,feat:1,addr:'Summit area shown (general location); Sariaya occupies the northern foothills',desc:'An active complex volcano. Sariaya lies on its southern flank — the highest point in the municipality is about 1,200 m at Barangays Concepcion Banahaw and Sampaloc Bogon. The pin marks the mountain generally, not a trailhead.',act:'Trekking (check current access rules with local authorities)'},
{id:'emralino',name:'Emralino-Rodriguez Ancestral House',cat:'heritage',lat:13.962399,lng:121.523642,addr:'Mabini St.',desc:'A cultural-property-listed ancestral house in the Poblacion heritage district.',act:'Exterior viewing'},
{id:'palabrica',name:'Isidro Palabrica Ancestral House',cat:'heritage',lat:13.962364,lng:121.524082,addr:'Bonifacio St.',desc:'A listed ancestral house a short walk from the church.',act:'Exterior viewing'},
{id:'frodriguez',name:'Francisco Rodriguez Ancestral House',cat:'heritage',lat:13.962583,lng:121.524304,addr:'Bonifacio cor. Daliz Sts.',desc:'A listed ancestral house in the town center.',act:'Exterior viewing'},
{id:'baladad',name:'Baladad-Valdeavilla Ancestral House',cat:'heritage',lat:13.9611,lng:121.524,addr:'79 Mabini cor. Argente Sts.',desc:'A listed ancestral house in the Poblacion heritage district.',act:'Exterior viewing'},
{id:'mendoza',name:'Lucinio Mendoza Ancestral House',cat:'heritage',lat:13.965331,lng:121.525259,addr:'del Pilar Street',desc:'A listed ancestral house north of the church.',act:'Exterior viewing'},
{id:'barradas',name:'Julieta Barradas Ancestral House',cat:'heritage',lat:13.964847,lng:121.526768,addr:'#17 Pablo Street',desc:'A listed ancestral house in the town center.',act:'Exterior viewing'},
{id:'panganiban',name:'Panganiban Ancestral House',cat:'heritage',lat:13.964349,lng:121.527099,addr:'Valderas Street',desc:'A listed ancestral house in the town center.',act:'Exterior viewing'},
{id:'alcala',name:'Alcala Ancestral House',cat:'heritage',lat:13.873833,lng:121.552306,addr:'Sariaya, Quezon',desc:'Listed among Sariaya’s cultural properties; its published coordinates place it south of the town center.',act:'Exterior viewing; confirm access first'}
];
const PENDING=[['Villa del Prado Beach Resort','Bignay II'],['Dalampasigan Beach Resort','Guis-Guis'],['Paraiso Beach Resort','Guis-Guis'],['Monte Vista Beach Resort','Bignay II'],['El Victor Resort','Beach resort'],['RGM Beachhausen','Beach resort']];
let fav=[];try{fav=JSON.parse(localStorage.getItem('sar_fav')||'[]')}catch(e){}
let cat='all',favOnly=false,term='';
const map=L.map('map',{scrollWheelZoom:false}).setView([13.9636,121.5235],14);
const std=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'});
const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Tiles © Esri'});
std.addTo(map);
document.getElementById('vStd').onclick=()=>{map.removeLayer(sat);std.addTo(map);vs(0)};
document.getElementById('vSat').onclick=()=>{map.removeLayer(std);sat.addTo(map);vs(1)};
function vs(s){vStd.classList.toggle('on',!s);vSat.classList.toggle('on',!!s)}
document.getElementById('vFav').onclick=e=>{favOnly=!favOnly;e.target.classList.toggle('on',favOnly);render()};
map.on('focus',()=>map.scrollWheelZoom.enable());map.on('blur',()=>map.scrollWheelZoom.disable());
const layer=L.layerGroup().addTo(map);
function pic(d,h){const e=CAT[d.cat].e;const fb=`<div class="ph" style="height:${h}px;font-size:3rem">${e}</div>`;if(!d.img)return fb;return `<img src="${d.img}" alt="${d.name}" loading="lazy" style="width:100%;height:${h}px;object-fit:cover" onerror="this.outerHTML=this.dataset.fb" data-fb='${fb.replace(/'/g,"&#39;")}'>`}
const gm=d=>`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
function icon(c){return L.divIcon({className:'',html:`<div class="pin" style="background:${c}"></div>`,iconSize:[26,26],iconAnchor:[13,26],popupAnchor:[0,-24]})}
function save(){try{localStorage.setItem('sar_fav',JSON.stringify(fav))}catch(e){}}
function visible(){return D.filter(d=>(cat==='all'||d.cat===cat)&&(!favOnly||fav.includes(d.id))&&(d.name+d.desc+d.addr).toLowerCase().includes(term))}
function render(){
 layer.clearLayers();const v=visible();
 v.forEach(d=>{const m=L.marker([d.lat,d.lng],{icon:icon(CAT[d.cat].c),title:d.name}).addTo(layer);
  m.bindPopup(`<b>${d.name}</b><br><span style="font-size:12px">${CAT[d.cat].e} ${CAT[d.cat].n}</span><br><button onclick="openM('${d.id}')" style="color:#1e6f9f;font-weight:600">View details</button>`)});
 list.innerHTML=v.length?v.map(d=>`<div class="p-2 border-b cursor-pointer hover:bg-gray-50" onclick="focusD('${d.id}')"><span>${CAT[d.cat].e}</span> <b class="text-sm">${d.name}</b><div class="text-xs text-gray-500">${d.addr}</div></div>`).join(''):'<p class="p-3 text-gray-500">No matches.</p>';
}
function focusD(id){const d=D.find(x=>x.id===id);document.getElementById('map-sec').scrollIntoView();map.flyTo([d.lat,d.lng],17);layer.eachLayer(l=>{if(l.getLatLng().lat===d.lat&&l.getLatLng().lng===d.lng)l.openPopup()})}
function openM(id){const d=D.find(x=>x.id===id);const f=fav.includes(id);
 mbody.innerHTML=`${pic(d,200)}<div class="p-6">
 <p class="text-xs uppercase tracking-wide" style="color:${CAT[d.cat].c}">${CAT[d.cat].n}</p><h3 class="text-2xl font-bold mb-2">${d.name}</h3><p class="mb-3">${d.desc}</p>
 <dl class="text-sm space-y-1 mb-4"><div><b>Location:</b> ${d.addr}, Sariaya, Quezon</div><div><b>GPS:</b> ${d.lat}, ${d.lng}</div><div><b>Activities:</b> ${d.act}</div><div><b>Fees, hours &amp; best time:</b> not verified — please check with the local tourism office.</div></dl>
 <div class="flex flex-wrap gap-2"><a class="btn" target="_blank" rel="noopener" href="${gm(d)}">Directions (Google Maps)</a><button class="chip" onclick="toggleFav('${id}')">${f?'♥ Saved':'♡ Save'}</button><button class="chip" onclick="share('${id}')">Share</button><button class="chip" onclick="closeM()">Close</button></div></div>`;
 modal.classList.add('open')}
function closeM(){modal.classList.remove('open')}
function toggleFav(id){fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];save();openM(id);render()}
async function share(id){const d=D.find(x=>x.id===id),u=`https://www.google.com/maps/search/?api=1&query=${d.lat},${d.lng}`;
 try{if(navigator.share)await navigator.share({title:d.name,text:'Visit '+d.name+' in Sariaya, Quezon',url:u});else{await navigator.clipboard.writeText(u);alert('Link copied!')}}catch(e){}}
function showTag(c){cat=c;buildChips();render();document.getElementById('map-sec').scrollIntoView();const v=visible();if(v.length)map.fitBounds(v.map(d=>[d.lat,d.lng]),{padding:[40,40],maxZoom:17})}
function buildChips(){chips.innerHTML=`<button class="chip ${cat==='all'?'on':''}" onclick="cat='all';buildChips();render()">All</button>`+Object.entries(CAT).map(([k,c])=>`<button class="chip ${cat===k?'on':''}" onclick="showTag('${k}')">${c.e} ${c.n}</button>`).join('')}
featGrid.innerHTML=D.filter(d=>d.feat).map(d=>`<div class="card">${pic(d,160)}<div class="p-4"><p class="text-xs" style="color:${CAT[d.cat].c}">${CAT[d.cat].n}</p><h3 class="font-bold">${d.name}</h3><p class="text-sm text-gray-600 my-2">${d.desc.slice(0,95)}…</p><button class="btn text-sm" onclick="focusD('${d.id}')">View on Map</button></div></div>`).join('');
pending.innerHTML=`<h3 class="font-bold text-lg mb-1">🏖️ Beach resorts awaiting verified coordinates</h3><p class="text-sm mb-3">These resorts appear in tourism listings for Sariaya, but no verified coordinates were found, so they are not pinned yet (to avoid placing them wrongly). Search them on Google Maps:</p><div class="flex flex-wrap gap-2">`+PENDING.map(p=>`<a class="chip" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p[0]+' Sariaya Quezon')}">${p[0]} · ${p[1]}</a>`).join('')+`</div><p class="text-xs mt-3 text-gray-600">Categories still to be added once verified: Nature &amp; Scenic Spots, Hidden Gems, Local Restaurants.</p>`;
const doSearch=v=>{term=v.toLowerCase();q.value=v;render()};
q.oninput=e=>doSearch(e.target.value);
heroSearch.onkeydown=e=>{if(e.key==='Enter'){doSearch(e.target.value);document.getElementById('map-sec').scrollIntoView()}};
function sendSuggest(){if(!sName.value.trim()){sMsg.textContent='Please enter a place name.';return}
 location.href=`mailto:?subject=${encodeURIComponent('Sariaya destination suggestion: '+sName.value)}&body=${encodeURIComponent(sLoc.value+'\n'+sWhy.value)}`;sMsg.textContent='Opening your email app. Set the recipient to your tourism contact in the code.'}
function sendFeedback(){location.href=`mailto:?subject=Explore%20Sariaya%20feedback&body=${encodeURIComponent(cMsg.value+'\n'+cMail.value)}`;cMsgOut.textContent='Opening your email app…'}
buildChips();render();