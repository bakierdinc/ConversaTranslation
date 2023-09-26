const azureSpeechKey = "992b09af84d241358773d8c7a4c635aa";
const azureRegion = "westeurope";


const speechConfig = new SpeechSDK.SpeechConfig.fromSubscription(azureSpeechKey, azureRegion);
const audioConfig = new SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
let recognizer;
let synthesizer;

const connection = new signalR.HubConnectionBuilder().withUrl("/conversation").build();

connection.on("ReceiveMessage", function (nick, text, culture) {
    console.log(`${nick} tarafından gelen mesaj ${culture}: ${text}`);

    if (connection.state === signalR.HubConnectionState.Disconnected) {

        connection.start()
            .then(() => {
                console.log("Connected to conversation");
            })
            .catch(error => {
                console.error("Connection Exception: ", error);
            });
    }

    let cookieAsString = getCookie("ConversaTranslation")
    let cookieObject = JSON.parse(cookieAsString);
    let myCulture = cookieObject.Language;

    if (nick === cookieObject.Nick) {
        console.log("aynı");
        console.log(myCulture);
        return;
    }

    connection.invoke("GetTranslatedText", myCulture, text, culture)
        .then(function (response) {

            synthesizer.speakTextAsync(response, result => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log("Metin başarıyla okundu.");
                } else {
                    console.error("Metin okuma hatası:", result.errorDetails);
                }
            });
        })
});


// UTILS

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for (const element of cookieArray) {
        let cookie = element;
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

// UTILS


//LOGIN
function login() {

    let cookie = getCookie("ConversaTranslation");
    if (!cookie) {

        $("#login").hide();
        $("#conversaTranslation").show();

        connection.start()
            .then(() => {
                console.log("Connected to conversation");
            })
            .catch(error => {
                console.error("Connection Exception: ", error);
            });
    }

    let nick = document.getElementById("nick").value
    let language = document.getElementById("language").value;

    if (!nick) {
        alert("Lütfen nick giriniz...");
    }

    if (!language) {
        alert("Lütfen dil seçiniz...")
    }

    let cookieName = "ConversaTranslation";
    let cookieObject = {
        Nick: nick,
        Language: language
    };

    speechConfig.speechRecognitionLanguage = language;
    speechConfig.speechSynthesisLanguage = language;
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    setCookie(cookieName, JSON.stringify(cookieObject), 30)

    $("#login").hide();
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

let isMicOpen = false;

function openOrCloseMic() {

    isMicOpen = true;

    let cookieAsString = getCookie("ConversaTranslation")
    let cookieObject = JSON.parse(cookieAsString);
    const nick = cookieObject.Nick;
    const language = cookieObject.Language;

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

        connection.invoke("SendMessage", nick, result.text, language)
            .catch(function (err) {
                return console.error(err.toString());
            });
    });
}

// ConversaTranslation























