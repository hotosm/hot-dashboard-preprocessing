/** Natives **/
import React, { Component } from 'react';

/** CSS **/
import './MainContent.css';

/** Logos **/
import mapathonsIMG  from '../../../assets/images/logos/mapathons.png';
import projectsIMG   from '../../../assets/images/logos/projects.png';
import mapIMG        from '../../../assets/images/logos/map.png';

/** Material UI **/
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography       from '@material-ui/core/Typography';
import Card             from '@material-ui/core/Card';
import CardContent      from '@material-ui/core/CardContent';
import Grid             from '@material-ui/core/Grid';

/** Components **/
import WidgetIndicator from '../../widget/Indicator';
import WidgetGraph     from '../../widget/Graph';

/** Plugins **/
import { VictoryPie   }  from 'victory';
import { VictoryChart }  from 'victory';
import { VictoryLine  }  from 'victory';
import { VictoryBar   }  from 'victory';

/** Themes **/
const GlobalTheme = createMuiTheme({
  typography: {
    fontSize   :  18,
    fontFamily : "'Barlow Condensed', sans-serif"
  },
  palette: {
    primary: {
      main : '#FFFFFF',
    }
  },
});


class MainContent extends Component {
  //------------------------------------------------------------------------//
  //-------------------------------- Render --------------------------------//
  //------------------------------------------------------------------------//

  render() {
    return (
        // The padding prevent the page to be too wide because of the option spacing
        <div style={{ padding: 12 }}>
          <Grid container spacing={24} className="content-row">  {/* Spacing = space between cards */}
            <MuiThemeProvider theme={GlobalTheme}>

              {/* First row */}
              {/* Active projects */}
              <Grid item xs={12} sm={6} md={3}>
                {this.props.importedIndicators.global && (<WidgetIndicator title="Active projects" img={projectsIMG} data={this.props.importedIndicators.global.main.totalProjects}/>)}
              </Grid>

              {/* Map edits */}
              <Grid item xs={12} sm={6} md={3}>
                {this.props.importedIndicators.global && (<WidgetIndicator title="Total mappers" img={mapIMG} data={this.props.importedIndicators.global.main.totalMappers}/>)}
              </Grid>

              {/* Mapathons */}
              <Grid item xs={12} sm={6} md={3}>
                {this.props.importedIndicators.global && (<WidgetIndicator title="Mapathons" img={mapathonsIMG} data={this.props.importedIndicators.global.main.totalMapathons}/>)}
              </Grid>

              {/* Mapped elements */}
              <Grid item xs={12} sm={6} md={3}>
                {this.props.importedIndicators.global && (
                    <Card className="widget-container">
                      <CardContent className="widget-text">
                        <Typography variant="caption"> Number of elements mapped </Typography>
                        <div className="widget-mappedElements-text">
                          <Typography className="widget-mappedElements-text-item-green" color="primary">
                            {new Intl.NumberFormat('en-GB', {
                              minimumFractionDigits : 0,
                              maximumFractionDigits : 0
                            }).format(this.props.importedIndicators.global.main.totalBuildings)} Buildings</Typography>
                          <Typography className="widget-mappedElements-text-item-grey">
                            {new Intl.NumberFormat('en-GB', {
                              minimumFractionDigits : 0,
                              maximumFractionDigits : 0
                            }).format(this.props.importedIndicators.global.main.totalRoads)} Roads</Typography>
                        </div>
                      </CardContent>
                    </Card>)}
              </Grid>

              {/* Second row */}
              {/* Community mappers */}
              <Grid item xs={12} sm={6} md={4}>
                {this.props.importedIndicators.global && (
                    <WidgetGraph title = "Number of community mappers (by sex)"
                                 graph = {<VictoryPie
                                     padAngle    = {2}
                                     innerRadius = {100}
                                     width       = {475}
                                     colorScale  = {[ "#FAA71E", "#D73F3F"]}
                                     style={{ labels: {fontSize: 18} }}
                                     data = {[
                                       { x: "Women", y: 51 },
                                       { x: "Men",   y: 49 },
                                     ]}
                                 />}/>)}
              </Grid>

              {/* Usage of HOT Data */}
              <Grid item xs={12} sm={6} md={4}>
                {this.props.importedIndicators.global &&
                (<WidgetGraph title = "Increase of usage of HOT data"
                              graph = {<VictoryChart domainPadding={10}>
                                <VictoryBar style  = {{ data: { fill: "#D73F3F" } }}
                                            data   = {[
                                              { x: '2014', y: 0, y0: this.props.importedIndicators.global.main.usageOfHotData.data2014 },
                                              { x: '2015', y: 0, y0: this.props.importedIndicators.global.main.usageOfHotData.data2015 },
                                              { x: '2016', y: 0, y0: this.props.importedIndicators.global.main.usageOfHotData.data2016 },
                                              { x: '2017', y: 0, y0: this.props.importedIndicators.global.main.usageOfHotData.data2017 },
                                              { x: '2018', y: 0, y0: this.props.importedIndicators.global.main.usageOfHotData.data2018 }
                                            ]}
                                />
                              </VictoryChart>}/>
                )}
              </Grid>


              {/* Validataion errors */}
              <Grid item xs={12} sm={6} md={4}>
                {this.props.importedIndicators.global &&
                (<WidgetGraph title = "Proportion of validation errors"
                              graph = {<VictoryChart>
                                <VictoryLine
                                    style={{
                                      data   : { stroke: "#2C3038" },
                                      parent : { border: "1px solid #ccc"}
                                    }}
                                    data = {[
                                      { x: '2014', y: this.props.importedIndicators.global.main.usageOfHotData.data2014 },
                                      { x: '2015', y: this.props.importedIndicators.global.main.usageOfHotData.data2015 },
                                      { x: '2016', y: this.props.importedIndicators.global.main.usageOfHotData.data2016 },
                                      { x: '2017', y: this.props.importedIndicators.global.main.usageOfHotData.data2017 },
                                      { x: '2018', y: this.props.importedIndicators.global.main.usageOfHotData.data2018 }
                                    ]}
                                />
                              </VictoryChart>}/>
                )}
              </Grid>

            </MuiThemeProvider>
          </Grid>
        </div>
    );
  }
}

export default MainContent;
