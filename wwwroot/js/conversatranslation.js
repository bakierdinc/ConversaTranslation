const azureSpeechKey = "992b09af84d241358773d8c7a4c635aa";
const azureRegion = "westeurope";


const speechConfig = new SpeechSDK.SpeechConfig.fromSubscription(azureSpeechKey, azureRegion);
const audioConfig = new SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
let recognizer;
let synthesizer;

const connection = new signalR.HubConnectionBuilder().withUrl("/conversation").build();

let nickname;
let language;

connection.on("ReceiveMessage", function (senderNickname, text, senderLanguage) {

    if (connection.state === signalR.HubConnectionState.Disconnected) {

        connection.start()
            .then(() => {
                console.log("Connected to conversation");
            })
            .catch(error => {
                console.error("Connection Exception: ", error);
            });
    }


    connection.invoke("GetTranslatedText", language, text, senderLanguage)
        .then(function (response) {

            const chatAreaMessages = document.getElementById("chatAreaMessages");
            const li = document.createElement("li");

            let speak = false;
            let sender = senderNickname;
            let message = text;
            if (sender === nickname) {
                sender = `Me`;
            }
            else {
                message = response;
                speak = true;
            }

            li.textContent = `${sender}: ${message}`;
            chatAreaMessages.appendChild(li);

            if (speak) {
                synthesizer.speakTextAsync(response, result => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        console.log("The text was successfully read.");
                    } else {
                        console.error("Text reading error:", result.errorDetails);
                    }
                });
            }
        })
});


//LOGIN
function join() {

    nickname = document.getElementById("nickname").value
    language = document.getElementById("language").value;

    if (!nickname) {
        alert("Please enter a nickname...");
    }

    if (!language) {
        alert("Please select a language...")
    }

    speechConfig.speechRecognitionLanguage = language
    speechConfig.speechSynthesisLanguage = language;

    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    $("#join").hide();
    $("#conversaTranslation").show();

    connection.start()
        .then(() => {
            console.log("Connected to conversation");
        })
        .catch(error => {
            console.error("Connection Exception: ", error);
        });
}

//LOGIN


// ConversaTranslation
function speak() {

    if (connection.state === signalR.HubConnectionState.Disconnected) {

        connection.start()
            .then(() => {
                console.log("Connected to conversation");
            })
            .catch(error => {
                console.error("Connection Exception: ", error);
            });
    }

    recognizer.recognizeOnceAsync(result => {

        if (!result && !result.text) {
            alert("No sound received...")
            return;
        }

        connection.invoke("SendMessage", nickname, result.text, language)
            .catch(function (err) {
                return console.error(err.toString());
            });
    });
}

// ConversaTranslation























