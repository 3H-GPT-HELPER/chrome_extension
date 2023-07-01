
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    console.log("message received");
        if(request.message==='msg'){
            var markdownDivs=document.querySelectorAll('.markdown');

            for (var i = 0; i < markdownDivs.length; i++) {
             
                var markdownDiv=markdownDivs[i];
                var button = document.createElement('button');
                button.textContent='check💫';
                
                
                button.style.backgroundColor='#5039E0';
                button.style.color='white';
                button.style.padding='10px';
                
                markdownDiv.appendChild(button);
                
                // 클로저 생성
                (function(md,index) {
                  // 이벤트 리스너 추가
                  button.addEventListener('click', function() {
                    var pTagContents = [];
                    var ptags = Array.from(md.querySelectorAll('p'));
              
                    ptags.forEach(function(p) {
                      pTagContents.push(p.textContent);
                    });
              
                    // index 값을 사용하여 버튼 식별
                    console.log('Button ' + (index + 1) + ' clicked!');
                    console.log(pTagContents);
              
         
                    // 우리사이트로 fetch 보내기
                    fetch('http://127.0.0.1:8000/proxy', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'X-CSRFToken': getCookie('csrftoken'),
                      },
                      body: JSON.stringify({
                        data: pTagContents,
                      }),
                    })
                      .then(response => response.json())
                      .then(data => {
                        alert('send to helper site!');
                        console.log(data);
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                  });
                })(markdownDiv,i); // 클로저에 인덱스 전달
              
                
              }

            sendResponse({req:markdownDiv});
            }
            return true;
            
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
      }


function getHtml(){
    return new Promise(function(resolve,reject){
        chrome.scripting.executeScript({
            //code:'document.querySelector(".markdown.prose.w-full").innerText'
            code:'document.querySelector("p").innerText'
        },function(result){

            console.log(result+"!!");
            resolve(result);
          }
    );
});
}
