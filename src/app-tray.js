import Menu from 'menu';
import MenuItem from 'menu-item';
import Tray from 'tray';
import ipc from 'ipc';

var trayMenuDisconnected = null;
var trayMenuConnected = null;
var trayMenuConnecting = null;

// Define a function to set up our tray icon
exports.init = function(helper) {

	// Disconnected State
	trayMenuDisconnected = new Menu();
	trayMenuDisconnected.append(new MenuItem({
		label: 'Abrir IternyxVPN',
		click: helper.toggleVisibility
	}));
	trayMenuDisconnected.append(new MenuItem({
		type: 'separator'
	}));
	trayMenuDisconnected.append(new MenuItem({
		label: 'Conectado',
		click: helper.connect
	}));
	trayMenuDisconnected.append(new MenuItem({
		label: 'Disconectado',
		enabled: false
	}));
	trayMenuDisconnected.append(new MenuItem({
		type: 'separator'
	}));
	trayMenuDisconnected.append(new MenuItem({
		label: 'Sair',
		click: helper.quit
	}));

	// Connected State
	trayMenuConnected = new Menu();
	trayMenuConnected.append(new MenuItem({
		label: 'Mostrar Janela',
		click: helper.toggleVisibility
	}));
	trayMenuConnected.append(new MenuItem({
		type: 'separator'
	}));
    trayMenuConnected.append(new MenuItem({
		label: 'Conectado',
		enabled: false
	}));
	trayMenuConnected.append(new MenuItem({
		label: 'Desconectado',
		click: helper.disconnect
	}));
	trayMenuConnected.append(new MenuItem({
		type: 'separator'
	}));
	trayMenuConnected.append(new MenuItem({
		label: 'Sair',
		click: helper.quit
	}));

	// Connecting State
	trayMenuConnecting = new Menu();
	trayMenuConnecting.append(new MenuItem({
		label: 'Mostrar Janela',
		click: helper.toggleVisibility
	}));
	trayMenuConnecting.append(new MenuItem({
		type: 'separator'
	}));
    trayMenuConnecting.append(new MenuItem({
		label: 'Cancelar conexão...',
		click: helper.disconnect
	}));
	trayMenuConnecting.append(new MenuItem({
		label: 'Desconectado',
		enabled: false
	}));
	trayMenuConnecting.append(new MenuItem({
		type: 'separator'
	}));
	trayMenuConnecting.append(new MenuItem({
		label: 'Sair',
		click: helper.quit
	}));


	var tray = new Tray(__dirname + '/tray.png');
	tray.setContextMenu(trayMenuDisconnected);

	tray.on('clicked', helper.toggleVisibility);

	ipc.on('vpn.connected', function handleConnected() {
		tray.setContextMenu(trayMenuConnected);
		tray.setImage(__dirname + '/tray_connected.png');
    	tray.setToolTip('Connected');
	});

	ipc.on('vpn.connecting', function handleConnecting() {
		tray.setContextMenu(trayMenuConnecting);
		tray.setImage(__dirname + '/tray_connecting.png');
    	tray.setToolTip('Connecting...');
	});

	ipc.on('vpn.disconnected', function handleDisconnected() {
		tray.setContextMenu(trayMenuDisconnected);
		tray.setImage(__dirname + '/tray.png');
    	tray.setToolTip('Disconnected');
	});

};
