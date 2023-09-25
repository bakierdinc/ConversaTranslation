//Browser Utils

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

//


function login() {
    var nick = document.getElementById("nick").value
    var language = document.getElementById("language").value;

    if (!nick) {
        alert("Lütfen nick giriniz...");
    }

    if (!language) {
        alert("Lütfen dil seçiniz...")
    }

    var cookieName = nick.concat(language);
    var cookieObject = {
        Nick: nick,
        Language: language
    };

    setCookie(cookieName, cookieObject, 30)

    $("#login").hide();
    $("#conversaTranslation").show();
}