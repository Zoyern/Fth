(function (window) {
  // You can enable the strict mode commenting the following line  
  // 'use strict';


  // This function will contain all our code
  function Fth() {
    var _fthObject = {};

    // This variable will be inaccessible to the user, only can be visible in the scope of your library.
    var settings = {
      page: null,
      loading: false,
      isFirstLoad: true
    };

    var param = {
      jsonLength: undefined,
      loadsucces: undefined,
      fetchPass: undefined
    }

    _fthObject.getSettings = function () {
      var mySecurityCopy = {};

      for (var i in settings) {
        if (i) {
          mySecurityCopy[i] = settings[i];
        }
      }

      return mySecurityCopy;
    };

    _fthObject.active = function () {
      return settings.page;
    };

    _fthObject.isLoading = function () {
      return settings.loading;
    };


    //--------------------------------------------------*

    _fthObject.Initialize = function () {
      fetch('initialize.json')
        .then(response => response.json())
        .then(json => {
          const myjsonArray = json["Init"];
          fetchHtml(myjsonArray[0].pathLoader,'#loader');
          setTimeout(() => {
            fetchHtml(myjsonArray[0].pathHome, '#app');
          }, 1000);


        });
    }

    _fthObject.SetNewPage = function (_path) {
      fetchHtml(_path, '#app');
    }

    function fetchHtml(_path, content) {
      settings.loading = true;

      if (param.isFirstLoad) {
        console.log("Starting loading base pages");
      } else {
        document.getElementById('loader').style.visibility = 'visible';
      }
      //récuperation des donné dans le dossier pages/ + le path du fichier + .html 
      fetch('pages/' + _path + '.html')
        .then(response => response.text())
        .then(text => {

          //recup du content et y inserer le text comme nouveau html
          document.querySelector(content).innerHTML = text;

          settings.page = _path;
          //change actual page with the new pages
          //call tout les component qui sont a charger dans la page
          addContentToPage(_path);
        });
    }

    function addContentToPage(_path) {
      fetch('./json/' + _path + '.json')
        .then(response => response.json())
        .then(json => {
          const myjsonArray = json[_path];

          param.jsonLength = myjsonArray.length;
          param.loadsucces = 0;
          param.fetchPass = 0;
          var aray;
          myjsonArray.forEach(obj => {
            aray = [];
            Object.entries(obj).forEach(([key, value]) => {
              aray.push(value);
            });

            callBackContent(aray);
            console.log('-------------------');
          });
        });
    }

    function callBackContent(array) {
      try {
        //récuperation des donné dans le dossier pages/ + le path du fichier + .html 
        fetch('pages/' + array[1] + '/' + array[2] + '.html')
          .then(response => response.text())
          .then(text => {

            //recup du content et y inserer le text comme nouveau html
            document.getElementById(array[3]).innerHTML = text;
            AllContentCharged(true);
          });
      } catch (error) {
        AllContentCharged(false);
      }
    };

    function AllContentCharged(succes) {
      param.fetchPass += 1;
      if (succes) {
        console.log('charger avec succes')
        param.loadsucces += 1;
      }
      else {
        console.log('loupé  !')
      }

      if (param.fetchPass == param.jsonLength) {
        if (param.jsonLength == param.loadsucces) {
          console.log("tout les content on été charger");
          callbackFetch();
        } else {
          console.log("Un/des content n'on pas été charger corectement ! (" + (param.jsonLength - param.loadsucces) + '/' + param.jsonLength + ').')
        }
      }
    }

    function callbackFetch() {
      //console.log("page charger");
      settings.loading = false;
      //change url
      history.pushState({ pageID: settings.page }, settings.page, '/');

      if (param.isFirstLoad) {
        param.isFirstLoad = false;
      } else {
        setTimeout(() => {
          document.getElementById('loader').style.visibility = 'hidden';
        }, 1000);
      }

      //console.log(history.state);
      CallBackPage(settings.page);
    }




    return _fthObject;
  }

  // We need that our library is globally accesible, then we save in the window
  if (typeof (window.Fth) === 'undefined') {
    window.Fth = Fth();
  }
})(window); // We send the window variable withing our function