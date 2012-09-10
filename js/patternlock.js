var patternlock={
	
	// Parameters-------------------
		
	autoInit:true,
	autoSubmit:true,

	// Code-------------------------

	isdrawing:false,
	from:"",
	to:"",
	inputbox:"",
	startbutton:0,
		
	init:function(){ 
	
		if (this.autoInit){
		  var pw = document.getElementsByTagName("input");
		  for (var i=0;i<pw.length;i++){
			  if(pw[i].className == 'patternlock'){
			  	this.generate(pw[i]);
			  }
			 if((pw[i].type=='submit') && (this.autoSubmit)){
				 pw[i].style.display = 'none';
			 }
		  }
		}
	} ,

	generate:function(el){
		this.inputbox = el;
		el.style.display = 'none';
		var pel = el.parentNode;
		
		// main container
		var patternTag = document.createElement("div");
	    patternTag.className = "patternlockcontainer";
		
		
		// horizontal lines
		var linesTag = document.createElement("div");
		linesTag.className = "patternlocklineshorizontalcontainer";
		var elid=["12","23","45","56","78","89"];
		for (var i=0;i<6;i++){
			var lineTag = document.createElement("div");
			lineTag.className = "patternlocklinehorizontal";
			lineTag.id = "line" + elid[i];
			linesTag.appendChild(lineTag);
		}
		patternTag.appendChild(linesTag);
		
		// vertical lines
		var linesTag = document.createElement("div");
		linesTag.className = "patternlocklinesverticalcontainer";
		var elid=["14","25","36","47","58","69"];
		for (var i=0;i<6;i++){
			var lineTag = document.createElement("div");
			lineTag.className = "patternlocklinevertical";
			lineTag.id = "line" + elid[i];
			linesTag.appendChild(lineTag);
		}
		patternTag.appendChild(linesTag);
		
		// diagonal lines
		var linesTag = document.createElement("div");
		linesTag.className = "patternlocklinesdiagonalcontainer";
		var elid=["24","35","57","68"];
		for (var i=0;i<4;i++){
			var lineTag = document.createElement("div");
			lineTag.className = "patternlocklinediagonalforward";
			lineTag.id = "line" + elid[i];
			linesTag.appendChild(lineTag);
		}
		patternTag.appendChild(linesTag);
		var linesTag = document.createElement("div");
		var elid=["15","26","48","59"];
		linesTag.className = "patternlocklinesdiagonalcontainer";
		for (var i=0;i<4;i++){
			var lineTag = document.createElement("div");
			lineTag.className = "patternlocklinediagonalbackwards";
			lineTag.id = "line" + elid[i];
			linesTag.appendChild(lineTag);
		}
		patternTag.appendChild(linesTag);
		
		
		// the 9 buttons
		var buttonsTag = document.createElement("div");
		buttonsTag.className = "patternlockbuttoncontainer";
		for (var i=1;i<10;i++){
			var buttonTag = document.createElement("div");
			buttonTag.className = "patternlockbutton";
			buttonTag.id = "patternlockbutton" + i;
			buttonTag.onmousedown = function(e){
				if (!e){
					var e = window.event;
				}else{
					e.preventDefault();
				}
				patternlock.buttontouchstart(this)
			};
			buttonTag.ontouchstart = function(e){
				if (!e) var e = window.event;
				e.preventDefault();
				patternlock.buttontouchstart(this)
			}; 
			buttonTag.onmouseover = function(){patternlock.buttontouchover(this)};
			buttonTag.ontouchmove = patternlock.buttontouchmove;
			buttonTag.onmouseup = function(){patternlock.buttontouchend(this)}; 
			buttonTag.ontouchend = function(){patternlock.buttontouchend(this)}; 
			buttonsTag.appendChild(buttonTag);
		}
		patternTag.appendChild(buttonsTag);
		
		// stupid preloader for the hover images
		var imgTag = document.createElement("div");
		imgTag.style.display = 'none';
		imgTag.className = "patternlockbutton touched";
		patternTag.appendChild(imgTag);
		var imgTag = document.createElement("div");
		imgTag.style.display = 'none';
		imgTag.className = "patternlockbutton touched multiple";
		patternTag.appendChild(imgTag);
		
		
	    pel.appendChild(patternTag);
	},

	buttontouchstart:function(b){
		patternlock.isdrawing = true;
		b.className = "patternlockbutton touched";
		patternlock.from = "";
		patternlock.to = b.id.split("patternlockbutton").join("");
		this.inputbox.value = patternlock.to;
		this.startbutton = patternlock.to;
		return false;
	},

	buttontouchover:function(b){
		if (patternlock.isdrawing){
			var thisbutton = b.id.split("patternlockbutton").join("");
			
			if(thisbutton != patternlock.to){ // touching the same button twice in a row is not allowed (should it ?)
			
				var cn = b.className;
				if(cn.indexOf('touched')<0){
					b.className = "patternlockbutton touched"
				}else{
					b.className = "patternlockbutton touched multiple"
				}
			
				patternlock.from = patternlock.to;
				patternlock.to = thisbutton;
				
				//update input value
				this.inputbox.value += patternlock.to;
				
				// display line between 2 buttons 
				var thisline = document.getElementById("line" + patternlock.from + patternlock.to);
				if (patternlock.to <  patternlock.from){
					thisline = document.getElementById("line" + patternlock.to + patternlock.from);
				}
				if (thisline){
					thisline.style.visibility = 'visible';
				}
				
			}
			
			
		}
		return(false)
	},



	buttontouchmove:function(e){
		if(e.touches.length == 1){
			var touch = e.touches[0];
						
			// find position relative to first button
			var b1 = document.getElementById("patternlockbutton1");
			var b2 = document.getElementById("patternlockbutton2");
			var p = findPos(b1);
			var p2 = findPos(b2);
			var cox = parseInt(touch.pageX) - parseInt(p[0])
			var coy = parseInt(touch.pageY) - parseInt(p[1])
			var gridsize =  p2[0] - p[0] // bit stupid no ?
			
		
			// on what button are we over now?
			// grid 3x3 to sequential nummber
			var buttonnr = Math.min(2,Math.max(0,Math.floor(cox/gridsize))) + (Math.min(2,Math.max(0,Math.floor(coy/gridsize)))*3) + 1;
							
			if (buttonnr != patternlock.to){
				// only trigger if the touch is near the middle of the button
				// otherwise diagonal moves are impossible
				var distancex = (cox % gridsize);
				var distancey = (coy % gridsize);
				if ((distancex< (gridsize/2)) && (distancey < (gridsize/2))){
					// we're over a new button
					var newbutton = document.getElementById("patternlockbutton" + buttonnr)
					patternlock.buttontouchover(newbutton);
				}			
			}
		}
	},

	buttontouchend:function(b){
		if (patternlock.isdrawing){
		patternlock.isdrawing = false;
		if (this.autoSubmit){
			var dosubmit = true;
			//if (document.forms[0].onsubmit){ dosubmit = document.forms[0].onsubmit() }
			//if(dosubmit){
				
			//}
		}
		}
		return(false)
		
	},
		
	attach:function(target, functionref, tasktype){ 
		var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
		if (target.addEventListener)
			target.addEventListener(tasktype, functionref, false)
		else if (target.attachEvent)
			target.attachEvent(tasktype, functionref)
	}	
}


