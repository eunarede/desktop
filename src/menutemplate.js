import remote from 'remote';
import shell from 'shell';
import router from './router';
import metrics from './utils/MetricsUtil';
import util from './utils/Util';

var dialog = remote.require('dialog');
var app = remote.require('app');

// main.js
var MenuTemplate = function () {
  return [
    {
      label: 'Iternyx VPN',
      submenu: [
      {
        label: 'Sobre a Iternyx VPN',
        click: function () {
          metrics.track('Opened About', {
            from: 'menu'
          });
          router.get().transitionTo('about');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Minimizar Iternyx VPN',
        accelerator: util.CommandOrCtrl() + '+H',
        selector: 'hide:'
      },
      {
        label: 'Minimizar Outros',
        accelerator: util.CommandOrCtrl() + '+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Exibir Tudo',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: util.CommandOrCtrl() + '+Q',
        click: function() {
          app.quit();
        }
      }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+' + util.CommandOrCtrl() + '+I',
          click: function() { remote.getCurrentWindow().toggleDevTools(); }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
      {
        label: 'Minimize',
        accelerator: util.CommandOrCtrl() + '+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: util.CommandOrCtrl() + '+W',
        click: function () {
          remote.getCurrentWindow().hide();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Issue or Suggest Feedback',
          click: function () {
            metrics.track('Opened Issue Reporter', {
              from: 'menu'
            });
            shell.openExternal('https://github.com/vpnht/desktop/issues/new');
          }
        }
      ]
    }
  ];
};

module.exports = MenuTemplate;
