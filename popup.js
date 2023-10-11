
document.addEventListener('DOMContentLoaded', () => {
    let btn = document.getElementById('btn');

    //login 여부 확인 check
    fetch('http://127.0.0.1:8000/proxy', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-CSRFToken': getCookie('csrftoken'),
      },
  })
  .then(response => response.json())
  .then(data => {
      if (data.authenticated=='True') {
          // 사용자가 로그인되어 있는 경우
          const username = data.username;
          console.log('login',username)
          alert(username+" is logged in:) ");
          // username을 사용하여 원하는 작업 수행
      } else {
          console.log("not login")
          //notLoginPopUp();
          alert("Not Login! login in helper site first !\n http://127.0.0.1:8000/ ");
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });

    // end check login 

    //html에 접근
    let helperBtn=document.getElementById('helperBtn');
    helperBtn.addEventListener('click',async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id,{message:'msg',tabId:tabs[0].id},
        function(response){
          alert('chatGpt Helper ON!');
          console.log(response);

        });

        

      });

    });
  });

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

// 현재 윈도우 화면에서 URL 정보를 얻어오는 함수
// function getTabUrl(callback) {
//   var queryInfo = {
//     active : true,
//     currentWindow : true
//   };

// chrome.tabs.query(queryInfo, function(tabs) {
//   var tab = tabs[0];
//   var url = tab.url;
//   return url;
// });
// }

function getTabUrl(){
  return new Promise(function(resolve,reject){
    var queryInfo = {
      active : true,
      currentWindow : true
    };
  
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    resolve(url);
  });

  });
};
  

//div에 url 띄우기
function renderUrl(urlText){
  document.getElementById("url").innerText=urlText;
  console.log(urlText);
}


function notLoginPopUp(){
  var popup = window.open('', '', 'width=400,height=200');
  popup.document.write('<html><head><title>알림</title></head><body>');
  popup.document.write('<p>Not Login! Login in helper site first! </p>');
  popup.document.write('<a href="http://127.0.0.1:8000/">http://127.0.0.1:8000/</a>');
  popup.document.write('</body></html>');
  popup.document.close();

}
