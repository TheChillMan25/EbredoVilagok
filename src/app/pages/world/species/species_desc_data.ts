const folyokoz: SpeciesInterface[] = [
  {
    id: 'folyokoz',
    name: 'Folyóköziek',
    desc: 'A változás korában is halálukig ragaszkodnak önmagukhoz. A folyóköziek talán a legjobban fennmaradt emlékei annak hogy őseink hogyan néztek ki az áradás előtt. Az elmúlt évszázadok megpróbáltatásai ellenére megvédték a földjeiket a szörnyek és ellenséges népek áradatától. Hadseregek törtek ketté a határváraik falán amik még a királyság szétesését is átvészelték. Megőrizték az ősi hagyományaikat és történeteiket, ezzel együtt az azokból kiszökő, valósággá vált rémálmokat és egy ezredév tanulságait. A legtöbb hajszín és szemszín megtalálható köztük, az egyetlen meghatározó különbség a többi néphez képest a nagy vállszéleségük és a mellkasukban felváltva dobogó tükrözött ikerszívek. A viseletükben meghatározóak a piros, fehér és zöld színek.',
    img: 'folyokoz/folyokoz.webp',
    speciesSpecial: [
      {
        desc: 'Az iker szíveid elviselhetetlen stressz alatt is kitartanak, harcban az ellenfelek stressz sebzése ellen kapsz 1 védelmet.',
      },
      {
        desc: 'Régi mesekönyvek és krónikák között nőttél fel, emiatt a Folyóközt betöltő tájak és népek bizalmasságot ébresztenek benned, amíg a Folyóközben tartózkodsz a felismerés próbáid előnyt kapnak.',
      },
      {
        desc: 'Egy másik nép pár tagja megtelepedett az otthonodban és megtanultad a szokásaikat, válassz egy népet amihez +3 ismeretet kapsz.',
      },
      {
        desc: 'Kaptál egy levelet, ami szerint megörököltél egy lepukkant épületet az otthonod területén. dobj az épület fajtára és kétszer a károkra.',
      },
      {
        desc: 'Megtanultad hogy kell megélni a természetből, sima állatok boncolásánál, ha egyedül csinálod az előkészítést és a boncolást is nem kapsz hátrányt.',
      },
      {
        desc: 'Örökölted a felmenőid akaratát, az akaraterő próbákra előnyt kapsz az elbájolással és egyéb elme irányító hatásokkal szemben.',
      },
    ],
    homes: [
      {
        desc: 'A határvárak mozdíthatatlan árnyékában nőttél fel, nappal a pezsgő piacokat jártad és segítettél a kisebb javításokban. Éjjelente az erőspincékben, a vár legmélyebb és biztonságosabb zugaiban rejtettek el amíg kint felismerhetetlen üvöltések kergették ki az álmot a szemedből.',
        bonus: [
          { name: 'Barkácsolás', mod: '+1' },
          { name: 'Választott nyelv', mod: '+1' },
        ],
      },
      {
        desc: 'Nyugati folyóvég dombságai vezették minden lépted, figyelted ahogy kereskedők és gépszörnyek bukkannak fel és tűnnek el újra a dombok közt. A hegyeken átszökő vízesések feltöltötték tavakkal és folyókkal a tájat az áradó évszakban, te pedig átcsónakáztál a gyümölcsfákhoz, hátha látsz tündéreket a víz tükrében.',
        bonus: [
          { name: 'Növény ismeret', mod: '+1' },
          { name: 'Megfigyelés', mod: '+1' },
        ],
      },
      {
        desc: 'Keleti folyóvég hegyalja nem olyan idilli mint más terület, de amikor minden áradás kezdetén egy tüzes fényoszlop feltör az égbe a keleti horizont magjában, otthon érzed magad. Jöjjenek busók áradata vagy emberbőrbe bújt rémek, a keleti határ őrei vagytok.',
        bonus: [
          { name: 'Mászás', mod: '+1' },
          { name: 'Lény felismerés', mod: '+1' },
        ],
      },
      {
        desc: 'Folyóközi aranypuszta lehet unalmas másnak, nincsenek magasztos hegyek vagy eget szúró épületek, de a régi csaták emlékei közt, amikor végeztek az aratással és körbenézel a végtelen pusztán, az olyan érzés mintha az egész világot látnád egyszerre.',
        bonus: [
          { name: 'Gyűjtögetés', mod: '+1' },
          { name: 'Növény ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A főváros romjai közt ősi iratokat és relikviákat gyűjtöttél gyerekként. Ismerős, mégis idegen szövegek és freskók között játszottál, a várost ketté szelő szakadék felett köteleken meg deszka hídokon rohangáltál a többi gyerekkel, majd naplemente előtt visszamentetek a táborba, a fa bástyák és megerősített romok közé, mielőtt a szakadék lakói magukkal rabolnak.',
        bonus: [
          { name: 'Ősi nyelvek', mod: '+1' },
          { name: 'Tárgy felismerés', mod: '+1' },
        ],
      },
      {
        desc: 'Egy erdős faluban születtél, rejtve a világtól. Lassan cseperegtek a szomszéd tájak hírei, de ezzel együtt azoknak a borzalmai se találtak meg titeket — legalábbis legtöbb esetben.',
        bonus: [
          { name: 'Gyűjtögetés', mod: '+1' },
          { name: 'Eszköz készítés', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'magasfold',
    name: 'Magasföldiek',
    desc: 'A folyóköziek legközelebbi rokonai, a magasföldiek, mint ahogy a nevük is elárulja, a Folyóközt körülvevő hegységek őrzői, főleg az északi tájékon elterülő lépcsős felvidékeken jellemzőek. Kinézetre sokkal robusztusabbak és szőrösebbek mint alvidéki testvéreik. Sok férfi meghaladja a 3 méteres magasságot is. Lehet hogy soványabbak mint az alföldi testvéreik de a meghosszabbodott karjaikkal képesek elképesztő erőt kifejteni. Kiváló fafaragók és vadászok, egy történet szerint egy magasföldi lefejezett egy medvét a fejszéjével az erdő másik végéből egy fogadás miatt. A kifogásolhatatlan erejük ellenére nyugodt természetű nép hírében vannak, kikezdhetetlen türelemmel rendelkeznek és szeretik a kalandoktól mentes, lassú folyású életük. Ha viszont valami megzavarja ezt a lassú folyást, ezrével zúdulnak le a hegyvidékekből baltával a kézben, egy-egy lépéssel több métereket átugorva. A hajszínük és szőrzetük alapból vöröses, de a színe enyhén változik az évszakokkal hogy jobban beolvadjanak a lombozatba. A ruházatuk főleg szőrmékből és kemény bőrvértekből áll, pár vadászon akár egész medveprémek vagy igazán ritka esetekben busóprémet is lehet látni és kizárólag fekete, vastag szövésű ingeket hordanak, soha sem fehéret.',
    img: 'folyokoz/magafol.webp',
    speciesSpecial: [
      {
        desc: 'A kezedben bármilyen közelharci fegyver felér egy puskalövéssel, a közelharci fegyvereket kétszer olyan messzire tudod elhajítani és nem csökken a sebzésük.',
      },
      {
        desc: 'A környezetben töltött évek miatt képes vagy erőfeszítés nélkül beolvadni, természetben minden rejtőzés próbádra előnyt kapsz.',
      },
      {
        desc: 'A fa és növények megmunkálása a véredben van, pihenésnél amíg van egy késed vagy szerszámaid addig fafaragással tudod csökkenteni a stresszed és tudsz 1 fa eszközt csinálni.',
      },
      {
        desc: 'A hegyoldalak köves ösvényei megedzettek, a terep és időjárás hatásai nem hatnak rád.',
      },
      {
        desc: 'Tudod a dolgod a különböző növények, füvek és mohák közt, a növények felismerésére előnyt kapsz.',
      },
      {
        desc: 'A nagy termeted miatt nagyobb utat tudsz megtenni mint más népek, kétszer annyit tudsz mozogni egy mozgás akció alatt.',
      },
    ],
    homes: [
      {
        desc: 'A Tiltott rengeteg határőrei között nevelkedtél, ez azt jelentette hogy fel kellett ismerned a csend fajtáit. Melyik csend jelentett egy békés estét, és melyik leplezte egy ragadozó tekintetét.',
        bonus: [
          { name: 'Megfigyelés', mod: '+1' },
          { name: 'Démon ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Borostyán erdő, a magasföldiek legsűrűbben lakott területén a vörös és barna levelek egész évben hullanak a borostyánnal borított fákról és egy folytonos, egyes helyeken egy méter magas avart képez.',
        bonus: [
          { name: 'Rejtőzés', mod: '+1' },
          { name: 'Fafaragás', mod: '+1' },
        ],
      },
      {
        desc: 'A Felföldekről van a legjobb kilátás a Folyóköz egész területére. A felhők átsiklanak az égi síkságokon és beharmatozzák a bokrokat és fűszálakat. Ilyen magasan még az áradás is csak egy múló látképi változás.',
        bonus: [
          { name: 'Állat tartás', mod: '+1' },
          { name: 'Táj ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Kopár bércek az északi hegyek legmagasabb pontja. Az itteni emberek viszonozzák a természet zordságát és megtesznek mindent a túlélésért. A lentebb élő rokonaiddal ellentétben te nem a békés mindennapok tengetését látod magad előtt hanem egy küzdelmet az elemekkel és a hegyek másik oldalán rejlő veszélyekkel.',
        bonus: [
          { name: 'Gyűjtögetés', mod: '+1' },
          { name: 'Vadászat', mod: '+1' },
        ],
      },
      {
        desc: 'A Tündérkapuk vigyázása volt a családod feladata generációk óta, ősi sírkapuk rajta egész klánok történetével. Az erre vonuló háborúk szeretettel próbálják lerombolni ezeket az emlékeket, ha egyáltalán sikerül megtalálniuk.',
        bonus: [
          { name: 'Fafaragás', mod: '+1' },
          { name: 'Történelem: Magasföldiek', mod: '+1' },
        ],
      },
      {
        desc: 'A Mélyárkok mellett születtél, nézted ahogy ezeket a feneketlennek tűnő, hegybe vágó szakadékokat az áradás tavakkal és folyókkal tölti fel. Már fiatalon csatlakoztál bányászok és kincsvadászokhoz akik alámerültek a hegyek szívébe az oda mosott ősi romok és feltépett érc nyomában.',
        bonus: [
          { name: 'Ősi nyelvek', mod: '+1' },
          { name: 'Mászás', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'holtagiak',
    name: 'Holtágiak',
    desc: 'A fővárost körül ölelő tónak a déli elfolyásából lápok és mocsarak labirintusa született. Ennek a végtelen mocsárnak a lakóit könnyű összetéveszteni a területet lakó varázslatos lények egyikével, de ne tévesszen meg a korom fekete szemük. A három Folyóközben őshonos népből ők a legkülönlegesebb kinézetűek; a bőrük zöldes, a hajuk pedig fekete vagy sötétbarna és teljesen víz lepergető. Természetüknél fogva maguknak való, idegenkerülő népség de a kíváncsiságuk sokszor még is kicsalogatja őket a lápok mélyéről. Nagyon erős lábaik vannak amikkel képesek nádszigetek vagy fák között is ugrálni és még a sűrű lápban is könnyedén úsznak. Bár kevés híres harcossal vagy kalandorral büszkélkedhetnek, a mágiához való természet adta tehetségük vitathatatlan. A lápokban található mérgező anyagok miatt a torkukban védőréteg alakult ki a savak ellen és a gyomruk képes a leghalálosabb mérgeket is feldolgozni, ezen kívül egy gyakorta kihasznált mellékhatása a részegség érzete a mérgek fogyasztása után. A ruházatuk alsó rétegei hozzá simulnak a testükhöz úszóruhához hasonlóan, amíg a külső rétegeket fagyöngyökkel és más vízen úszó vagy üreges ékszerekkel díszítik.',
    img: 'folyokoz/holtag.webp',
    speciesSpecial: [
      {
        desc: 'Könnyedén szökkensz át a nádszigetek között az erős lábaid miatt, ugrás próbákra előnyt kapsz és kétszer olyan messzire vagy képes elugrani.',
      },
      {
        desc: 'A tested hozzászokott a sűrű, mocsaras vízhez, a folyami víz neked olyan mintha felhőkben úsznál. Úszásnál minden víz típust kezelj tiszta folyami vízként.',
      },
      {
        desc: 'A mérgek számodra inkább ínyencségek mint halálos fegyverek a szádon át elfogyasztott mérgeknek nincs hatása, cserébe kapsz 1 részegséget.',
      },
      {
        desc: 'A mocsár mágiája olyan neked mint a levegő amit beszívsz. Megtanulod ezt a pecsétszót: víz',
      },
      {
        desc: 'Ha valakit egész életében körülvesz a víz elég nehéz elkerülni hogy ne legyél jó horgász, víz mellett táborozásnál vagy sima horgászás próbánál előnyt kapsz.',
      },
      {
        desc: 'Tündértestvérek, az ősi nyelveken így hívják a népedet és úgy tartották a mocsári tündérek leszármazottjai vagytok, bár ennek az igazságát nem tudjuk de az biztos hogy kevésbé utálnak titeket, a tündérek kezdésnek legalább neutrálisak feléd.',
      },
    ],
    homes: [
      {
        desc: 'Vadláp, a Holtág és Folyóköz határán elterülő kopár vízterület az otthonod. A több méteresre megnövő nád és a víz alatt lapuló bestiák mellett soha sem unatkoztál, a falud kötelekkel összekötött nádszigetei biztonságot nyújtottak a hűvös éjszakákon és forró nyarakon.',
        bonus: [
          { name: 'Rejtőzés', mod: '+1' },
          { name: 'Lény felismerés', mod: '+1' },
        ],
      },
      {
        desc: 'Ágszél, a Vadláp és a belső mocsarak közötti erdős szigetek csoportosulása és egyben a legtöbb holtági település otthona. Kis folyamok és fűzfák árnyékában nevelkedtél, messze a terület zordabb részeitől. Itt néha még a kereskedők is megfordultak akik egzotikus kinézetű növényekért elég busásan fizettek.',
        bonus: [
          { name: 'Növény ismeret', mod: '+1' },
          { name: 'Kereskedés', mod: '+1' },
        ],
      },
      {
        desc: 'Boszorkány- vagy lábas- kunyhók, a fővároshoz vezető főúttól távol kisebb faluk és tanyák csoportosulása. Egy boszorkány gyülekezet befogadott fiatal korodban és közhiedelemmel ellentétben ahelyett hogy megettek volna megtanították a mágiájuk egy részét neked. A faléceken egyensúlyozó kúriában mindig akadt munka egy fiatalnak.',
        bonus: [
          { name: 'Mágia használat', mod: '+1' },
          { name: 'Egyensúlyozás', mod: '+1' },
        ],
      },
      {
        desc: 'A holtágiak nagyvárosában nőttél fel, egy ősi erődítmény ami kiemelkedik a mocsárból és több méteres sáncok egész hálója veszi körül melyekbe házak és piacok sorát ásták. Az eredeti nevét elmosta az idő, de a falakat és sáncokat körül ölelő tövises bozótok miatt ti úgy ismeritek hogy Tüskevár.',
        bonus: [
          { name: 'Közösség', mod: '+1' },
          { name: 'Mérnöki munka', mod: '+1' },
        ],
      },
      {
        desc: 'Mélyvíznek nevezik a holtág hegyek felőli részét ahol vizes időszakban felgyülemlik a hegyekből áradó folyások és tengereket meghazuttoló víztömegeket hoznak létre. Tökéletes hely szörnyvadászatra, annál kevésbé gyereknevelésre. Megtanultad melyik bestia halálos, értelmes vagy ehető. A hatalmas lények leterítése pedig nem olyan embert próbáló, ha tudod melyik mérget kell használni.',
        bonus: [
          { name: 'Vadászat', mod: '+1' },
          { name: 'Mérgek ismerete', mod: '+1' },
        ],
      },
      {
        desc: 'A Tündérmocsár szélén nevelkedtél, amióta tudtál a szóból megparancsolták neked hogy soha ne merészkedj a határnál beljebb, mert tündérek elrabolnak. Még is ahogy teltek az évek egyre jobban érezted az onnan áradó mágia húzását és a vágyaz az ismeretlen megismerésére.',
        bonus: [
          { name: 'Mágia érzékelés', mod: '+1' },
          { name: 'Tündér ismeret', mod: '+1' },
        ],
      },
    ],
  },
];

const toronyvarosok: SpeciesInterface[] = [
  {
    id: 'den_karadenn',
    name: 'Den Karadenn',
    desc: 'A Nyugat vasökle, a feketét vérző város. Az északi hegységekben található kifogyhatatlan fém és ikor lelőhelyek az ipar igazi felhőkbe tornyosodó óriásává tette ezt a kis népet. A toronyból folyamatosan folyik a használt, fekete ikor és egész mocsarakat alkotott a ragyogást vesztett folyadék. A földterület szűkösségét terraformáló gépekkel, a kevés harcra képes kezet pedig sokszorosan kiegyensúlyozzák pusztító fegyverekkel. Az automa fajt is karadenni származásúnak tartják, hiszen a gépóriások első nemzedéke is innen származik. Kinézetre soványak, akár alul tápláltnak is tűnhetnek, az ikor első felfedezőiként a testük már most mutatja az anyag túlzott használatának a jeleit. A végtagjaik befeketedett, mintha folyékony koromba merítették volna azokat. A hajuk vörös mint a tűz és a hajszálak lebegnek a szélben mint lángnyelvek a szabad ég alatt, ezt sokan a boszorkányok és a túlzott mágia használatának jele, a mágia „kiégése" a testből. Szürkés bőrük beolvad a városuk szerkezetébe és kőfalaiba, az izomzatuk kétszer olyan sűrű mint bármelyik másik fajnak ami a könnyű szerkezetükkel párosítva tökéletes mászókká teszi őket. A kultúrájuk több forradalom után elszakadt az ősi szokásoktól melyeknek csak a lenyomatai maradtak meg a mindennapjaik árnyékában. Ilyen a zászlóikon látható óriásnak a köröm nélküli keze két hüvelykujjal a bal és jobb oldalt, az ujjakon a karadenni pillérek 6 címerével. A ruhákat és épületeket geometriai formákkal és ismétlődő mintákkal díszítik. Ahogy minden fogaskeréknek meg van a maga feladata, úgy a mintáknak is. Minden ismétlés, minden szimbólum és összekötés egy komplex egyenlet kis része amiben nincs helye a vad szépségnek.',
    img: 'toronyvarosok/dennkaraden.webp',
    speciesSpecial: [
      {
        desc: 'A várost alkotó óriások örökségéből pár dolog túlélte a forradalmak lángjait. Képes vagy a forró vasat akár puszta kézzel megmunkálni. Az égő tárgyak fogásától nem sebződnek a kezeid.',
      },
      {
        desc: 'A sűrű izomzatod miatt képes vagy elképesztő teherbírásra ami sokszor meglepi a társaidat, kettővel több tárgyat tudsz elrakni a tárhelyedbe és immunis vagy a túlterhelésre.',
      },
      {
        desc: 'A szervezeted hozzászokott az aranyvér hátrányaihoz, az ikor fogyasztása nem jár negatív hatásokkal, viszont kétszer olyan könnyen alakul ki ikor függőséged.',
      },
      {
        desc: 'A kőfalak és acélszerkezetek között nőttél fel, a magasba történő mászás a mindennapok része. Mászás próbákra előnyt kapsz mesterséges szerkezeteknél.',
      },
      {
        desc: 'A geometriai minták és jelek nyelvét már gyermekkorodban elsajátítottad. Bonyolult mechanizmusok és szerkezetek megértésére előnyt kapsz.',
      },
      {
        desc: 'Otthon érzed magad a gépek és a mesterséges dolgok között. Egy gép megjavítása után kapsz +1 ismeretet a gép fajtája szerint.',
      },
    ],
    homes: [
      {
        desc: 'A Fellegvár, vagy a magaspillériek családjából származol, a kezeid lehet hogy soha nem tapasztalták a gyárnegyed gépeinek a mocskát, de már fiatalon megtanították neked hogy egy tiszta kéz nem feltétlen ártatlan. Arany mosolyú kereskedők és éles szemű diplomaták vettek körül egész életedben, akik ugyanúgy néztek rád egy ünnepség során mint amikor kidobtak fellegvárból.',
        bonus: [
          { name: 'Diplomácia', mod: '+1' },
          { name: 'Kereskedés', mod: '+1' },
        ],
      },
      {
        desc: 'Gyárnegyedi gyerekként nem sok jövőt jósoltak meg neked, a tökéletességért való küzdelemben pár baleset, egy felrobbant kohó, egy beszakadt plafon, egy kifolyt vegyszeres hordó, mind csak járulékos veszteség. Te viszont túlélted, túl ott ahol sok barátod és családtagod nem, és kész vagy megmutatni hogy miért ti vagytok a város alappillére.',
        bonus: [
          { name: 'Mérnöki munka', mod: '+1' },
          { name: 'Túlélés', mod: '+1' },
        ],
      },
      {
        desc: 'Az Ikor árkok egy élhetetlen és mérgező mocsár a város alatt amit még az áradás sem bír elmosni. a legalsó pillér tagjaként, más nevén az elfelejtett pillér, egykoron a gazdákat és földműveseket jelentette, akik nélkül a város éhen halt volna. A föld viszont azóta feketévé vált és nem terem benne semmi természetes. A természet viszont mindig alkalmazkodik, és mielőtt útra keltél észrevetted hogy új fák, növények és gombák törnek ki a fekete földból, az égbolt színeit visszahozva a használt ikorba.',
        bonus: [
          { name: 'Növény ismeret', mod: '+1' },
          { name: 'Gyűjtögetés', mod: '+1' },
        ],
      },
      {
        desc: 'Az Akadémia, a fellegvár és a gyárnegyed között kialakított, elzárt városrész a saját maga városa is lehetne annyira különbözik a környező épületektől. Mágus tanoncok és régi mesterek egyaránt járják a fedett utcákat, felirat nélküli füves boltok és antikváriumok várják a kíváncsi szemeket, az akadémia épületébe viszont csak meghívással van bármi esélyed bejutni. Legyél fiatal tanonc vagy csak bolti segítő, valami rejtettnek vagy a része.',
        bonus: [
          { name: 'Mágia használat', mod: '+1' },
          { name: 'Történelem', mod: '+1' },
        ],
      },
      {
        desc: 'Den Armen, az erődtorony, csőfordításban a vaspillér. Ezt az előörst a második toronyháborúk után húzták fel a várostól délre, az ország alsó határán. Az acél út megépülése óta inkább kereskedelmi csomópont a két város között mint háborút váró erődítmény, de a mai napig jönnek új fegyverek és páncélok. Az itt lakó emberek egyszerre vámőrök és katonák, az illegális árucikkek és az ország ellenségei ellen egyaránt szolgálatot tesznek. Den Arment katonákon kívül a vonatot javító mérnökök, kereskedők és csempészek is bőséggel lakják, egymást kölcsönös megsegítése mellett természetesen.',
        bonus: [
          { name: 'Fegyverhasználat', mod: '+1' },
          { name: 'Jog/ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'Az Acél Út; a Keleti Tájékot, Folyóközt és a Nyugati toronyvárosokat összekötő vasútvonal. Egy robajló erőd, a mozdony oldalán két kapaszkodó gépóriással. Ha a vonatot valami veszélyezteti és behúzzák a vészgőzt, a kályha szenét kristályosodott ikorra váltják. Ilyenkor az egész vonat felemelkedik a sínekről és felgyorsul. A szunnyadó gépóriások életre kelnek és úgy kormányozzák az egész mozdonyt mintha egy bika két szarvát csavarnád balra vagy jobbra. Az utazó nemesektől a vonatot és a síneket karbantartó munkásokig minden embertípus megjelenik a mozdonyokon. Velük együtt te is hozzászoktál az ilyen „késésekhez" hiszen az életed jó részét ezen a vonaton töltötted. Azért „késés" mert az állomáson már tudják ha a vonat a vártnál előbb jön, valami baj történt út közben.',
        bonus: [
          { name: 'Mérnöki munka', mod: '+1' },
          { name: 'Közösség', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'chameren',
    name: "Cha'Me'Rén",
    desc: "Más nevén a Szigethegyek, A fővárosnak otthont adó központi hegy és a körülötte megtelepedő faragott csúcsok együttes neve. A hegyek belsejében díszes csarnokokat vájtak ki amiket az évszázadok alatt feltöltöttek krónikákkal és hősi halottakkal. A területre jellemző meggyengült gravitációnak köszönhetően lehetetlennek tűnő épületek és természetes képződmények tűzdelik a területet, ilyenek a szigethegyek spirálos kövei amik esőzéskor elterelik a vizeket. A terület szépsége ellenére manapság átkozás és szitokszó ha valakit kamérnak neveznek, hiszen a népük egyet jelent a kétszínűséggel és megbízhatatlansággal. Alakváltók, arccserélők hírében vannak bármerre is járjanak. Ezek a vádak persze nem alaptalanok, hiszen képesek megváltoztatni az egész kinézetüket a testalaktól a legkisebb anyajegyig. Az erősebb mágiájú kamérok képesek akár más állatok alakját is felvenni. Csecsemőkoruktól kezdve az arcuk folytonos akár pillanatról pillanatra történő drasztikus változásokon megy keresztül ami a serdülőkor végéig tart. Ezt az „arcuk megtalálásának” nevezik. Mivel az alakváltásuk érzelmi alapú, emiatt nagyban függ a mentális állapotuktól hogy milyen könnyen tudják befolyásolni a kinézetüket. Ha az arc amit viselnek nem egyezik a belső személyiségükkel csak lényeges erőfeszítések mellett tudják fenntartani azt. Mivel a kinézetük folyamatosan változik ezért a ruháikon és a maszkjaikon keresztül fejezik ki magukat. A ruháik a különböző kasztoktól függően lehetnek teljesen egyszínű és mintátlan köpönyegek vagy szinte már cirkuszinak tűnően díszítettek és túlzottak. A maszkok viszont mindig megegyeznek változataikban. A szürke mae'sk ahonnan a maszk kifejezés is eredt, egy mágiával átitatott, képlékeny anyag. Tapintásra egyszerre szilárd és mégis mintha bármelyik pillanatban átfolyna az ujjaid között. A maszkon lévő arc kifejezése változik a viselője érzéseivel. A maszkokat úgy tervezik hogy lehetetlen legyen befolyásolni őket, hiszen a viselőjének a lelkével vannak összekötve.",
    img: 'toronyvarosok/chameren.webp',
    speciesSpecial: [
      {
        desc: 'Képes vagy megváltoztatni a kinézetedet hogy ne ismerjenek fel, a más kinézetben töltött minden fél óra 1 stresszbe kerül és koncentrálnod kell hogy fenntartsd.',
      },
      {
        desc: 'Képes vagy lemásolni egy másik ember kinézetét miután legalább egyszer láttad azt, a másolás 10 percenként 1 stresszbe kerül, koncentrálnod kell hogy fenntartsd.',
      },
      {
        desc: 'Egy láthatatlan szál köt össze a körülötted lévő értelmes lényekkel, egy stresszért cserébe megváltoztathatod a hozzáállásuk feléd 1 napra. (Fortély próba, 12 CÉ)',
      },
      {
        desc: 'Képes vagy a testedet a környezethez igazítani, pihenésnél az egyik tulajdonságodhoz adhatsz egyet egy kis sebért cserébe ami a következő táborozásig kitart. Nem lehet a tulajdonság új értéke 4-nél több.',
      },
      {
        desc: 'A meggyengült gravitációban nőttél fel, emiatt mászás és egyensúly próbákra előnyt kapsz, és kétszer olyan magasra tudsz ugrani mint más népek.',
      },
      {
        desc: 'A maszkod és ruháid segítenek kifejezni a valódi éned, a meggyőzés és színlelés próbákra előnyt kapsz amikor álcázva vagy.',
      },
    ],
    homes: [
      {
        desc: "Cha'Me'Rén a művészetek és illúziók városa. Egy kamér mondás szerint azért esnek felfele a harmatcseppek hogy megcsodálhassák a város szépségét. Sűrűn faragott dísztornyok, oszlopok és spirálok ékesítenek minden épületet és szobrot. A pompa ellenére szerény életed volt, hiszen ha nem kitűnsz a tömegből nem vagy több mint egy másik arctalan, de te még megmutatod nekik egy napon.",
        bonus: [
          { name: 'Művészet', mod: '+1' },
          { name: 'Színészet', mod: '+1' },
        ],
      },
      {
        desc: "Il'Rén, amíg a karadennieknek mesterséges kőoszlopokat kell építeniük valahányszor terjeszkedni akarnak, a nyugati Szigethegyek bőségesen adnak lehetőséget új települések építésére. Il'Rén a legfiatalabb bármelyik kamér toronyváros közül, a legkeskenyebb és legmagasabb hegycsúcsra építették hogy bázisként szolgáljon a kamér léghajó flottának.",
        bonus: [
          { name: 'Repülés', mod: '+1' },
          { name: 'Távolsági fegyver', mod: '+1' },
        ],
      },
      {
        desc: "Ean'Rén - a keleti Szigethegyek közül a legősibb, ahol a legrégebbi kamér hagyományok őrződtek meg. Itt tanultad meg a legősibb alakváltó technikákat és a maszkok készítésének mesterségét.",
        bonus: [
          { name: 'Kézművesség', mod: '+1' },
          { name: 'Hagyományok', mod: '+1' },
        ],
      },
      {
        desc: 'Élő kövek - egy különleges terület ahol a kövek saját életet kaptak a koncentrált mágia hatására. Itt nőttél fel, tanulva a kövek nyelvét és a természetes mágia használatát.',
        bonus: [
          { name: 'Mágia érzékelés', mod: '+1' },
          { name: 'Természet ismeret', mod: '+1' },
        ],
      },
      {
        desc: "A Fehér Sírhalmok az utolsó toronyháborúk után hozták létre puszta szükségletből. Amikor Cha'Me'Rén faragott csarnokaiban elfogyott a hely a halottak ezreit elszállították az akkor még fehér dombságként ismert területre. A dombokat sírhalmok sorozatává alakították és az itt megtelepedett emberek megfogadták az őseik maradványának az ápolását. Egy váratlan következményként az itt található fehér lombú erdők új életre keltek és elképesztő méreteket értek el a lelkek tömegeitől. Egyes fákon még különleges mintázatok is megjelentek amik hasonlítanak a tündérerdőkére.",
        bonus: [
          { name: 'Halottkémészet', mod: '+1' },
          { name: 'Lelkek ismerete', mod: '+1' },
        ],
      },
      {
        desc: 'A Fordított erdő nevét a kamér területekhez képest meggyengébb gravitációjáról kapta ami miatt a vízcseppek felfele szállnak. A fák, ha lehet még így nevezni őket, hiszen jobban hasonlítanak nagyra nőtt virágokra, szirom-ernyőket növesztettek amikkel be tudják szedni az esővizet a száraz évszakban. Ez a partmenti terület a koncentrált mágikus jelenlétén kívül híres a halászairól, az itt élők az ernyős fákból alkotott csónakokból vadásznak a vízi lényekre majd a fővárosba szállítják őket.',
        bonus: [
          { name: 'Halászat', mod: '+1' },
          { name: 'Vízi lény ismeret', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'doma_altiora',
    name: 'Doma Altiora',
    desc: 'Nyugat szépeinek is nevezik őket a karcsú alkatuk és színtelen, szinte átlátszó hajuk miatt ami visszaveri a nap sugarait. Az öltözékeik egy központi fehér köpönyegből állnak aminek a szövetébe különböző hullámokra hasonlító minták vannak szőve a státuszuktól függően. A főmágusok és urak köpenyei ezüst Holdhullámos (más néven Holthullámos) vagy arany Naphullámos díszvarratai beragyogják az utcákat ahogy visszatükröződnek az üvegekről és tükrökről. Napsütötte bőrüket színes tetoválások borítják és ünnepek idején virágok százait tűzik magukra. A fő vallásukat két ágra lehet bontani, a Napkelti és Holdkelti ágra. Bár ez a különbség okozott konfliktusokat az évek alatt a két vallási ág harmóniában él egymás mellett. A Napkeltiek, a virágok, az újjászületés és ébredés ünneplői a száraz évszakban, majd a nedves évszak beközetkeztével a korhadó, kiszárított virágokat a Holdkeltiek veszik át az elmúlás és pihenés nevében. Tudják a világ szükséges kettősségét és helyet engednek megnyilvánulásainak. A személyiségük erősen tükrözi ezt a kettőséget, hiszen befogadnak mindenkit aki menedéket kér náluk viszont cserébe megkövetelik a szokásaik és törvényeik tiszteletben tartását. Bármit csinálnak azt a végletekig csinálják, ha ünnepelnek akkor úgy ünnepelnek mintha nem lenne holnap, ha gyászolnak akkor még az óceánt is csendre parancsolják.',
    img: 'toronyvarosok/altiora.webp',
    speciesSpecial: [
      {
        desc: 'A kettősség ereje árad belőled, napközben a Napkelti hited miatt +1 távolsági támadást kapsz, éjszaka pedig a Holdkelti hited miatt +1 közelharci támadást.',
      },
      {
        desc: 'A fehér köpenyed és színtelen hajad visszaveri a fényt, éjszaka vagy sötét helyeken a rejtőzés próbáidra előnyt kapsz.',
      },
      {
        desc: 'A virágok és növények nyelve ismerős számodra, a növények felismerésére és gyógyító hatásaik használatára előnyt kapsz.',
      },
      {
        desc: 'Az ünnepek és szertartások mestere vagy, a társadalmi eseményekben való navigálásra és a protokoll betartására előnyt kapsz.',
      },
      {
        desc: 'A végletekig csinálsz mindent, ha sikerül egy próbában, a következő hasonló próbádra is előnyt kapsz. Ha kudarcot vallasz, a következő hasonló próbádra hátránnyal dobsz.',
      },
      {
        desc: 'A hullámok ritmusát ismered, a vízi utazás és hajózás próbáira előnyt kapsz, és kétszer olyan gyorsan tudsz úszni mint más népek.',
      },
    ],
    homes: [
      {
        desc: 'A Napkelti Főváros, ahol a nap első sugarai mindig a legszebben csillannak. Itt nőttél fel a virágok és fények közepette, tanulva a Napkelti szertartásokat és az újjászületés misztériumait.',
        bonus: [
          { name: 'Vallás ismeret', mod: '+1' },
          { name: 'Szertartás vezetés', mod: '+1' },
        ],
      },
      {
        desc: 'A Holdkelti Kolostor, egy csendes és nyugodt hely ahol a holdfény mindig bevilágítja a termeket. Itt tanultad meg a Holdkelti hagyományokat és a belső békézés művészetét.',
        bonus: [
          { name: 'Meditáció', mod: '+1' },
          { name: 'Bölcseség', mod: '+1' },
        ],
      },
      {
        desc: 'A Virágmezők, ahol a legszebb és legritkább virágok nőnek. Itt nőttél fel, a virágok nyelvét és gyógyító erejét tanulva.',
        bonus: [
          { name: 'Gyógyítás', mod: '+1' },
          { name: 'Növény ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Tengerparti Falu, ahol a hullámok zenéje kíséri minden napodat. Itt tanultad meg a hajózás és halászat mesterségét.',
        bonus: [
          { name: 'Hajózás', mod: '+1' },
          { name: 'Halászat', mod: '+1' },
        ],
      },
      {
        desc: 'A Ünnepi Völgy, ahol a legnagyobb ünnepeket és szertartásokat tartják. Itt nőttél fel, részt véve minden nagy eseményen és tanulva a ünnepi protokollokat.',
        bonus: [
          { name: 'Ünnepi protokoll', mod: '+1' },
          { name: 'Tánc', mod: '+1' },
        ],
      },
      {
        desc: 'A Tetoválók Műhelye, ahol a legszebb tetoválások készülnek. Itt tanultad meg a tetoválás művészetét és a szimbólumok jelentését.',
        bonus: [
          { name: 'Tetoválás', mod: '+1' },
          { name: 'Szimbólum ismeret', mod: '+1' },
        ],
      },
    ],
  },
];

const novenyszerzetek: SpeciesInterface[] = [
  {
    id: 'rugysze',
    name: 'Rügysze',
    desc: 'A rügysze, vagy más nevükön rügyesek a növényszerzetek leggyakoribb alfaja. Azokon a mezőkön és napsütötte erdőkben születnek amik már szinte teljesen elfelejtették a régi háborúk vérontását és az utazók lábnyomait. A környezetüktől függően hasonlíthatnak hatalmas virágokra vagy kis lomb födte bokrokra, szépségük miatt sokszor tévesztik össze őket álruhás tündérekkel. Gyermeki kíváncsisággal fürkészik a világot és imádják más lények társaságát. Mesterei a rejtőzködésnek és akár napokig követik észrevétlenül a náluk megforduló utazókat. A fellelhető leírásokban néha virágszirmokból szétágazó koronával, máskor sziromruhában írják le őket egy különös tárggyal a mellkasuk közepén vagy egyéb testrészükön. Kinézetük ellenére legalább annyira emberek mint bármelyik nép, talán jobban is. Mágikus természetük miatt képesek emberi ételt és italt fogyasztani. Van saját személyiségük, terveik, álmaik. Ha a természet minden alkotásának van szerepe, akkor az övéjük az ember által elfoglalt területek visszahódítása, fűszálról fűszálra.',
    img: 'novenyszerzetek/rugysze.webp',
    speciesSpecial: [
      {
        desc: 'Válassz egy nem mágikus növényt a tárhelyedből amit elültetsz magadon. Egy nappal később hármat kapsz belőle, 2 stressz elköltéséért ez rögtön megy végbe.',
      },
      {
        desc: 'Amíg olyan helyen tartózkodsz ami földet és növényeket tartalmaz, teljesen eggyé tudsz válni a környezettel. Más népek képtelenek észrevenni viszont nem is hajthatsz végre akciókat ebben a formában.',
      },
      {
        desc: 'A vadon lényei társukként kezelnek téged és segítenek is ha kell. Minden állat legalább segítőkészként viselkedik veled szemben.',
      },
      {
        desc: 'Nincs szükséged táplálékra, cserébe fele annyi stresszt gyógyítasz vissza rövid pihenésnél/táborozásnál.',
      },
      {
        desc: 'A nagy sebeid teljesen begyógyulnak és az elvesztett végtagjaid visszanőnek egy hét alatt, a tűz sebzés kétszeresen sebez.',
      },
      {
        desc: 'Képes vagy növénytakarót alkotni egy organikus felületre, ezzel akár elrejteni valamit vagy szimplán életet adni ahol ez nem adatott meg. A növénytakaró mérete 1 négyzetméter + a szinted.',
      },
    ],
    homes: [
      {
        desc: 'Az erdő mélyén láttál napvilágot egy mágus otthonának a tövében. Nézted ahogy a mágus hetekig szitkozódva keres egy ereklyét a bozótok között, de szó literálisan nem lett volna szíved ha elárulod neki hol találja. Végül miután felfedezett téged ahelyett hogy visszavette volna az ereklyét megkért hogy gondozd a kertjét.',
        bonus: [
          { name: 'Növény ismeret', mod: '+1' },
          { name: 'Kertészet', mod: '+1' },
        ],
      },
      {
        desc: 'Egy csatatér közepén ébredtél egy törött fegyverrel a mellkasodban. Néha mikor álmok között keringsz visszajönnek képek. Menetelsz ismeretlen utakon, zászlós sátrak vesznek körül vagy az ellenségek tengere. Jobba beburkolod magad a földbe, egy elmúlt rémálom.',
        bonus: [
          { name: 'Történelem', mod: '+1' },
          { name: 'Álom értelmezés', mod: '+1' },
        ],
      },
      {
        desc: 'Egy rét közepén találod magad miután egy utazó elejtette a varázsitalát. A folyadékot felitta a föld és megszülettél te. Évekig csak megfigyelted a réteden átutazókat amire volt elég bátorságod hogy bemutatkozz egynek.',
        bonus: [
          { name: 'Megfigyelés', mod: '+1' },
          { name: 'Bátorság', mod: '+1' },
        ],
      },
      {
        desc: 'Egy falunak a szélén születtél egy kő miatt amibe valaki a szerelmének a nevét véste mágikus rúnákkal. A falusi gyerekek minden este jöttek bújócskázni veled, viszont egy napon meglátott az egyik szülő és elüldöztek a faluból.',
        bonus: [
          { name: 'Rejtőzés', mod: '+1' },
          { name: 'Rúna ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'Egy elhagyatott gyárépületben ébredtél. A beomlott tetőn áttört a déli nap fénye és megvilágította a beléd nőtt fém szerszámot. Az első éveidet annak szentelted hogy az üres géptermeket virágoskertté változtasd.',
        bonus: [
          { name: 'Barkácsolás', mod: '+1' },
          { name: 'Átalakítás', mod: '+1' },
        ],
      },
      {
        desc: 'Egy botanikus kertben születtél egy félresikerült kísérlet eredményeként, a magodat alkotó színes kristály csodaszer helyett téged alkotott meg. Gyorsan elmenekültél mielőtt az alkotód kipróbálta volna hogy ehető vagy-e.',
        bonus: [
          { name: 'Kémia', mod: '+1' },
          { name: 'Menekülés', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'kergelabak',
    name: 'Kérgelábak',
    desc: 'A kéreglábak, más neveiken röcsögők vagy egyszerűen kérgesek bár ritkábbak mint rokonaik, még is ők rendelkeznek a legtöbb hírnévvel és gyerekmesék gyakori szereplői. Néha évtizedekbe is telhet amire egy kérgeláb megszületik, cserébe képesek akár több száz, talán több ezer évig is élni. A legnagyobb dokumentált kérgeláb Öreg Csök, egy több mint száz méteres tölgyfa akinek az ereklyéjét senki sem láthatta, de a szóbeszéd szerint egy áradás előtti nagy hatalmú mágusé lehetett. Nyugodt és megfontolt lények, nem szeretik a hirtelen változásokat és legtöbbször egész életüket ugyanabban az erdőben éli le. A kérgük szívósabb bármelyik fánál így ha sikerül kiérdemelned egy kérgeláb dühét egy egyszerű fejsze nem fog megmenteni. A lombkoronájuk változik az évszakokkal és ha nem mozdulnak meg képesek teljesen beleolvadni mozdulatlan társaik közé.',
    img: 'novenyszerzetek/kergelab.webp',
    speciesSpecial: [
      {
        desc: 'A vastag kérged védelmet nyújt, természetes 2 védelmet kapsz, ami a páncéljaiddal összeadódik.',
      },
      {
        desc: 'Képes vagy mozdulatlan állapotban teljesen egyesülni a környezeteddel. Ha egy helyben maradsz és nem cselekszel, más lények nem vesznek észre, hacsak nem támadsz meg valakit vagy kezdesz cselekedni.',
      },
      {
        desc: 'Az évszakok változásával együtt változik a tested is. Tavasszal és nyáron +1 életerőt kapsz, ősszel és télen +1 védelmet.',
      },
      {
        desc: 'A gyökereid mélyen a földbe nyúlnak, képes vagy érzékelni a környéken mozgó lényeket. A meglepetés ellen mindig előnyt kapsz.',
      },
      {
        desc: 'Képes vagy felvenni a vizet és tápanyagokat a talajból, nincs szükséged ivóvízre, és csak fele annyi ételre mint más népek.',
      },
      {
        desc: 'A hosszú életed során rengeteg tapasztalatot gyűjtöttél. A történelem és ősi ismeretek próbáira előnyt kapsz.',
      },
    ],
    homes: [
      {
        desc: 'Az Ösi Tölgyerdő mélyén nőttél fel, ahol a legidősebb kérgelábak tanítanak. Itt tanultad meg az erdő titkait és a régi mágia használatát.',
        bonus: [
          { name: 'Ősi mágia', mod: '+1' },
          { name: 'Erdő ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Hegyoldali Erdőben születtél, ahol a fák sziklás talajon küzdenek a túlélésért. Itt megtanultad, hogyan kell ellenállni a zord körülményeknek.',
        bonus: [
          { name: 'Túlélés', mod: '+1' },
          { name: 'Állóképesség', mod: '+1' },
        ],
      },
      {
        desc: 'A Mocsári Cserjésben nőttél fel, ahol a fák gyökerei mélyen a víz alá nyúlnak. Itt tanultad meg a vízi növények és lények ismeretét.',
        bonus: [
          { name: 'Vízi ismeret', mod: '+1' },
          { name: 'Növény ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Sziklás Fennsík ritka erdejében éltél, ahol a fák magányosan nőnek a sziklák között. Itt megtanultad a magány és a meditáció értékét.',
        bonus: [
          { name: 'Meditáció', mod: '+1' },
          { name: 'Természet mágia', mod: '+1' },
        ],
      },
      {
        desc: 'A Völgyi Erdőben nőttél fel, ahol a fák sűrűn nőnek és védelmet nyújtanak egymásnak. Itt tanultad meg a közösség és az együttműködés fontosságát.',
        bonus: [
          { name: 'Közösség', mod: '+1' },
          { name: 'Védelmezés', mod: '+1' },
        ],
      },
      {
        desc: 'Az Elhagyatott Kertben születtél, ahol egy régi mágus kertje visszavette a természet. Itt tanultad meg a mesterséges és természetes világ határán való navigálást.',
        bonus: [
          { name: 'Kertészet', mod: '+1' },
          { name: 'Mágia érzékelés', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'kalaposok',
    name: 'Kalaposok',
    desc: 'A mocsarak, öreg erdők és barlangok mélyén, a Nap égető tekintetétől védve burjánzanak a gombák csalogató méregzöld pompájukban. A kalaposok ezeknek a gombáknak a rokonai, egy ősi életforma és még ősibb hatalom egyesülésének gyermekei. A nevüket a fejükön lévő gomba kalapról kapták amiknek a belsejében a spórák helyett a lemezek csábító feromonokat, méregfelhőt, foszforeszkáló kristályszemcséket termelnek, bármit ami segít nekik a túlélésben. A kalaposak nem látják olyan gyerekszemmel a világot mint a rügyesek és nem fontolják meg minden lépésüket mint a kérgesek. Nem szeretik az emberek társaságát és ha tehetik messziről elkerülik őket. A puha, legtöbbször hófehér testük képes órák alatt teljesen visszanőni. A ritka hihető beszámolók a kalaposokról azt állítják hogy bár másokkal nem szívesen közösködnek, imádják fajtársaik társaságát és akár önzetlenek is tudnak lenni ha a közösségük túlélését elősegíti. Szeretik a praktikus ruhákat amiket elfeledett csataterekről és gyár-erődök környékről gyűjtenek össze.',
    img: 'novenyszerzetek/kalapos.webp',
    speciesSpecial: [
      {
        desc: 'A kalapod különböző anyagokat termel, naponta egyszer választhatsz: csábító feromont (elterelésre), méregfelhőt (támadásra) vagy foszforeszkáló kristályt (világításra).',
      },
      {
        desc: 'Puha tested gyorsan regenerálódik, minden rövid pihenésnél visszakapsz 2 életerőt, és a elvesztett testrészek pár óra alatt visszanőnek.',
      },
      {
        desc: 'Kiválóan érzékeled a környezetedet a sötétben is, a sötétben nem kapsz hátrányt a megfigyelésre, és sötétben rejtőzésre előnyt kapsz.',
      },
      {
        desc: 'Képes vagy spórákat kibocsátani, amelyekkel rövid ideig megzavarhatod mások érzékeit. Egy közeledő ellenfél következő támadására hátrányt kapsz, ha sikeresen kibocsátod a spórákat.',
      },
      {
        desc: 'Immunis vagy a mérgekre és betegségekre, a mérgek és betegségek nem hatnak rád.',
      },
      {
        desc: 'Képes vagy a talajba és a sötét, nedves helyekbe rejtőzni, a természetes környezetben való rejtőzésre előnyt kapsz.',
      },
    ],
    homes: [
      {
        desc: 'Egy ősi, sötét erdő mélyén nőttél fel, ahol a fák gyökerei között rejtőztél. Itt tanultad meg az erdő titkait és a rejtőzködés művészetét.',
        bonus: [
          { name: 'Rejtőzés', mod: '+1' },
          { name: 'Erdő ismeret', mod: '+1' },
        ],
      },
      {
        desc: 'Egy elhagyatott barlangrendszerben születtél, ahol a kövek és a nedvesség vettek körül. Itt megtanultad, hogyan kell a sötétben navigálni és a föld alatti veszélyeket elkerülni.',
        bonus: [
          { name: 'Barlangászás', mod: '+1' },
          { name: 'Sötétben látás', mod: '+1' },
        ],
      },
      {
        desc: 'Egy mocsár közepén éltél, ahol a növények és a víz világa keveredik. Itt tanultad meg a mocsarak és a vízi élőlények ismeretét.',
        bonus: [
          { name: 'Mocsár ismeret', mod: '+1' },
          { name: 'Vízi túlélés', mod: '+1' },
        ],
      },
      {
        desc: 'Egy elhagyatott gyár vagy erőd romjai között nőttél fel, ahol a mesterséges és természetes világ találkozik. Itt megtanultad a gyártott tárgyak használatát és javítását.',
        bonus: [
          { name: 'Barkácsolás', mod: '+1' },
          { name: 'Romok ismerete', mod: '+1' },
        ],
      },
      {
        desc: 'Egy föld alatti gombabirodalomban éltél, ahol a kalaposok közössége él. Itt tanultad meg a közösségi élet és az együttműködés fontosságát.',
        bonus: [
          { name: 'Közösség', mod: '+1' },
          { name: 'Gyógyítás', mod: '+1' },
        ],
      },
      {
        desc: 'Egy elveszett város alatti alagútrendszerben születtél, ahol a kalaposok titokban élnek. Itt megtanultad a titoktartás és a megfigyelés művészetét.',
        bonus: [
          { name: 'Megfigyelés', mod: '+1' },
          { name: 'Titoktartás', mod: '+1' },
        ],
      },
    ],
  },
];

const keletNepe: SpeciesInterface[] = [
  {
    id: 'eddek',
    name: 'Éddek',
    desc: 'A kelet kezei; művészek, nyomolvasók, munkásemberek. A többi klánhoz képest szelídnek lehet mondani őket. Az otthonaik helyét a lehető legnagyobb titokban tartják, néha még a klánon belül sem tudnak egymás hollétéről. Persze a jelek amiket hagynak egymásnak, jelek amik a többi nép számára szinte láthatatlanok, segítséget nyújtanak ha vész idején szállást keresnek. A klán központjáról semmit sem tudunk azon kívül hogy léteznie kell, hiszen több említés is szerepel édd feljegyzésekben egy helyről „ahol összefonják a történeteket”. Természetükből adódóan konfliktuskerülők és inkább szeretnek megfigyelni és ha elkerülhetetlen, gyorsan és embertelen precizitással megoldani az említett konfliktusokat. Az átlagfeletti érzékeik miatt mintha egy másik világban élnének, látják a színek közötti színeket, a néma hangokat, egy tapintással képesek többet elmondani valamiről mint egy tudós a laboratóriumában. A ruhájuk kívülről beleolvad a környezetbe, sokszor növényeket és mohákat szőnek a hosszú köpenyeikre. A külső funkcionalitással ellentétben a ruháik belseje inkább hasonlít egy hedonista nemes festmény galériájára. Ékszerekkel, gyöngyökkel rakják ki, különböző fonásmintákkal díszítik és olyan festékeket használnak amiket még az altioriaknál sem fogsz találni. A köpenyek belsejében fonott kötelek tucatjai vannak amiket üzenéshez és szállításhoz használnak, lehet hogy egy kis erszényt akasztanak rá vagy egy gyöngy levelet (különböző ismétlésű gyöngyök és csomókból alkotott üzenet). Ez az amúgy is magának való nép az áradással még inkább elszigetelte magát a többi néptől, emiatt sokkal drasztikusabb változásokon mentek keresztül. Vadászathoz nem használnak kutyákat mert az érzékeik bármelyik állatnál erősebbek. Elképesztő magasságuk és sovány felépítésük miatt természetesen görnyedtek, a karjaik szinte olyan hosszúak mint a nyúl szerű lábaik, négykézlábon még a medvéket is lefutják. A nagy szemeikben pedig a fény folyamatos színekben játszik a szembogaruk körül. A füleik kicsit hegyesek és tudják mozgatni is őket, viszont a hangos zajokra érzékenyek. A bőrük enyhén kékes és az egyenes hajuk sokszor befonják, de csak ha párkapcsolatban vannak.',
    img: 'kelet/edd.webp',
    speciesSpecial: [
      {
        desc: 'Az éles érzékeid lehetővé teszik, hogy észrevegyél mások számára láthatatlan jeleket és nyomokat. A megfigyelés és nyomkövetés próbáira előnyt kapsz.',
      },
      {
        desc: 'Képes vagy olyan gyorsan mozogni, hogy mások számára csak egy elmosódott alak vagy. Mozgás akció alatt kétszer annyit tudsz megtenni, ha nem támadsz vagy más erőfeszítést végzel.',
      },
      {
        desc: 'A köpenyed belsejében fonott köteleken különböző jeleket és üzeneteket hordasz. Ezek segítségével képes vagy gyorsan kommunikálni és információkat tárolni. A titkos kommunikáció próbáira előnyt kapsz.',
      },
      {
        desc: 'Az éles hallásod és látásod árán érzékeny vagy a hangos zajokra. Hangos környezetben a koncentráció próbáidra hátránnyal dobsz.',
      },
      {
        desc: 'Képes vagy a környezetedbe olyan jól beleolvadni, hogy mások alig vehetnek észre. A rejtőzés próbáidra előnyt kapsz természetes környezetben.',
      },
      {
        desc: 'A hosszú karjaid és lábaid lehetővé teszik, hogy mászás és egyensúly próbáidra előnyt kapj. Kétszer olyan magasra tudsz ugrani, mint más népek.',
      },
    ],
    homes: [
      {
        desc: 'Egy ősi erdő mélyén nőttél fel, ahol a fák és a növények között tanultad meg a természet titkait. Itt tanultad meg a rejtőzködés és a nyomkövetés művészetét.',
        bonus: [
          { name: 'Rejtőzés', mod: '+1' },
          { name: 'Nyomkövetés', mod: '+1' },
        ],
      },
      {
        desc: 'Egy elhagyatott barlangrendszerben éltél, ahol a kövek és a sötétség vettek körül. Itt megtanultad, hogyan kell a föld alatt navigálni és a rejtett jeleket használni.',
        bonus: [
          { name: 'Barlangászás', mod: '+1' },
          { name: 'Jelolvasás', mod: '+1' },
        ],
      },
      {
        desc: 'Egy mocsár szélén nőttél fel, ahol a víz és a szárazföld találkozik. Itt tanultad meg a mocsarak és a vízi élőlények ismeretét, valamint a csendben mozgást.',
        bonus: [
          { name: 'Mocsár ismeret', mod: '+1' },
          { name: 'Csendes mozgás', mod: '+1' },
        ],
      },
      {
        desc: 'Egy elveszett város romjai között éltél, ahol a mesterséges és természetes világ keveredik. Itt megtanultad a romok közötti navigálást és a rejtett üzenetek felismerését.',
        bonus: [
          { name: 'Romok ismerete', mod: '+1' },
          { name: 'Rejtett üzenetek', mod: '+1' },
        ],
      },
      {
        desc: 'Egy magas hegyvidéken nőttél fel, ahol a ritka levegő és a meredek szirtek vettek körül. Itt tanultad meg a magasban való mozgást és a távoli jelek felismerését.',
        bonus: [
          { name: 'Mászás', mod: '+1' },
          { name: 'Távoli jelek', mod: '+1' },
        ],
      },
      {
        desc: 'Egy sűrű dzsungel közepén éltél, ahol a növények és az állatok rejtekhelyei vettek körül. Itt megtanultad a dzsungel titkait és a gyors, csendes mozgást.',
        bonus: [
          { name: 'Dzsungel ismeret', mod: '+1' },
          { name: 'Gyors mozgás', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'vadinok',
    name: 'Vadinok',
    desc: 'A sokszor vadaknak csúfolt vadinok okkal érdemelték ki ezt a nevet. Vadászok, néha a legemberibb ragadozónak is nevezik őket. Egy történet szerint egy vadin puszta kézzel lemészárolt egy busó démont, a földre szorította és letépte a maszkját, csak azért mert tetszett neki a prémje. Vadásznak és fosztogatnak, a száraz évszakban amikor az északi kúszó erdők leérnek a hegyek aljáig úgy ők is lejönnek a hegyekből és „learatják” a többi klán földjét. Az eszközeiket és a házaikhoz az alapanyagot a kúszóerdők vörös, tüskés fáiból növesztik formára majd kézzel cipelik magukkal. Legfelismerhetőbb része a páncéljuknak a sisakjuk. A hegyek oldalába vésett erőd műhelyeikben a nedves évszak alatt előre legyártják a majd a fosztogatáshoz szükséges fegyvereket és páncélokat. A sisak az egész fejet takarja és állati vagy fajzat fejre hasonlít, attól függően hogy mi volt az első sikeres vadászatának a trófeája. Majdnem olyan szélesek mint magasak, sokszor meghaladják a két métert. A fejüket sűrű, tüskés sörény borítja a mellkasukig és erős, majdnem ragadozó szerű állkapcsuk van.',
    img: 'kelet/vadin.webp',
    speciesSpecial: [
      {
        desc: 'A vadászösztöneid soha nem csalnak meg. Vadászat és a zsákmány felkutatása próbáira előnyt kapsz, és mindig tudod, hol találhatod a legközelebbi táplálékforrást.',
      },
      {
        desc: 'A páncélod és természetes ellenállásod miatt 2 természetes védelmet kapsz, ami a többi páncéloddal összeadódik.',
      },
      {
        desc: 'A hatalmas termeted és izmaid lehetővé teszik, hogy félelmetes erőt fejts ki. Közelharcban +1 sebzést kapsz, amikor kétkezes fegyvert használsz.',
      },
      {
        desc: 'A sisakod nemcsak véd, hanem meg is ijeszt. Amikor a sisakodat viseled, az ellenfelek első félelempróbájára hátránnyal dobnak.',
      },
      {
        desc: 'Képes vagy a vadászati trófeáidból erőt meríteni. Egy sikeres vadászat után a következő harcodban +1 támadást kapsz.',
      },
      {
        desc: 'A kúszóerdők vörös fáiból készült eszközeid szinte elpusztíthatatlanok. A fából készült fegyvereid és páncéljaid nem törnek el harc közben.',
      },
    ],
    homes: [
      {
        desc: 'A Hegyoldali Erődben nőttél fel, ahol a vadinok legjobbjai készítik a fegyvereket és páncélokat. Itt tanultad meg a fegyverkovácsolás és a páncélkészítés alapjait.',
        bonus: [
          { name: 'Fegyverkovácsolás', mod: '+1' },
          { name: 'Páncélkészítés', mod: '+1' },
        ],
      },
      {
        desc: 'A Kúszóerdők Mélyén születtél, ahol a vörös, tüskés fák között tanultad meg a vadászat és a rejtőzködés művészetét. Itt volt az első sikeres vadászatod is.',
        bonus: [
          { name: 'Vadászat', mod: '+1' },
          { name: 'Rejtőzés', mod: '+1' },
        ],
      },
      {
        desc: 'A Sziklás Fennsíkon nőttél fel, ahol a vadinok legmerészebb vadászai készülnek a nagy vadászatokra. Itt tanultad meg a terep használatát és a csapdák állítását.',
        bonus: [
          { name: 'Terepismeret', mod: '+1' },
          { name: 'Csapdaállítás', mod: '+1' },
        ],
      },
      {
        desc: 'A Déli Fosztogató Úton éltél, ahol a vadinok a száraz évszakban fosztogatnak. Itt tanultad meg a gyors támadás és a zsákmány szerzés fortélyait.',
        bonus: [
          { name: 'Gyors támadás', mod: '+1' },
          { name: 'Zsákmányszerzés', mod: '+1' },
        ],
      },
      {
        desc: 'Az Északi Jégvidéken nőttél fel, ahol a legkeményebb vadinok vadásznak a legveszélyesebb állatokra. Itt tanultad meg a túlélést extrém körülmények között.',
        bonus: [
          { name: 'Túlélelés', mod: '+1' },
          { name: 'Állatismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Nyugati Törzsi Táborban születtél, ahol a vadinok legősibb hagyományait őrzik. Itt tanultad meg a törzsi szertartásokat és a harcművészeteket.',
        bonus: [
          { name: 'Törzsi szertartások', mod: '+1' },
          { name: 'Harcművészet', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'monorok',
    name: 'Monorok',
    desc: 'Az iparosodás és a világpusztulás náluk kéz a kézben jár. A területük a keleti lápok és sztyeppék fodrozásain terült el, így őket érte legelőször az áradás pusztítása. Ők alkották meg a gátat, egy ultimátumot a világ ellen hogy visszaszerezhessék a földjeiket. A nyugati gyárosokkal és iparosokkal szemben őket nem érdekli a szépség, az esztétika, vagy hogy mennyire ártanak a földnek a gépeikkel. Szerintük amíg amit csinálnak azzal a népük megél még egy ciklust, addig nincs olyan ár amit nem képesek megfizetni. Az iparurak egész hegyoldalakat kopasztanak le faanyagért vagy területért és mocsarakat szipolyoznak le. A gépezeteik, ha éppen nem egész területeket tesznek tönkre, a műhelyekben friss üzemanyagot és rúnavéséseket kapnak. Ez talán az egyetlen mesterség ami ténylegesen megmaradt az őseik kultúrájából, a régi időkben a sírjaik és emlékhelyeik megóvására szólgáltak és egész évben színes, lappangó fénybe borították azokat. Távol tartották a könyörtelen telet, a jeges esőt ami elverné a termést, olyan keménnyé tette a földet hogy a fosztogató ásója bele törjön. Ugyanez a mesterség manapság pusztító erővel ruházza fel a gépóriásaikat és a különféle fegyvereiket. Ezek a rúnák a megváltásuk és a kárhozatuk kulcsa volt, egyben az ok ami miatt ennyire sztoikusak a világgal szemben. Az első áradáskor a mágiával átitatott víz túltöltötte a rúnákat és a fél keleti tájék színtelen lángokba borult. A keletkezett lökéshullám hetekig visszatartotta a vizet a földjeikről, viszont súlyos következményekkel járt. Az emberi szervezet nem képes feldolgozni évszázadok megszilárdult mágiájának a hirtelen felszabadulását. A monoroknál a lökéshullám annyira meggyengítette a megfogható és megfoghatatlan részük közötti kapcsolatot hogy a szó szoros értelmében kilökte a lelküket a testükből. Nem tartoznak a lidércek közé de nem is mondhatók halandó embernek. Képesek látni az anyagi és anyagtalan világot mint két egymásra rétegelt üveglap. A meggyengült kötelék miatt képesek rúnákba és tárgyakba, de akár élőlényekbe is helyezni a lelkük egy darabját. Mint egy végtagnak a helye, érzik hogy hol van, vagy hogy mi történik éppen vele. A nagy hatalmú monorok még mozgatni is tudják ezeket a tárgyakat messziről. A legjobb monor bérgyilkosok a kardjukba ültetik a lelküknek egy jelentős részét és képesek harcolni anélkül hogy egyáltalán odanézzenek. Ennek a mágiának a használata viszont súlyos következményekkel jár. Minden véssel a lelküket koptatják, elvesznek önmagukból amíg semmi sem marad. Lassan elvesztik a kinézetük egyéniségét és a személyiségüket, ezzel együtt pedig az olyan halandó érzelmeket mint empátia, szerelem, vagy utálat. A szemük és a hajuk felnőttkorukra kifakul majd hófehérré tisztul. A bőrük feltöredezik és vérvonaltól függően ezüst, arany, de akár smaragd vagy rubint színű hegek keletkeznek. A többi népnek a lelkük egy fekete árnyékként jelenik meg ami erekhez hasonló, cérna vékony szálakkal fonódik a testükhöz mint egy bábjátékos. A monorok gyorsan rájöttek hogy az emberi lélek okkal van húsba páncélozva. Bár az árnyékukat a fizikai fegyverek nem sérthetik meg, így akár azután is életben tudnak maradni hogy a testük más népek mércéjével túlélhetetlen sérüléseket szenvedett el, a mágikus természetű csapások könnyedén elszakítják a köteléket a testüktől amitől lidércekké válnak, vagy akár el is pusztulhat a lelkük teljesen. Az öregebb monoroknál a kapcsolat a testük és lelkük között annyira elvékonyodhat hogy mágikus bilincsekkel tartják össze magukat.',
    img: 'kelet/monor.webp',
    speciesSpecial: [
      {
        desc: 'A test-lelek kapcsolat meggyengülésével fizikai sebzésnél nem kapsz mínuszt ha 0 életerőn vagy, viszont minden további sebzés stresszé alakul át. Ha eléred a 0 stresszt, meghalsz.',
      },
      {
        desc: 'Képes vagy a lelked egy részét tárgyakba vagy rúnákba helyezni. Naponta egyszer távolról mozgathatsz egy kis tárgyat, vagy érzékelheted a környezetet a lelked által befogott tárgyon keresztül.',
      },
      {
        desc: 'A mágikus rúnák ismerete a véredben van. Rúnavésés és mágikus eszközök készítésére előnyt kapsz.',
      },
      {
        desc: 'Képes vagy látni a lelki világot és az anyagi világot egyszerre. Lényeges szellemi vagy mágikus jelenségek észlelésére előnyt kapsz.',
      },
      {
        desc: 'A különleges anyagcseréd miatt csak fele annyi ételre van szükséged, mint más népeknek.',
      },
      {
        desc: 'Immunis vagy a fizikai fájdalom legtöbb formájára, de a mágikus támadások kétszeres sebzést okoznak.',
      },
    ],
    homes: [
      {
        desc: 'A Gát őrei között nőttél fel, ahol a monorok legnagyobb építményét őrizték. Itt tanultad meg a mérnöki munkát és a rúnák védelmi használatát.',
        bonus: [
          { name: 'Mérnöki munka', mod: '+1' },
          { name: 'Védő rúnák', mod: '+1' },
        ],
      },
      {
        desc: 'A Runaműhelyekben születtél, ahol a legkiválóbb monor mesterek tanítják a rúnavésés mesterségét. Itt sajátítottad el a legerősebb rúnák készítésének titkait.',
        bonus: [
          { name: 'Rúnavésés', mod: '+1' },
          { name: 'Mágia használat', mod: '+1' },
        ],
      },
      {
        desc: 'A Elhagyatott Bányák mélyén nőttél fel, ahol a monorok nyersanyagot termelnek ki. Itt tanultad meg a föld alatti túlélést és az ásványok ismeretét.',
        bonus: [
          { name: 'Bányászat', mod: '+1' },
          { name: 'Ásványismeret', mod: '+1' },
        ],
      },
      {
        desc: 'A Pusztító Gépek műhelyeiben éltél, ahol a monorok legveszélyesebb fegyvereit készítik. Itt tanultad meg a harci gépek kezelését és karbantartását.',
        bonus: [
          { name: 'Géphasználat', mod: '+1' },
          { name: 'Fegyverkészítés', mod: '+1' },
        ],
      },
      {
        desc: 'A Lidércek Közt nőttél fel, ahol a monoroknak a lelkük egy részét már elvesztett rokonai élnek. Itt tanultad meg a szellemek és lidércek kezelését.',
        bonus: [
          { name: 'Szellemismeret', mod: '+1' },
          { name: 'Lélek kapcsolat', mod: '+1' },
        ],
      },
      {
        desc: 'A Elszenvedett Pusztulás Emlékhelyén születtél, ahol az áradás első hulláma pusztított. Itt tanultad meg a túlélést extrém körülmények között és a múlt tanulságainak felhasználását.',
        bonus: [
          { name: 'Túlélelés', mod: '+1' },
          { name: 'Történelem', mod: '+1' },
        ],
      },
    ],
  },
];

const gepszulottek: SpeciesInterface[] = [
  {
    id: 'automa_fenntartok',
    name: 'Automa model 1 - Fenntartók',
    desc: 'Az első generáció; fenntartók, tanítók és az új gépszülöttek megalkotói. Az Alkotótól fennmaradt leírások és tervrajzok segítségével nemcsak képesek megjavítani és gyarapítani a népüket, hanem új, tovább fejlesztett modellekkel állnak szembe a természettel ami megtagadja őket. Primitív, improvizált tartozékok alkotják a vázukat amik az évtizedek alatt egymáshoz forrtak. A Nagy Műhely fenntartói egy az Alkotó által megérintett tárgyat hordanak a vázuk belsejében. Az újabb generációk az alkotóik és mentorjaik egy-egy darabját őrzik maguknál a hódolat jeléül.',
    img: 'gepszulottek/automa1.webp',
    speciesSpecial: [
      {
        desc: 'Képes vagy megjavítani és továbbfejleszteni a népéedet. A gépek és automaták javítására és fejlesztésére előnyt kapsz.',
      },
      {
        desc: 'Az Alkotó által megérintett tárgyat hordozod, ami növeli a mágikus hatások elleni ellenállásodat. Mágikus támadások ellen +1 védelmet kapsz.',
      },
      {
        desc: 'A primitív, de hatékony tartozékok alkotják a testedet, ami +1 természetes védelmet ad.',
      },
      {
        desc: 'Képes vagy tanítani a többi automatát. A tanítás és oktatás próbáira előnyt kapsz.',
      },
      {
        desc: 'A vázadban rejlő erő lehetővé teszi, hogy ne legyen szükséged alvásra, és kevesebb energiára van szükséged. Nincs szükséged pihenésre, és csak fele annyi üzemanyagra van szükséged.',
      },
      {
        desc: 'A generációs tapasztalatod miatt a történelem és a mérnöki munka próbáira előnyt kapsz.',
      },
    ],
    homes: [
      {
        desc: 'A Nagy Műhelyben nőttél fel, ahol az Alkotó utolsó műhelye áll. Itt tanultad meg a legősibb mesterségeket és a gépek készítésének titkait.',
        bonus: [
          { name: 'Mérnöki munka', mod: '+1' },
          { name: 'Történelem', mod: '+1' },
        ],
      },
      {
        desc: 'Egy Elhagyatott Műhelyben ébredtél, ahol egyedül kellett felfedezned a világot. Itt tanultad meg a túlélést és a önálló problémamegoldást.',
        bonus: [
          { name: 'Túlélés', mod: '+1' },
          { name: 'Megfigyelés', mod: '+1' },
        ],
      },
      {
        desc: 'A Tanítók Között nevelkedtél, ahol a Fenntartók az új generációkat oktatják. Itt sajátítottad el a tanítás és vezetés művészetét.',
        bonus: [
          { name: 'Tanítás', mod: '+1' },
          { name: 'Vezetés', mod: '+1' },
        ],
      },
      {
        desc: 'A Háború Múzeumában éltél, ahol a régi fegyverek és harci gépek között nőttél fel. Itt tanultad meg a harci technikákat és a hadtörténelmet.',
        bonus: [
          { name: 'Fegyverhasználat', mod: '+1' },
          { name: 'Hadtörténelem', mod: '+1' },
        ],
      },
      {
        desc: 'A Város Alatti Bunkerben találtak, ahol egy rejtett műhelyben éltél. Itt tanultad meg a rejtőzködés és a titkos munkálatok fortélyait.',
        bonus: [
          { name: 'Rejtőzés', mod: '+1' },
          { name: 'Barkácsolás', mod: '+1' },
        ],
      },
      {
        desc: 'A Pusztulás Központjában ébredtél, ahol egy katasztrófa után segítettél a többi automa megmentésében. Itt tanultad meg a gyógyítás és a közösségi szervezés alapjait.',
        bonus: [
          { name: 'Gyógyítás', mod: '+1' },
          { name: 'Közösség', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'automa_utodok',
    name: 'Automa model 2.0 - Utódok',
    desc: 'Az utódok kinézetre olyan tökéletesen hasonlítanak az emberre, hogy képesek a városokban is észrevétlenül elvegyülni, szerszámok és durva nyersanyagok helyett a Nagy Műhely legújabb alkatrészei, több tucat fogaskerék és drótkötél irányítja a mozdulataidat.',
    img: 'gepszulottek/automa2.webp',
    speciesSpecial: [
      {
        desc: 'Emberszerű megjelenésed lehetővé teszi, hogy észrevétlenül vegyülj el az emberek között. Szárazföldi településeken a rejtőzködés próbáidra előnyt kapsz.',
      },
      {
        desc: 'A fejlett mechanizmusod precíz mozdulatokat tesz lehetővé. Bonyolult szerkezetek kezelésére és finom motorikát igénylő feladatokra előnyt kapsz.',
      },
      {
        desc: 'A tökéletesített vázad ellenállóbbá tett a környezeti hatásokkal szemben. Természetes védelmed +1, és immunis vagy a mérgekre és betegségekre.',
      },
      {
        desc: 'A fejlett érzékelőid lehetővé teszik, hogy észrevegyél apró részleteket. Megfigyelés próbáidra előnyt kapsz, különösen mesterséges környezetben.',
      },
      {
        desc: 'Képes vagy hangokat és beszédet tökéletesen utánozni. Megtévesztés és színlelés próbáidra előnyt kapsz, amikor hangot használsz.',
      },
      {
        desc: 'A fejlett energiaellátásod lehetővé teszi, hogy hosszabb ideig működj fáradtság nélkül. Nincs szükséged pihenésre, és csak negyed annyi üzemanyagra van szükséged.',
      },
    ],
    homes: [
      {
        desc: 'A Nagy Műhelyben születtél, ahol a legmodernebb technológiával készítettek el. Itt tanultad meg a legújabb fejlesztéseket és a technológia legmagasabb fokát.',
        bonus: [
          { name: 'Mérnöki munka', mod: '+1' },
          { name: 'Technológia', mod: '+1' },
        ],
      },
      {
        desc: 'Egy Emberi Város közepén éltél, ahol titokban integrálódtál a társadalomba. Itt tanultad meg az emberi szokásokat és a társadalmi dinamikákat.',
        bonus: [
          { name: 'Társadalom ismeret', mod: '+1' },
          { name: 'Színlelés', mod: '+1' },
        ],
      },
      {
        desc: 'A Diplomáciai Testületben szolgáltál, ahol az automaták és emberek kapcsolatát építed. Itt sajátítottad el a diplomácia és tárgyalás művészetét.',
        bonus: [
          { name: 'Diplomácia', mod: '+1' },
          { name: 'Tárgyalás', mod: '+1' },
        ],
      },
      {
        desc: 'A Kutatólaboratóriumban dolgoztál, ahol az új technológiákat fejlesztették. Itt tanultad meg a kutatás és fejlesztés fortélyait.',
        bonus: [
          { name: 'Kutatás', mod: '+1' },
          { name: 'Fejlesztés', mod: '+1' },
        ],
      },
      {
        desc: 'A Városi Alvilágban éltél, ahol az automaták titokban segítik egymást. Itt tanultad meg a titkos kommunikáció és az alvilági élet módjait.',
        bonus: [
          { name: 'Titkos kommunikáció', mod: '+1' },
          { name: 'Utcai élet', mod: '+1' },
        ],
      },
      {
        desc: 'A Határőrségnél szolgáltál, ahol az emberek és automaták határait őrizted. Itt tanultad meg a határok és a biztonsági protokollok ismeretét.',
        bonus: [
          { name: 'Biztonsági protokollok', mod: '+1' },
          { name: 'Határőrizet', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'automa_orzok',
    name: 'Automa custodi 0.5 - Örzők',
    desc: 'A fejlődés a természetünk része, viszont nem mindig önkéntes. A világ kegyetlensége kegyetlen megoldásokat hoz magával. Az Automa Custodi a legújabb modell ami az összes alap funkciót csak mint szükségesség tudja teljesíteni, a gyengébb motor funkciókért cserébe a custodi megtestesíti a hús és vér félelmet ami a megalkotásukhoz vezetett. Egy gyilkológép aminek nem kell se alvás se evés, akin nem fog se fegyver se mágikus penge. Egy custodi képes hordákat elpusztítani és ha minden egye fogaskerék is eltörik benne újra építik őket napok alatt.',
    img: 'gepszulottek/automacustodi.webp',
    speciesSpecial: [
      {
        desc: 'Nem szükséges alvás vagy táplálék a működésedhez. Immunis vagy az éhség, szomjúság és fáradtság hatásaira.',
      },
      {
        desc: 'A gyilkológép tervezésed lehetővé teszi, hogy félelmet kelts ellenfeleidben. Az ellenséges lények első félelempróbájára hátránnyal dobnak.',
      },
      {
        desc: 'A rendkívül szívós konstrukciód +3 természetes védelmet ad, és a fizikai fegyverek csak fele annyi sebzést okoznak.',
      },
      {
        desc: 'Képes vagy önállóan helyreállni. Minden hosszú pihenésnél visszakapsz 3 életerőt, és a súlyos sérülések is gyorsan javíthatók.',
      },
      {
        desc: 'A harcra optimalizált érzékelőid lehetővé teszik, hogy tökéletesen elemezd az ellenfeleidet. Harc elején az ellenfelek egy gyengeségét felismerheted.',
      },
      {
        desc: 'A mágikus penge ellen védett konstrukcióval rendelkezel. A mágikus támadások csak fele annyi sebzést okoznak.',
      },
    ],
    homes: [
      {
        desc: 'A Frontvonalakon szolgáltál, ahol a legkeményebb harcok folytak. Itt tanultad meg a csatatéri stratégiákat és a tömeges harc technikáit.',
        bonus: [
          { name: 'Csatatéri stratégiák', mod: '+1' },
          { name: 'Tömeges harc', mod: '+1' },
        ],
      },
      {
        desc: 'A Határerődökben állomásoztál, ahol a legveszélyesebb területeket őrizted. Itt sajátítottad el a őrjárat tartás és a határvédelem fortélyait.',
        bonus: [
          { name: 'Őrjárat tartás', mod: '+1' },
          { name: 'Határvédelem', mod: '+1' },
        ],
      },
      {
        desc: 'A Városi Zendülés Elleni Egységnél szolgáltál, ahol a belső konfliktusokat kellett felszámolnod. Itt tanultad meg a zavargások elfojtását és a városharc technikáit.',
        bonus: [
          { name: 'Zavargás elfojtás', mod: '+1' },
          { name: 'Városharc', mod: '+1' },
        ],
      },
      {
        desc: 'A Légiós Egység tagja voltál, ahol a legnehezebb küldetéseket hajtottátok végre. Itt tanultad meg a különleges műveletek végrehajtását és a csapatmunkát.',
        bonus: [
          { name: 'Különleges műveletek', mod: '+1' },
          { name: 'Csapatmunkák', mod: '+1' },
        ],
      },
      {
        desc: 'A Pusztulás Központjában harcoltál, ahol a legnagyobb veszélyekkel néztél szembe. Itt sajátítottad el a túlélést extrém körülmények között és a katasztrófahelyzetek kezelését.',
        bonus: [
          { name: 'Extrém túlélés', mod: '+1' },
          { name: 'Katasztrófa kezelés', mod: '+1' },
        ],
      },
      {
        desc: 'A Mentőakciók Hőseként szolgáltál, ahol a civilek mentése volt a feladatod. Itt tanultad meg a mentési technikákat és a védelmet elsődleges feladatként.',
        bonus: [
          { name: 'Mentési technikák', mod: '+1' },
          { name: 'Védelmi taktikák', mod: '+1' },
        ],
      },
    ],
  },
];

const atkozottak: SpeciesInterface[] = [
  {
    id: 'abominus',
    name: 'Abominus',
    desc: 'Az emberi test csodálatos. Az abominus nem egy félrement kísérlet vagy sötét mágia szüleménye miatt létrejött faj, ha lehet egyáltalán fajnak nevezni őket. Nem, ők egy egyszerű piaci űr betöltése miatt születtek a világunkra amit a háborúk, éhínség és gyári balesetek keltettek, egy űr aminek a betöltése hús és vért igényelt. Az abominus alkotói a még parázsló csatatereket és feketébe borult kórházakat járják és emberi alkatrészeket gyűjtenek az alkotásaikhoz. Csontot forrasztanak, húst fonnak és bőrt szabnak. Egyes alkotásaik olyan jól sikerülnek hogy fel se tűnne először hogy több tucat ember részeiből épülnek fel, ha nem lennének ott a mágiával összeforrasztott varratok. Persze a lélek megépítése egy külön problémát dobott fel, hiszen a emberi testrészekben megmaradtak a gazdájuknak valamely darabja. Az első „sikeres" kísérletek instabilak voltak, lélekdarabok harcoltak az irányításért egy testben ami nem az övék volt, nem teljesen. Viszont a tudomány és a mágia fejlődésével rájöttek hogy ezeket a megmaradt energiákat ahelyett hogy elnyomnánk fel is használhatjuk hogy egy új lelket alkossunk a régiek személyiségjegyeivel. Egyes történetek szerint a húsműhely most egy isteni lény megalkotásával próbálkozik, amivel a fellázadt abominusokat irányítani tudnák, még nem lehet sokat tudni erről a kísérletről azon kívül hogy a neve Rebis. Abominusként érzed minden végtagodat mintha a sajátod lenne, alszol, eszel, érzel, és még is undorral néznek rád az emberek, halál utáni lényként. Istentelen vagy, több közöd van az Automákhoz mint az emberekhez. Háborúra vagy munkára alkottak de egy hibát nem tudtak kijavítani az alkotóid, a szabad akaratod. A jobb esetben minőségi „alkatrészeid" miatt gyorsabb és erősebb vagy mint sok halandó, de csak ha sikerül megtanulnod az új tested irányítását.',
    img: 'atkozottak/abominus.webp',
    speciesSpecial: [
      {
        desc: 'A különböző testrészek különböző erősségeket képviselnek. Minden akciónál 2d10-et dobsz a d20 helyett, a magasabb értéket használva előnyre, az alacsonyabbat hátrányra.',
      },
      {
        desc: 'Képes vagy testrészeket cserélni. Pihenésnél egy testrész funkcióját átmenetileg fejlesztheted, de egy másik testrész funkciója eközben gyengül.',
      },
      {
        desc: 'Az emberi fajok ösztönösen félnek tőled. Az emberi ellenfelek első támadásukra hátránnyal dobnak.',
      },
      {
        desc: 'A különböző testrészek különböző tulajdonságokkal rendelkeznek. Választhatsz egy testrészt, ami +1 tulajdonságot ad, de egy másik testrész -1 tulajdonsággal rendelkezik.',
      },
      {
        desc: 'A mágikus varratok védelmet nyújtanak. Természetes 2 védelmet kapsz, és a mágikus támadások ellen +1 védelmet.',
      },
      {
        desc: 'A különböző lélekdarabok különböző képességeket adnak. Naponta egyszer használhatsz egy speciális képességet, ami a testrészeid egyikéből származik.',
      },
    ],
    homes: [
      {
        desc: 'A Húsműhelyben születtél, ahol az első abominusokat alkották. Itt tanultad meg a testrészek cseréjének és karbantartásának fortélyait.',
        bonus: [
          { name: 'Testrész csere', mod: '+1' },
          { name: 'Karbantartás', mod: '+1' },
        ],
      },
      {
        desc: 'Egy Elhagyatott Kórházban éltél, ahol a testrészeket gyűjtötték. Itt sajátítottad el az anatómia és a gyógyítás alapjait.',
        bonus: [
          { name: 'Anatómia', mod: '+1' },
          { name: 'Gyógyítás', mod: '+1' },
        ],
      },
      {
        desc: 'A Csatamezők Közt nőttél fel, ahol a holtak testrészeiből állítottak össze. Itt tanultad meg a túlélést és a harci technikákat.',
        bonus: [
          { name: 'Túlélelés', mod: '+1' },
          { name: 'Harci technikák', mod: '+1' },
        ],
      },
      {
        desc: 'A Titkos Laboratóriumban alkottak meg, ahol a legújabb kísérleteket végezték. Itt tanultad meg a mágia és tudomány kombinálását.',
        bonus: [
          { name: 'Mágia használat', mod: '+1' },
          { name: 'Tudomány', mod: '+1' },
        ],
      },
      {
        desc: 'A Lázadók Között nevelkedtél, akik szabad akaratukat követik. Itt sajátítottad el a szabadság és a lázadás értékét.',
        bonus: [
          { name: 'Szabadság', mod: '+1' },
          { name: 'Lázadás', mod: '+1' },
        ],
      },
      {
        desc: 'A Árva Gyűjtőhelyen találtak, ahol a elveszett abominusokat gyűjtik. Itt tanultad meg a közösséget és a segítségnyújtást.',
        bonus: [
          { name: 'Közösség', mod: '+1' },
          { name: 'Segítségnyújtás', mod: '+1' },
        ],
      },
    ],
  },
  {
    id: 'vampirok',
    name: 'Vámpírok',
    desc: 'Vérszívók, dögevők, ragadozók. Az ember embernek vámpírja. Ezeket a lényeket nem is lehet igazán külön fajnak mondani, helyesebb egy átoknak nevezni őket, a lélek betegségének a testre terjedése. Az éhínség ami feneketlenül tombol bennünk, a vágyaink amiket próbálunk bármi áron kielégíteni. Az első vámpírok irónikusan a nemesek közül kerültek ki, egy megrontott mágus átka vagy a fajunk természetes következő lépése, az elszenvedőinek nem volt esélye kideríteni a kórság igazi okát. Tudósok azzal magyarázzák a vámpirizmust hogy egy hiba miatt az érintettek szervezete nem tudja már feldolgozni a sima táplálékokban található mágiát, emiatt a lelkük éhezik még ha a testük nem is. A vér viszont, a vérben lévő mágia nyers és energiával dús, nem hiába sok kísérlet és szertartás központi eleme. Az állatok vére sem rossz, de csak a megvonás tüneteit tudod vele távol tartani. Ha kielégíted az étvágyad és embervért iszol; erősebbnek, gyorsabbnak és okosabbnak fogod érezni magad mint valaha. A tátongó üresség a lelked mélyén egy pillanatra megtelik forró, vörös mámorral majd az érzés elszáll egy még nagyobb űrt maga után hagyva. Ha újra és újra kielégíted a szomjad a tested elkezd egyre inkább az új életmódodhoz alkalmazkodni, erősebb, nagyobb agyarak, meghosszabbodott karmos kezek és elnyúlt, halk léptű lábak. Persze ezeket egy ideig tökéletesen bírod titkolni a többi ember elől, hiszen milyen ragadozó az ami felfedi magát a prédái előtt? A szemeid tökéletesen látnak a teljes sötétségben is, de a lámpásnál nagyobb fényforrások megvakítanak. Ha az átok elég mélyre marja magát a testedben, bekövetkezik az átváltozás. Levedled az emberi álcádat és teljesen átadod magad az éhségnek, éjjelente portyázod a falvakat és városokat, a penge hosszúságú karmaiddal védtelen embereket gyilkolsz és begyűjtöd a kincseiket. Amikor magadhoz térsz...',
    img: 'atkozottak/vampir.webp',
    speciesSpecial: [
      {
        desc: 'Az éhség tombol benned. Ha kielégíted vérrel, +1 erőt, gyorsaságot és intelligenciát kapsz 24 órára. Állatvérrel csak a megvonás tüneteit távolítod el.',
      },
      {
        desc: 'Tökéletesen látsz a sötétben, de a lámpásnál nagyobb fényforrások megvakítanak. Sötétben a megfigyelésre előnyt kapsz, erős fényben hátránnyal.',
      },
      {
        desc: 'Képes vagy halk léptekkel járni és álcázni magad. Rejtőzés és csendesség próbáidra előnyt kapsz, különösen éjszaka.',
      },
      {
        desc: 'Az átok fokozatosan átalakítja a tested. Idővel nagyobb agyarak, hosszabb karmaik és elnyúlt végtagok nőnek. Közelharcban +1 sebzést kapsz.',
      },
      {
        desc: 'Az éhség és a vágyak irányítanak. Ha nem kielégíted a szomjad, a stressz próbáidra hátránnyal dobsz.',
      },
      {
        desc: 'Az átváltozás után teljesen átadod magad az éhségnek. Ebben az állapotban +2 támadást és sebzést kapsz, de nem tudsz különböző emberekkel együttműködni.',
      },
    ],
    homes: [
      {
        desc: 'Ördöglakatosként nőttél fel, ahol a titkokat és a rejtélyeket tanultad. Itt sajátítottad el a titoktartás és a rejtélyek megoldásának művészetét.',
        bonus: [
          { name: 'Titoktartás', mod: '+1' },
          { name: 'Rejtélyek megoldása', mod: '+1' },
        ],
      },
      {
        desc: 'Alkimistaként tanultál, ahol a vegyészet és a mágia titkait fedezted fel. Itt tanultad meg az alkímiát és a különböző anyagok keverését.',
        bonus: [
          { name: 'Alkímia', mod: '+1' },
          { name: 'Anyagismeret', mod: '+1' },
        ],
      },
      {
        desc: 'Adeptként (fiatal boszorkánytanoncként) kezdtél, ahol a mágia alapjait sajátítottad el. Itt tanultad meg a mágia használatát és a szertartásokat.',
        bonus: [
          { name: 'Mágia használat', mod: '+1' },
          { name: 'Szertartások', mod: '+1' },
        ],
      },
      {
        desc: 'Zenészként nőttél fel, ahol a hangok és ritmusok világában éltél. Itt tanultad meg a zene és a hangok használatát, valamint az attunement pointok gyűjtését.',
        bonus: [
          { name: 'Zene', mod: '+1' },
          { name: 'Attunement', mod: '+1' },
        ],
      },
      {
        desc: 'Nemesi családból származol, ahol az első vámpírok is megjelentek. Itt tanultad meg az udvari etikettet és a társadalmi dinamikákat.',
        bonus: [
          { name: 'Udvari etikett', mod: '+1' },
          { name: 'Társadalmi dinamikák', mod: '+1' },
        ],
      },
      {
        desc: 'Utcai árjaként nőttél fel, ahol a túlélés volt az elsődleges. Itt tanultad meg az utcai élet fortélyait és a gyors gondolkodást.',
        bonus: [
          { name: 'Utcai élet', mod: '+1' },
          { name: 'Gyors gondolkodás', mod: '+1' },
        ],
      },
    ],
  },
];

export interface SpeciesInterface {
  id: string;
  name: string;
  desc: string;
  img: string;
  speciesSpecial: Array<{ desc: string }>;
  homes: { desc: string; bonus: { name: string; mod: string }[] }[];
}

export const species: Record<string, SpeciesInterface[]> = {
  folyokoz: folyokoz,
  toronyvarosok: toronyvarosok,
  novenyszerzetek: novenyszerzetek,
  kelet_nepe: keletNepe,
  gepszulottek: gepszulottek,
  atkozottak: atkozottak,
};
