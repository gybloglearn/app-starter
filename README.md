# ticket (app-starter BRANCH)
GE - Oroszlány app starter (wo components from iidx)

[![Build Status](https://travis-ci.org/gybloglearn/app-starter.svg?branch=master)](https://travis-ci.org/gybloglearn/app-starter)

<b>Használat:</b><br>
Legyen:<br>
1. <i>xampp</i> vagy <i>wamp</i> telepítve, <br>
2. <i>Visual Studio Code</i>,  a gépen és legyen elérhető a <code>code</code> parancs a cli-ben.

<code>
cmd.exe
</code>

El kell indítani a fejlesztői szervert (xampp, wamp)<br>
Be kell "menni" abba a mappába, ahonnan a fejlesztői szerver kiszolgálja az adatokat (pl: xampp/htdocs, vagy wamp/www)

<code>
$> git clone https://github.com/gybloglearn/app-starter.git <b>[<i>projektNév</i>]</b>
</code>

<code>
$> cd <b>[<i>projektNév</i>]</b>
</code>

<code>
$> git checkout -b <b>[<i>projektNév</i>]</b>
</code>

<code>
$> npm install<br>
</code>

<code>
$> gulp run<br>
</code>

<br>
Módosítsd a programot és utána töltsd fel a <b>projektNév</b> <i>branch</i>-be:<br>

<code>
$>  git push origin <b>[<i>projektNév</i>]</b>
</code>
<br>

<b>Új "route" hozzáadása </b><br>
A route --add hozzáadja a components mappához a [routeNév] mappát és abban a megfelelő fileokat (routeNév.html és routeNév.ctrl.js). A config.js, a module.js és az index.html file-okat frissíti. Az index.html file-ban csak a fő menüsorba teszi be az új adatot.


<code>gulp route --add <b><i>routeNév</i></b></code>

<b>Új "service" hozzáadása </b><br>
A service --add hozzáadja a components/services mappához a megfelelő filet - serviceNév.service.js). A module.js filet frissíti.


<code>gulp service --add <b><i>serciceNév</i>://<i>(url-http-nélkül)</i></b></code>
