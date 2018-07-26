import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import { Chart } from 'react-google-charts';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class Picoflaher extends React.Component {

    static flasherNameMap = {
        ESP2d5f5f: 'Pico 1',
        ESP2dab69: 'Pico 2',
        ESPc15599: 'Pico 3',
        ESP2daacd: 'Pico 4',
        ESP2dab58: 'Pico 5',
        ESP2d627d: 'Pico 6',
        ESP2daaec: 'Pico 7',
        ESPcb1565: 'Pico 8'
    };

    render() {
        const {state, temperature, id} = this.props;
        const { classes } = this.props;

        const flasherName = ("ESP"+id in Picoflaher.flasherNameMap) ? Picoflaher.flasherNameMap["ESP"+id] : id;

        return (
            <div>
                <Card className={classes.card}>
                    <CardContent style={{paddingBottom:10, paddingTop:10}}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography
                                    className={classes.title}
                                    color="textSecondary"
                                    component="span"
                                >
                                    {flasherName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    className={state}
                                    color="default"
                                    align="right"
                                    component="span"
                                >
                                    {state}
                                </Typography>
                            </Grid>
                        </Grid>
                            <Chart
                                chartType="Gauge"
                                data={[
                                    ['Label', 'Value'],
                                    ["Temperatur", temperature]
                                ]}
                                options={{
                                    width: 150, height: 150,
                                    redFrom: 60, redTo: 70,
                                    yellowFrom:50, yellowTo: 60,
                                    minorTicks: 5,
                                    max: 70
                                }}
                                graph_id={"Gauge-" + id}
                                width="100%"
                                height="150px"
                                legend_toggle
                            />
                        {/*<span className={state}>{state}</span>*/}
                    </CardContent>
                    {/*<CardActions>*/}
                        {/*<Button variant="contained" color="primary">*/}
                            {/*FLASH*/}
                        {/*</Button>*/}

                    {/*</CardActions>*/}
                </Card>
            </div>
        );

    }
}


Picoflaher.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Picoflaher);