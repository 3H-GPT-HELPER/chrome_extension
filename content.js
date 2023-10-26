
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    console.log("message received");
        if(request.message==='msg'){
            var markdownDivs=document.querySelectorAll('.markdown');

            for (var i = 0; i < markdownDivs.length; i++) {

                //make check btn
                var markdownDiv=markdownDivs[i];
            
                //btn css
                var button = document.createElement('button');
                button.textContent='check💫';
                button.style.backgroundColor='#5039E0';
                button.style.color='white';
                button.style.padding='10px';
                button.style.borderRadius = '10px'
                button.style.transition = "background-color 0.3s";
                
                markdownDiv.appendChild(button);

                
                // 클로저 생성
                (function(md,index) {
                  // 이벤트 리스너 추가
                  button.addEventListener('click', function() {

                    this.style.backgroundColor = '#FF0072';

                    //question 추출
                
                    // markdownDiv의 최상위 div까지 올라감.
                    var topLevelDiv = md;
                    while (topLevelDiv && !topLevelDiv.classList.contains('group')) {
                      topLevelDiv = topLevelDiv.parentElement;
                    }
                  
                    // 최상위 div의 바로 앞에 있는 div에 접근
                    var previousDiv = topLevelDiv.previousElementSibling;
                    var questionText=""
                    
                    if (previousDiv && previousDiv.tagName === 'DIV') {
                      questionText=previousDiv.textContent;
                      console.log(questionText);
                    }

                    //smiliarity 용 답변만
                    var pTagContents = [];
                    var ptags = Array.from(md.querySelectorAll('p'));

                    ptags.forEach(function(p) {
                      pTagContents.push(p.textContent);
                    });

                    // 답변+code 통합본
                    var complexContents=[];
                      md.childNodes.forEach(function(childNode){
                        //단순 text
                        if(childNode.nodeName==='P'){
                          complexContents+=(childNode.textContent);
                          complexContents+='\n'
                        }
                        

                        //OL 태그
                        else if(childNode.nodeName==='OL'){
                         childNode.childNodes.forEach(function(node){
                            if(node.nodeName==='LI'){
                              var p=node.querySelector('p')
                              complexContents+=p.textContent;
                            }
                            
                          })
                          complexContents+='\n'

                    
                        }

                        //code
                        else if(childNode.querySelectorAll('PRE')){
                          var codeTexts='';
                          codeElements=Array.from(childNode.querySelectorAll('code[class*="whitespace-pre"]'));
                          codeElements.forEach(function(codeElement) {
                            codeElement.childNodes.forEach(function(childNode) {
                              codeTexts += childNode.textContent;
             
                            });

                        })

                        complexContents+=codeTexts;
                        
                      }

                    
                    })
              
                    // index 값을 사용하여 버튼 식별
                    console.log('Button ' + (index + 1) + ' clicked!');
                    
                    // 우리사이트로 fetch 보내기
                    fetch('http://127.0.0.1:8000/proxy', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'X-CSRFToken': getCookie('csrftoken'),
                      },
                      body: JSON.stringify({
                        pTagContents: pTagContents,
                        complexContents:complexContents,
                        questionText:questionText,
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
            code:'document.querySelector("p").innerText'
        },function(result){

            console.log(result+"!!");
            resolve(result);
          }
    );
});
}
