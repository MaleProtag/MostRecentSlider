let metric = "follower";
let rxListener = "follower-lastest";
let timePeriod = "total";
let fontFamily = "Montserrat";
let fontSize = 80;

let aniTimingFunc = "linear";
let pxps = 240;
// 
let currencySymbol = "";
let lastEvent = null;
let lastEventName = "";
let lastEventAmount = 0;
let aniState = "IDLE";
//

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const event = obj.detail.event;

  
  if (listener == `{metric}-latest`)
  {
    lastEvent = event;
    lastEventName = event.name;
    lastEventAmount = metric != "follower" ? event.amount : 0;

    aniState = "ANI-START";
    animationNameFSM();
  }
});


window.addEventListener('onWidgetLoad', async function (obj) {
  const data = obj.detail.session.data;
  const fieldData = obj.detail.fieldData;
  
  // Update values from field data
  currency = obj.detail.currency;
  metricType = fieldData.metricType;
  metric = fieldData.metric;
  timePeriod = fieldData.timePeriod;
  pxps = fieldData.animationSpeed;
  aniTimingFunc = fieldData.animationFunction;
  /*
   * Followers:
   * data["follower-latest"]["name"]
   *
   * Subscribers:
   * data["subscriber-latest"]["name"]
   * data["subscriber-latest"]["amount"]
   *
   * Cheer:
   * data["cheer-latest"]["name"]
   * data["cheer-latest"]["amount"]
   *
   * Tip:
   * data["tip-latest"]["name"]
   * data["tip-latest"]["amount"]
   */
  
  lastEventName = data[`{metric}-latest`]["name"]
  lastEventAmount = metric != "follower" ? data[`{metric}-latest`]["amount"] : 0;
  
  
  //
  if (metric.startsWith("tip")) {
    currencySymbol = currency.symbol;
  }
    
  mptext.addEventListener('animationend', animationNameFSM);
  updateText();
});


function updateText() {
  var mptext = document.getElementById('mptext');
  
  var eventText = lastEventName;
  var amtText = ` &times ${currencySymbol}${lastEventAmount}`
  if (lastEventAmount > 0) {
    eventText = eventText + amtText;
  }
  
  mptext.innerHTML = eventText;
  
  const width = mptext.getBoundingClientRect().width;
  const aniTime = width / pxps;
  mptext.style.animation = `slide-in ${aniTime}s`;
}

function animationFSM() {

  var animation = '';
  var delay = 0;
  var timing = aniTimingFunc;
  
  switch (aniState) {
    case "ANI-START":
      animation =  'slide-out';
      break;
    case "SLID-OUT":
      updateText();
      animation = 'slide-in';
      break;
    case "SHOW-EVENT":
      animation = metric.endsWith("name") ? "" : 'slide-out';
      delay = 2;
      break;
    default:
      animation = 'slide-in';
      break;
  }
  
  // animation: name duration timing-function delay iteration-count direction fill-mode play-state;
  mptext.style.animation = animation + " " + getAnimationTime() + "s " + timing + " " + delay + "s";
      
  // Next state
  switch (aniState)
  {
    case "ANI-START":
      aniState = "SLID-OUT";
      break;
    case "SLID-OUT":
      aniState = "SHOW-EVENT";
      break;
    case "SHOW-EVENT":
      aniState = metric.endsWith("name") ? "IDLE" : "RESET";
      break;
    default:
      aniState = "IDLE";
  }
} 

function getAnimationTime() { 
  var mptext = document.getElementById('mptext');
  const width = mptext.getBoundingClientRect().width;
  return width / pxps;
}


function animationNameFSM() {
  var animation = '';
  var delay = 0;
  var timing = aniTimingFunc;
  
  console.log(aniState);
  
  switch (aniState) {
    case "ANI-START":
      animation = "slide-out";
      break;
    case "SLID-OUT":
      updateText();
      animation = "slide-in";
      break;
  }
  
  if (animation) {
  	mptext.style.animation = animation + " " + getAnimationTime() + "s ";
  } else {
    mptext.style.animation = "";
  }
  console.log(mptext.style.animation);
  
  switch (aniState) {
    case "ANI-START":
      aniState = "SLID-OUT";
      break;
    default:
      aniState = "IDLE";
  }
}


