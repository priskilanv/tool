(function(){
    
    

}());

function output(hsl) {
    document.querySelectorAll(".tool-title .result-title")[0].style.display = "block";
    document.body.appendChild(document.createElement('pre')).innerHTML = hsl;
}


function Submit()
{
    var val_url = document.getElementsByClassName("input_text")[0].value;
    var val_data = document.getElementsByClassName("input_textarea")[0].value;

    var form = document.getElementById("form");
    
    var formData = new FormData(form);

    try {
        var obj = JSON.parse(val_data);
        Object.keys(obj).forEach(function (key, index){
            formData.append(key, obj[key]);
        });
    } catch (e) {
    }
       
    //data = val_data;

    //formData.append("textarea", data);
     
    if(val_url !== "" && val_data !== ""){
        if(ValidURL(val_url) === true)
        { 
            fix_url = val_url;
            try{
                DoXhr(fix_url, formData, function(result){
                    res = JSON.stringify(JSON.parse(result), undefined, 4);
                    output(syntaxHighlight(res));
                });
                notice(200);
                return false;
            }catch(err){

            }
            
        }else{
            notice(false);
            return false;
        }
    }else{
        notice(201);
        return false;
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


function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  }else{
    return true;
  }
}

function notice(status)
{
    var alert = document.getElementsByClassName("alert")[0];
      
    if(status === 200){
        alert.style.display = 'block';
        alert.className = "alert-success";
        alert.innerHTML = '<div class="alt">VALID JSON</div>';    
        setTimeout(function(){ alert.style.display = "none"; }, 6000);
        document.getElementById("form").reset();
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