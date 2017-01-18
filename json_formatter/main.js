(function() {
    

    
}());

function output(hsl) {
    document.querySelectorAll(".tool-title .result-title")[0].style.display = "block";
    document.body.appendChild(document.createElement('pre')).innerHTML = hsl;
}

function Submit(){
    
    var val = document.getElementsByClassName("input_textarea")[0].value;
    var result;
    
    result = "";
    
    if(ValidURL(val) === true)
    {
        result_url = val;
        
        try{
            if(ValidURL(result_url) === true){
                notice(200);
                DoXhr(result_url, '', function(clbk){
                    
                    try{
                        parsing = JSON.parse(clbk);      
                    }catch(e) {
                        notice(false);
                        return false;
                    }

                    res = JSON.stringify(parsing, undefined, 4);
                    output(syntaxHighlight(res));
                    
                    return true;
                
                });
            }else{
                notice(false);
            }
            
        }catch(err){
           notice(false);
        }
    }else{
        try{
            if(val === ""){
                notice(201);
                return false;
            }else{
                result = JSON.stringify(JSON.parse(val), undefined, 4);
                output(syntaxHighlight(result));
            }  
        }catch(err){

        }
        
        if(result !== ""){
            notice(200);
        }else{
            notice(202);
        }
    }
    
}

/*function IsJsonString(str) {
   try{
       JSON.parse(str);
   }catch(e) {
        return false;
   }
   return true;
}*/

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  }else{
    return true;
  }
}

function DoXhr(url, params, cb)
{
    var xhr = new XMLHttpRequest();
            
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4) {

            cb(xhr.response);
            return xhr.response;
        }
    };

    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.send(params);
}

function notice(status)
{
    var alert = document.getElementsByClassName("alert")[0];
      
    if(status === 200){
        alert.style.display = 'block';
        alert.className = "alert-success";
        alert.innerHTML = '<div class="alt">VALID JSON</div>';    
        setTimeout(function(){ alert.style.display = "none"; }, 6000);
    }else if(status === 201){
        alert.style.display = 'block';
        alert.className = 'alert-danger';
        alert.innerHTML = '<div class="alt">INVALID JSON : isi url/json data dengan teliti</div>';
        setTimeout(function(){ alert.style.display = "none"; }, 6000);
    }else if(status === 202){
        alert.style.display = 'block';
        alert.className = 'alert-danger';
        alert.innerHTML = '<div class="alt">INVALID JSON : json data harus berupa array bukan string</div>';
        setTimeout(function(){ alert.style.display = "none"; }, 6000);
    }else{
        alert.style.display = 'block';
        alert.className = 'alert-danger';
        alert.innerHTML = '<div class="alt">INVALID JSON : URL tidak valid</div>';
        setTimeout(function(){ alert.style.display = "none"; }, 6000);
    }
}


function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}