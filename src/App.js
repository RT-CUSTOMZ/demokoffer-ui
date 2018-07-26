import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Mqtt from './Mqtt'

import './App.css';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Picoflasher from './Components/Picoflasher';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picoflasher: {},
            mqttConnection: 'offline',
            buttonConnection: 'offline',
        };
    }

    componentDidMount() {
        this.mqttClient = new Mqtt('ws://192.168.0.2:9001/');
        this.mqttClient.on("picoflasherStatus", (picoState) => {
            console.log(picoState);
            this.setState({
                picoflasher: picoState
            });
        });
        this.mqttClient.on("buttonStatus", (buttonStatus) => {
            this.setState({
                buttonConnection: buttonStatus,
            });
        });
        this.mqttClient.on("connect", () => {
            this.setState({
                mqttConnection: 'connected',
            });
        });
        this.mqttClient.on("reconnect", () => {
            this.setState({
                mqttConnection: 'reconnect',
            });
        });
        this.mqttClient.on("close", () => {
            this.setState({
                mqttConnection: 'offline',
                picoflasher: {},
                buttonConnection: 'offline',
            });
        });
    }

    componentWillUnmount()
    {
        if(this.mqttClient !== null)
            this.mqttClient.end();
    }

    // Grid has a spacing bug
    // See: https://github.com/mui-org/material-ui/issues/7466

  render() {
      const {
          picoflasher,
          mqttConnection,
          buttonConnection
      } = this.state;
    return (
        <React.Fragment>
            <CssBaseline>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography
                            variant="title"
                            color="inherit"
                            style={{flexGrow: 1}}
                        >
                            RT-Demokoffer
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onPointerDown={(() => {this.mqttClient.flashOff()})}
                        >
                            Artnet On
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onPointerDown={(() => {this.mqttClient.flashOn()})}
                        >
                            Green
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onPointerDown={(() => {this.mqttClient.flashOn()})}
                            onPointerUp={(() => {this.mqttClient.flashOff()})}
                        >
                            Flash
                        </Button>
                        <Typography
                            variant="title"
                            color="inherit"
                        >
                            Button:
                            <span
                                className={buttonConnection}
                            />
                        </Typography>
                        <Typography
                            variant="title"
                            color="inherit"
                        >
                            Mqtt:
                            <span
                                className={mqttConnection}
                            />
                        </Typography>
                    </Toolbar>
                </AppBar>
              <div
                  className="App"
                  style={{ padding: 5 }}
              > {/*{ style see grid bug!}*/}

                  <Grid container
                        spacing={0}
                  > {/*{ spacing see grid bug!}*/}
                  {
                      Object.keys(picoflasher).map(key => (
                          <Grid item
                                xs={3}
                                style={{ padding: 5 }}
                                key={key}>
                              <Picoflasher
                                  id={key}
                                  state={picoflasher[key].state}
                                  temperature={picoflasher[key].temperature }
                              />
                          </Grid>
                          )
                      )
                  }
                  </Grid>
              </div>
            </CssBaseline>
        </React.Fragment>
    );
  }
}

export default App;
