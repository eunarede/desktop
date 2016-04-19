require.main.paths.splice(0, 0, process.env.NODE_PATH);
import remote from 'remote';
import React from 'react';
import ipc from 'ipc';
import metrics from './utils/MetricsUtil';
import VPN from './utils/VPNUtil';
import vpnActions from './actions/VPNActions';
import template from './menutemplate';
import webUtil from './utils/WebUtil';
import request from 'request';
import path from 'path';
import Router from 'react-router';
import routes from './routes';
import routerContainer from './router';
import log from './stores/LogStore';
import accountStore from './stores/AccountStore';
import utils from './utils/Util';
import Credentials from './utils/CredentialsUtil';

import Settings from './utils/SettingsUtil';

var app = remote.require('app');
var Menu = remote.require('menu');

// Init process
log.initLogs(app.getVersion());
VPN.initCheck();
webUtil.addLiveReload();
webUtil.addBugReporting();
webUtil.disableGlobalBackspace();
Menu.setApplicationMenu(Menu.buildFromTemplate(template()));
metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(function() {
	metrics.track('app heartbeat');
}, 14400000);
var router = Router.create({
	routes: routes
});

router.run(Handler => React.render( < Handler / > , document.body));
routerContainer.set(router);

// Default Route
router.transitionTo('dashboard');
ipc.on('application:quitting', () => {});

// Event fires when the app receives a vpnht:// URL
ipc.on('application:open-url', opts => {
	console.log('open', opts);
});

ipc.on('application:vpn-connect', () => {
	if (Credentials._config()) {
		vpnActions.connect({
			username: Credentials.get().username,
			password: Credentials.get().password,
			server: Settings.get('server') || 'hub.vpn.ht'
		});
	} else {
		log.error('No user/pass saved in the hash.\n\nTIPS: Try to connect manually first to save your data.')
	}
});

ipc.on('application:vpn-check-disconnect', () => {
	if (accountStore.getState().connecting || accountStore.getState().connected) {
		log.info('Desconectando antes de encerrar o aplicativo');
		vpnActions.disconnect();
	} else {
		vpnActions.disconnected();
	}
});

ipc.on('application:vpn-check-sleep', () => {
	if (accountStore.getState().connected) {
		log.info('Tentando reconexão após a hibernação');
		if (Credentials._config()) {
			vpnActions.connect({
				username: Credentials.get().username,
				password: Credentials.get().password,
				server: Settings.get('server') || 'hub.vpn.ht'
			});
		} else {
			log.info('No user/pass saved in the hash, now disconnecting.');
			vpnActions.disconnect();
		}
	}
});

ipc.on('application:vpn-disconnect', () => {
	vpnActions.disconnect();
});

module.exports = {
	router: router
};
