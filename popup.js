

// import axios from './node_modules/axios';
// import cheerio from './node_modules/cheerio';


document.addEventListener('DOMContentLoaded', () => {
    let btn = document.getElementById('btn');
    // chrome.storage.sync.get('color', ({ color }) => {
    //   btn.style.backgroundColor = color;
    // });

    function setPageBackgroundColor() {
      chrome.storage.sync.get('color', ({ color }) => {
        document.body.style.backgroundColor = color;
      });
    }
  
    //popup.js test(url 획득)
    // btn.addEventListener('click', async () => {
    //   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //   var url='';
    //   getTabUrl().then(function(url){
    //     console.log("~~"+url);
       
    //   });

    //   //btn color change
    //   //scripting은 현재 페이지의 js를 고칠때 사용!
    //   chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     function: setPageBackgroundColor,
    //   });
    // });

    //html에 접근
    let helperBtn=document.getElementById('helperBtn');
    helperBtn.addEventListener('click',async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id,{message:'msg',tabId:tabs[0].id},
        function(response){
          alert('chatGpt Helper ON!');
          console.log(response);
        
          
        }
        );

        

      });

    });
  });

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

