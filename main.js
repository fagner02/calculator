window.onload = () => {
  console.log("entered");
  selectSpan($(".first")[0]);
}
var vText = $(".visor");
var selector = $(".selector");
var ops=["+","-","*","/","(",")"];
var selected = null;
var selectedId = -1;
var hideTime;
var last;
var nums = [];
var nId = 0;
var op = null;

function operate(input){
  if((input == "+" || input == "-") && 
  (op && (op == "+" || op == "-"))){
    return;
  }
  if((input == "*" || input == "/") && op){
    return;
  }
  if((input == "(" || input == ")") && 
  (last == "(" || last == ")")){
    return;
  }
  var span = document.createElement("span");
  span.setAttribute("id", "s"+nId);
  selected = "s"+nId;
  span.classList.add("text");
  var spans = $(".text");
  if(selectedId==spans.length-1){
    vText.append(span);
    var pos =
       span.getBoundingClientRect().right
    showSelector(pos);
    hideSelector();
  }else {
    var obj;
    if(selectedId == -1){
      obj = $("#"+spans[0].id);
    }else{
      obj = $("#"+spans[selectedId+1].id);
    }
    obj.before(span);
    var pos =
       span.getBoundingClientRect().right
    showSelector(pos);
    hideSelector();
  }
  selectedId++;
  selectSpan(span);
  
  $("#s"+nId).text(input);
  last = input;
  setOperator(last);
  nId++;
}
function selectSpan(span){
  span.onclick = () => {
    var obj = $("#"+span.id)[0];
    selectedId = $("#"+obj.id).index()-2;
    if(obj.id == "s-1"){
      selectedId = -1
    }
    last = $("#"+obj.id).text();
    setOperator(last);
    var pos = 
      obj.getBoundingClientRect().right;
    showSelector(pos);
    hideSelector();
  }
}
String.prototype.replaceAt = function(index, 
replacement) {
  return this.substr(0, index) + replacement 
  + this.substring(index+1, this.length);
}
function setRes(set=true, text){
  var rOp=null, rNum = null, res=null, temp="";
  if(set){
    text = getText();
    clearText();
  }
  
  text = brackets(text);
  text = specialOperator(text);
 
  for(var i=0; i<text.length; i++){
    var inp = text.charAt(i);
    switch(inp){
      case "-":
        if(rOp){
          rNum = resolveRes(rNum, 
            parseFloat(temp), rOp);
          rOp = inp;
          temp = "";
          break;
        }
        if(temp === ""){
          temp += inp;
        }else{
          rNum = parseFloat(temp);
          rOp = inp;
          temp = "";
        }
        break;
        
      case "+":
        if(rOp){
          rNum = resolveRes(rNum, 
            parseFloat(temp), rOp);
          rOp = inp;
          temp = "";
          break;
        }
        if(temp === ""){
          temp += inp;
        }else{
          rNum = parseFloat(temp);
          rOp = inp;
          temp = "";
        }
        break;
        
      default:
        temp += inp;
    }
    if(i+1 == text.length && rOp){
      res = resolveRes(rNum, 
        parseFloat(temp), rOp);
    }
  }
  if(res!=0 && !res){
    res = parseFloat(text);
  }
  if(set){
    setText(res.toString());
  }else{
    return res;
  }
  
}
function specialOperator(text){
  while(text.includes("*") || text.includes("/")){
    var sOp = "*";
    var index = text.indexOf(sOp);
    if(index<0){
      sOp = "/";
      index = text.indexOf(sOp);
    }
    var max = 0;
    var min = text.length;
    
    for(var i=0;i<4;i++){
      if(text.lastIndexOf(ops[i], index-1)>max){
        max = text.lastIndexOf(ops[i], index-1);
      }
      if(text.includes(ops[i]) && 
      text.indexOf(ops[i], index+1)>-1 &&
      text.indexOf(ops[i], index+1)<min){
        min = text.indexOf(ops[i], index+1);
      }
    }
    
    var str1 = text.substring(max, index);
    var str2 = text.substring(index+1, min);
    var str3 = text.substring(max, min);
    alert("str1:"+str1+", str2:"+str2+
      ", str3:"+str3);
    sNum = resolveRes(parseFloat(str1),
     parseFloat(str2), sOp);
    s = (sNum<0)? "" : "+";
    
    text = text.replace(str3, s+sNum);
  }
  return text;
}
function brackets (text){
  while(text.includes("(")){
    var index = text.indexOf("(");
    var index1 = text.indexOf(")");
    brckt1 = [index];
    brckt2 = [index1];
    b1 = 1;
    b2 = 1;
    while(text.indexOf("(", index+1)>-1){
      brckt1.push(text.indexOf("(", index+1));
      index = text.indexOf("(", index+1);
      b1++;
    }
    while(text.indexOf(")", index1+1)>-1){
      brckt2.push(text.indexOf(")", index1+1));
      index1 = text.indexOf(")", index1+1);
      b2++;
    }
    for(var i = 0; i<b2; i++){
      if(brckt1.length<2){break;}
      for(var j = b1-1; j>-1; j--){
        if(brckt1[j]<brckt2[i]){
          brckt1.splice(j, 1);
          brckt2.splice(i, 1);
          b1--;
          b2--;
          i--;
          break;
        }
      }
    }
    index = brckt1[0];
    var max = brckt2[0];
    var str1 = text.substring(index, max+1);
    var str2 = text.substring(index+1, max);
    //alert("b str1:"+str1+", str2:"+str2);
    var sNum = setRes(false, str2);
    //alert("bsn:"+sNum);
    var temp1 = text.charAt(index-1);
    var temp2 = text.charAt(max+1);
    var s1 = "";
    var s2 = "";
    if(temp1 != ""){
      if(ops.indexOf(temp1)<0 ||
      temp1 == ")" || temp1 == "("){
        s1="*"
      }else{
        var operators = {"+": "-", "-": "+"};
        var repS = operators[temp1];
        if(repS && sNum<0){
          sNum = Math.abs(sNum);
          text = text.replaceAt(index-1, repS);
        }
      }
    }
    if(temp2 && (ops.indexOf(temp2)<0 ||
      temp2 == ")" || temp2 == "(")){
      s2 = "*";
    }
    text = text.replace(str1, s1+sNum+s2);
  }
 // alert("bt:"+text);
  return text;
}
function resolveRes(n1, n2, rOp){
  switch (rOp){
    case "-":
      return n1-n2;
    case "+": 
      return n1+n2;
    case "*":
      return n1*n2;
    case "/":
      return n1/n2;
  }
}
function showSelector(pos){
  selector.css({
    left: pos-1.2,
    visibility: "visible"
  });
}
function hideSelector(){
  if(hideTime){
      clearTimeout(hideTime);
  }
  hideTime = setTimeout(() => {
    selector.css({
      visibility: "hidden"
    })
  }, 1000);
}
function setOperator(input){
  if(ops.indexOf(input)<0 || 
  input == "(" || input == ")"){
    input = null;
  }
  op = input;
}
function deleteSpan(){
  var spans = $(".text");
  if(spans.length<1 || selectedId<0){return;}
  $("#"+spans[selectedId].id).remove();
  selectedId--;
  if(spans.length<1){
    last = null;
    op = null;
    selector.css({
      visibility: "hidden"
    });
    return;
  }
  
  if(selectedId < 0){
    op = null;
    last = null;
    var obj = $(".first")[0];
    pos = obj.getBoundingClientRect().right
    showSelector(pos);
    hideSelector();
    return;
  }
  var obj = $("#"+spans[selectedId].id)[0];
  last = $("#"+obj.id).text();
  setOperator(last);
  
  pos = obj.getBoundingClientRect().right
  showSelector(pos);
  hideSelector();
  
}
function clearText(){
  op = null;
  last = null;
  var spans = $(".text");
  spans.remove();
  selector.css({
    visibility: "hidden"
  });
  selectedId = -1;
}
function getText(){
  var spans = $(".text");
  return spans.text();
}
function setText(n){
  nId = 0;
  for(var i=0;i<n.length;i++){
    var temp = document.createElement("span");
    temp.setAttribute("id", "s"+nId);
    temp.classList.add("text");
    vText.append(temp);
    selectSpan(temp);
    $("#s"+nId).text(n.charAt(i));
    nId++;
  }
  op = null;
  last = n.charAt(n.length-1);
  selectedId = n.length-1;
}