patternlock.attach(window, function(){patternlock.init()}, "load") ;
patternlock.attach(document, function(){patternlock.buttontouchend()}, "mouseup") ;

			
// one helper function to find the absolute position of an element			
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return [curleft,curtop];
	}
}

var pattrn = "";
var unlockPattrn = "";

function setPattern(){
	pttrn = document.getElementById("password").value;
	if(pttrn==""){
		document.getElementById("message").textContent = "Empty Pattern not Allowed! Set it Again";		
		alert("Please Draw a Pattern!")
		document.getElementById("password").value = "";
	}
	else{
		document.getElementById("password").value = "";
		//alert(pttrn);
		//document.forms[0].submit();
		document.getElementsByClassName("")
		document.getElementById("setButton").style.visibility = "hidden";
		document.getElementById("checkButton").style.visibility = "visible";
		document.getElementById("message").innerHTML = "<h3>Draw a matching pattern to unlock it</h3>";	
	}
	resetButtons();
	return true;
}

function checkPattern(){
	unlockPattrn = document.getElementById("password").value;
	//alert(pttrn+"    "+unlockPattrn);
	if(pttrn==unlockPattrn&&pttrn!=""){
		document.getElementById("message").textContent = "Login SuccessFul";
		document.getElementById("content").innerHTML = "<img src='img/select.png'/><br><br><h3>Reload the Page to Set a different Pattern</h3>";
	}
	else{
		document.getElementById("message").textContent = "Pattern Mismatch! Try Again";	
		//document.forms[0].submit();
		resetButtons();
		unlockPattrn = "";
		document.getElementById("password").value = "";
	}	
}

var resetButtons = function(){
		//Resetting the Pattern
		for(var i=0;i<document.getElementsByClassName("patternlocklinehorizontal").length;i++){
			document.getElementsByClassName("patternlocklinehorizontal")[i].style.visibility="hidden"
		}
		for(var i=0;i<document.getElementsByClassName("patternlocklinevertical").length;i++){
			document.getElementsByClassName("patternlocklinevertical")[i].style.visibility="hidden"
		}
		for(var i=0;i<document.getElementsByClassName("patternlocklinediagonalforward").length;i++){
			document.getElementsByClassName("patternlocklinediagonalforward")[i].style.visibility="hidden"
		}
		for(var i=0;i<document.getElementsByClassName("patternlocklinediagonalbackwards").length;i++){
			document.getElementsByClassName("patternlocklinediagonalbackwards")[i].style.visibility="hidden"
		}
		document.getElementById("patternlockbutton1").className = "patternlockbutton";
		document.getElementById("patternlockbutton2").className = "patternlockbutton";
		document.getElementById("patternlockbutton3").className = "patternlockbutton";
		document.getElementById("patternlockbutton4").className = "patternlockbutton";
		document.getElementById("patternlockbutton5").className = "patternlockbutton";
		document.getElementById("patternlockbutton6").className = "patternlockbutton";
		document.getElementById("patternlockbutton7").className = "patternlockbutton";
		document.getElementById("patternlockbutton8").className = "patternlockbutton";
		document.getElementById("patternlockbutton9").className = "patternlockbutton";
	}