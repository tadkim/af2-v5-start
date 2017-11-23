# Af2V5Start


#[l58 chatbot in angular with dialogFlow API.ai](https://angularfirebase.com/lessons/chatbot-in-angular-with-dialogflow-api-ai/)


- [Angular Chatbot sourcecode (github)](https://github.com/AngularFirebase/59-angular-chatbot-dialogflow)



여기에서는 [Dialogflow conversation platform](https://dialogflow.com/, 일반적으로 API.ai로 알려져있다)를 활용하여 챗봇을 구성해본다. 

[Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/)(NLP)는 머신러닝에서 가장 중요하게 다뤄지는 분야이다. 지난 십수년 동안, deep nural network 는 우리같은 일반 개발자들도 쉽게 접근가능하게 변화했다.

게다가 Angular는 한번의 클릭만으로 멀티 플랫폼을 지원하는 형태로 배포 할 수 있도록 개발자를 돕는다.


![dialogflow-angular-demo.gif](../../images/dialogflow-angular-demo.gif)



## 초기 셋업 가이드


### Scartch로부터 새로운 Angular App을 생성 한다.
> Angular v4.2 이상을 사용해줘야 새로운 AngularAnimation feature를 활용할 수 있다.

```
npm install -g @angular/cli
ng new chatbot
cd chatbot
```


### install Required Libraries

외부 의존성을 갖는 것은 오직 하나다. DialogFlow JavaScript SDK. 
> 작성자는 언젠가 직접 이것을 바꿔볼 것을 상상하고있다.

일단 이 [SDK official site](https://dialogflow.com/docs/sdks)에서 이 SDK를 얻는 방법을 찾아보도록 하자.


```
yarn add api-api-javascript -dev
```


### Fleshing out a Feature NgModule

우선 우리의 모든 코드를 [feature module](https://angular.io/guide/ngmodule#feature-modules)에 넣는다. 이것은 우리의 코드를 독립적이고, 지속가능한 형태로 구성해보는 좋은 연습과정이 될 것이다.


```
ng g module chat
ng g service chat -m chat
ng g component chat/chat-dialog -m chat
```

자 이제 `chat.module.ts`로 가보자. 여기에 추가할 것은 오직 `FormsMoudle`정도다. `FormsModule`을 `imports`에, 그리고 `ChatDialogComponent`를 `exports`에 넣자.



```ts
/// chat.modue.ts
import { NgModule }
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from './chat.service';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        ChatDialogComponent
    ],
    exports: [
        ChatDialogComponent
    ],
    providers: [
        ChatService
    ]
})
export ChatModule { }

```

그다음, `ChatModule`을 `AppModule`에 `import`해준다.

```ts
/// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

이렇게 우리는 독립적인 **feature module**을 생성했고, main app에서도 사용가능해졌다.

> 여기서는 별도의 라우팅 설정없이 다룬다.

```html
<!-- app.component.html -->
<chat-dialog></chat-dialog>
```

여기까지 했을 때의 결과화면은 다음과 같다.

![chat-initial-app](../../images/chat-initial-app.png)


## 기본적인 DialogFlow Agent 빌드하기

앞에서의 작업으로 아주 기본적인 angular app 세팅을 마쳤다고 보면되고, 여기부터는 dialogflow chatbot agent에 대한 구성을 해본다.

### Agent 생성

**Agent**는 **chatbot**의 container이다. 우리는 이 챗봇이 쉽게 해결할 수 있는 task를 줌으로써, 챗봇이 주어진 task를 성공적으로 완료할 수 있도록 한다. 작성자는 agent의 이름을 `AngularBot`이라고 붙였다.


### 의도(Intent) 만들기

**intent**란, 우리의 User가 달성하고자하는 어떤 것을 말한다.

아래에서 이 cylcle이 어떻게 동작하는 지 보여준다.

1. User는 "어떻게 해야합니까"라는 질문을 함으로써 intent를 불러낸(invoke)다.
2. Bot은 질문을 인식한다.
3. 사용자의 intent를 채우기 위해 다른 질문을 더 던지거나, 백엔드에서 이를위한 어떤 작업들을 수행한다.


자, 이제 그럼 **intent**를 생성해보자.

![chatbot-intent](../../images/chatbot-intent.png)


1. "What is a component?"라는 사용자의 표현을 추가한다. (이것은 사용자가 물어볼 것으로 예상되는 일반적인 질문의 예시다. 알고리즘을 최적화하기위해 여러 변형을 추가하자.)
2. text response 추가해준다. "it's just javascript"(이것은 봇이 사용자의 질문을 인식했을때 말할 내용이다)
3. 테스트해본다. "hey dude what's a component?"라고 물어보자(놀랍게도 봇은 이 질문을 인식하고 이에대한 답변을 그럴듯하게 해준다).

### Small Talk 생성하기

Small Talk pannel에서 일반적인 chit-chat 스타일 질문을 처리하도록 쉽게 프로그래밍 할 수 있다는 것을 강조하고싶다.


이것은 로봇에게 Siri나, Alexa와 같은 상호작용 수준을 부여한다. 청중에게 깊은 인상을 주는 재미있거나, 지능적인 반응을 주기 위해 프로그램 해보자.

![smalltalk-dialogflow](../../images/smalltalk-dialogflow.png)



> 여기까지 실행하려고 하다가, api를 firebase cloud function 에서 생성하기 위해  몇 가지 작업을 진행했다.



```
/// init
firebase init functions

/// add api key
firebase functions:config:set darksky.key="YOUR_DARKSKY_API_KEY"
// Please deploy your functions for the change to take effect by running firebase deploy --only functions

//이때 developer key를 등록해야하는지, client key를 등록해야하는지 모르겠지만 일단 clientkey를 등록해둔다.


/// Cors 설치 및 확인

우리는 **CORS**와 **Requestify**사용하여 NodeJS 환경에서 HTTP 요청을 단순화한다.

CORS는 API에 대한 호출이 출처에서만 이루어질 수 있도록 한다. **Requestify**는 NodejS HTTP 모듈을 보다 사용자 친화적으로만들어준다.
```

```
cd functions
yarn add cors requestify
```

> 여기까지 진행했는데,원래 튜토리얼에 내용이 있어서 다시 튜토리얼로 따라간다.



## Angular에서 Chatbot Agent를 사용하기

이제 우리는 기본적인 agent를 가지게 되었다. 여기서는 이 agent를 어떻게 angular안에서 사용하는지 살펴볼 것이다.



### API key를 Environment에 추가하기

DialogFlow의 메인페이지에서 Client access token을 복사 후, `environment`에 추가한다.


> DialogFlow API는 읽기 전용 액세스가 가능한 무료 서비스라서 font-end 앱에서 client token을 사용하는 것이 안전하다. 그러나 만약 유료 API를 사용하는 경우, token을 Angular로 노출해서는 안된다. 해커가 이를 가로채서 endpoint에 요청할 수 있다. 안전하게 token을 관리하려면 [Firebase Cloud Functions API Proxy Server lesson](https://angularfirebase.com/lessons/weather-app-with-the-angular-http-client-and-dark-sky-api/#Firebase-Cloud-Functions-Proxy-Server-to-Make-the-Request)을 확인하자.




## Chat Service

`ChatService`에서 Dialogflow로의 API 호출을 생성한다. 아래 중요 포인트들을 정리했다.

1. format message를 위한 `Message` class생성
2. 우리의 API token으로 Dialogflow(ApiAiClient)를 초기화하기
3. messages의 array인 `BehaviorSubject`를 정의하기
4. `converse` 메서드는 사용자 메시지를 array에 추가한 다음, API를 hit하고 동일한 array에서 봇의 응답을 업데이트한다. 


```ts
/// chat.service.ts


import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// message를 component에 display 하기위한 class.
export class Message {
    constructor(public agent: string, public sentBy: string){ }

}

@Injectable()
export class ChatService {
    readonly token = environment.dialogflow.angularBot;
    readonly client = new ApiAiClient({ accessToken: this.token });

    conversation = new BehaviorSubject<Message[]>([]);

    constructor() { }

    // DialogFlow를 통해 메시지를 주고 받기
    converse(msg: string){
        const userMessage = new Message(msg, 'user');
        this.update(userMessage);

        return this.client.textRequest(msg)
            .then(res => {
                const speech = res.result.fulfillment.speech;
                const botMessage = new Message(speech, 'bot');
                this.update(botMessage);
            });
    }
    // message를 source에 추가하기
    update(msg: Message){
        this.conversation.next([msg]);
    }
}
```


## Dialog
이제 message를 주고받을 사용자 인터페이스가 필요하다.


### `chat-dialog.compoennt.ts`

새로운 값을 추가할 수 있는 `Observable` array를 유지하기 위해, (작성자는) RxJS의 `scan` operator를 사용하고 있다.

service의 `BehaviorSubject`가 새 값을 보낼 때마다 이전 value와 연결(concatenated)된다.


```ts
/// chat-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit {
  messages: Observable<Message[]>;
  formValue: string;
  constructor(public chat: ChatService) { }
  ngOnInit() {
    // 각 새로운 message가 feedSource에 추가 된 후 array를 추가하기
    //appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );
  }
  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
  }
}
```

### `chat-dialog.component.html`

html에서는 message observable을 loop한다. 작성자의 경우, 각 message에 `ngClass`를 사용하여 챗봇이 보냈는지, 사용자가 보냈는지를 판단한 후, 결과에 따라 `to/from` class를 바인딩하고있다.

마지막으로, `ngModel`을 사용하여 enter key가 입력되었을 때 메시지가 보내지도록 설정했다.

```html
<!-- chat-dialog.component.html -->
<h1>Angular Bot</h1>
<ng-container *ngFor="let message of messages | async">
  <div class="message" [ngClass]="{ 'from': message.sentBy === 'bot',
                                    'to':   message.sentBy === 'user' }">
    {{ message.content }}
  </div>
</ng-container>
<label for="nameField">Your Message</label>
<input [(ngModel)]="formValue" (keyup.enter)="sendMessage()" type="text">
<button (click)="sendMessage()">Send</button>
```


### `chat-dialog.component.css`

작성자의 경우, 이 데모에서 기본적인 스타일을 적용하기위해 [Miligram CSS](http://milligram.io/) 프레임웍을 사용하고있다. (다른 걸 사용해도 상관 없지만) 로직에 집중하기 위해 시키는대로 cdn 코드를 `index.html`에 넣어준다.

```html
<!-- index.html -->
<!-- CSS Reset -->
<link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css">
  
  <!-- Milligram CSS minified -->
<link rel="stylesheet" href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css">
```

마지막으로 아이폰의 메시지 스타일처럼 보이도록 작성해둔 스타일 코드를 넣어준다.


```css
/* chat-dialog.componet.css */
.message {
    border-radius: 50px;
    margin: 0 15px 10px;
    padding: 15px 20px;
    position: relative;
    font-weight: bold;
}
.message.to {
    background-color: #2095FE;
    color: #fff;
    margin-left: 100px;
    text-align: right;
}
.message.from {
    background-color: #E5E4E9;
    color: #363636;
    margin-right: 100px;
}
.message.to + .message.to,
.message.from + .message.from {
margin-top: -10px;
}
```


## Next Step

기본적인 Angular chatbot app을 완성한 것을 축하한다. 이제 굉장히 다양한 형태나 방식으로 확장가능해졌다. DialogFlow를 활용하면 백엔드 코드를 트리거 할 수 있는(?) 훨씬 더 복잡한 intent-fullfillment cycle을 만들 수 있다.

