import React from 'react/addons';
import metrics from '../utils/MetricsUtil';
import Router from 'react-router';
import Select from 'react-select';
import VPN from '../utils/VPNUtil';
import Settings from '../utils/SettingsUtil';

var Preferences = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function () {
    return {
      metricsEnabled: metrics.enabled(),
      launchStartup: Settings.get('launchStartup'),
      launchStartupHidden: Settings.get('launchStartupHidden'),
      connectLaunch: Settings.get('connectLaunch'),
      saveCredentials: Settings.get('saveCredentials'),
      autoPath: Settings.get('autoPath'),
      //disableSmartdns: Settings.get('disableSmartdns') ,
      encryption: Settings.get('encryption') || 128,
      customPort: Settings.get('customPort') || 'default',
      minToTaskbar: Settings.get('minToTaskbar')
  	};
  },

  handleChangeMetricsEnabled: function (e) {
    var checked = e.target.checked;
    this.setState({
      metricsEnabled: checked
    });
    metrics.setEnabled(checked);
    metrics.track('Toggled util/MetricsUtil', {
      enabled: checked
    });
  },

  handleChangeLaunchStartup: function (e) {

    var checked = e.target.checked;
    this.setState({
      launchStartup: checked
    });

    if (checked) {
        VPN.enableStartOnBoot(this.state.launchStartupHidden);
    } else {
        VPN.disableStartOnBoot();
    }

    // save for future use
    Settings.save('launchStartup', checked);

  },


  handleChangeLaunchStartupHidden: function (e) {

    var checked = e.target.checked;
    this.setState({
      launchStartupHidden: checked
    });

    if (checked) {
        VPN.enableStartOnBoot(true);
    } else {
        VPN.disableStartOnBoot();
    }

    // save for future use
    Settings.save('launchStartupHidden', checked);

  },

  handleChangeDisableSmartdns: function (e) {

    var checked = e.target.checked;
    this.setState({
      disableSmartdns: checked
    });

    // save for future use
    Settings.save('disableSmartdns', checked);

  },

  handleChangeMinToTaskbar: function (e) {

    var checked = e.target.checked;
    this.setState({
      minToTaskbar: checked
    });

    // save for future use
    Settings.save('minToTaskbar', checked);

  },


  handleChangeConnectLaunch: function (e) {

    var checked = e.target.checked;
    this.setState({
      connectLaunch: checked
    });

    // save for future use
    Settings.save('connectLaunch', checked);

  },

  handleChangeAutoPath: function (e) {

    var checked = e.target.checked;
    this.setState({
      autoPath: checked
    });

    // 64b not available with autoPath
    if (this.state.encryption == 64) {
        this.handleEncryptionChange(128);
    }

    // save for future use
    Settings.save('autoPath', checked);

  },

  handleEncryptionChange: function (encryption) {

    this.setState({encryption});
    this.handlePortChange('default');
    Settings.save('encryption', encryption);

  },

  handlePortChange: function (customPort) {

    this.setState({customPort});
    Settings.save('customPort', customPort);

  },



  render: function () {


    var encryptions;
    var ports;

    if (this.state.autoPath) {
        encryptions = [
            { value: 128, label: '128 BIT AES' },
            { value: 256, label: '256 BIT AES' }
        ];
    } else {
        encryptions = [
            { value: 64, label: '64 BIT BLOWFISH' },
            { value: 128, label: '128 BIT AES' },
            { value: 256, label: '256 BIT AES' }
        ];
    }


    if (this.state.encryption == 64) {
        ports = [
            { value: 'default', label: 'UDP - Default' }
        ];
    } else if (this.state.encryption == 128) {
        ports = [
            { value: 'default', label: 'UDP - Default' },
            { value: 53, label: 'UDP - 53' },
            { value: 443, label: 'TCP - 443' },
            { value: 80, label: 'TCP - 80' }
        ];
    } else if (this.state.encryption == 256) {
        ports = [
            { value: 'default', label: 'UDP - Default' },
            { value: 3389, label: 'UDP - 3389' }
        ];
    }


    var customPort = "";
    if (!this.state.autoPath) {
        customPort = (
            <section className="preferences">
                <h1 className="title">Custom Port</h1>
                <div className="selectbox">
                    <Select
                        name="customPort"
                        value={this.state.customPort}
                        options={ports}
                        onChange={this.handlePortChange}
                        searchable={false}
                        clearable={false}
                    />
                </div>
            </section>
        );
    }

    return (
      <div className="content-scroller" id="content">

        <section>
                <h1 className="title">General</h1>

                <div className="checkbox">
                    <input id="reportAnon" type="checkbox" checked={this.state.metricsEnabled} onChange={this.handleChangeMetricsEnabled}/>
                    <label htmlFor="reportAnon"> </label>
                    <p>Report anonymous usage analytics</p>
                </div>
                <div className="checkbox">
                    <input id="saveCredentials" disabled={!this.state.saveCredentials}  type="checkbox" checked={this.state.connectLaunch && this.state.saveCredentials} onChange={this.handleChangeConnectLaunch}/>
                    <label htmlFor="saveCredentials"> </label>
                    <p>Auto-connect after launch (requires a saved user/pass)</p>
                </div>
                <div className="checkbox">
                    <input id="launchStartup" type="checkbox" checked={this.state.launchStartup} onChange={this.handleChangeLaunchStartup}/>
                    <label htmlFor="launchStartup"> </label>
                    <p>Launch on operating system startup</p>
                </div>
                <div className="checkbox">
                    <input id="launchStartupHidden" type="checkbox" checked={this.state.launchStartupHidden} onChange={this.handleChangeLaunchStartupHidden}/>
                    <label htmlFor="launchStartupHidden"> </label>
                    <p>Launch on operating system startup hidden</p>
                </div>
                <div className="checkbox">
                    <input id="disableSmartdns" type="checkbox" checked={this.state.disableSmartdns} onChange={this.handleChangeDisableSmartdns}/>
                    <label htmlFor="disableSmartdns"> </label>
                    <p>Disable SmartDNS</p>
                </div>
                <div className="checkbox">
                    <input id="minToTaskbar" type="checkbox" checked={this.state.minToTaskbar} onChange={this.handleChangeMinToTaskbar}/>
                    <label htmlFor="minToTaskbar"> </label>
                    <p>Minimize to taskbar</p>
                </div>
        </section>
        <section className="preferences">
            <h1 className="title">Encryption</h1>
            <div className="selectbox">
                <Select
                    name="encryption"
                    value={this.state.encryption}
                    options={encryptions}
                    onChange={this.handleEncryptionChange}
                    searchable={false}
                    clearable={false}
                />
            </div>
        </section>
        {customPort}
        <section className="preferences">
            <h1 className="title">Auto Path</h1>
            <div className="checkbox">
                <input type="checkbox" id="autopath" checked={this.state.autoPath} onChange={this.handleChangeAutoPath} />
                <label htmlFor="autopath"> </label>
                <p>{this.state.autoPath ? 'Enabled' : 'Disabled'}</p>
                <p className="info">Feature that tries alternate ports in order to resolve certain types of connections issues.</p>
            </div>
        </section>
      </div>

    );
  }
});

module.exports = Preferences;
