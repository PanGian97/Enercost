import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactApexCharts from 'react-apexcharts'
import { buildingTSData, cleanProfileStateArray } from '../actions/buildingTSData';
import { mqttSubscription, mqttUnsubscribe } from '../actions/subscription';
import './styles/BuildingDash.css'

export const BuildingDash = () => {

  const [costSum, setCostSum] = useState([])

  const [waterConsCurr, setWaterConsCurr] = useState(0)
  const [powerConsCurr, setPowerConsCurr] = useState(0)
  const [cngConsCurr, setCngConsCurr] = useState(0)

  const [waterCostCurr, setWaterCostCurr] = useState(0)
  const [powerCostCurr, setPowerCostCurr] = useState(0)
  const [cngCostCurr, setCngCostCurr] = useState(0)

  const buildingMetrics = useSelector(state => state.buildingData)

  const sumCostDonut = {
    chart: {
      type: "donut",
      height: '60%'
    },
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return Math.round(val * 10) / 10 + "€/h"
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '48px',
              fontFamily: 'Open Sans',
              fontWeight: 500,
              color: '#ffffff',
            },
            total: {
              show: true,
              showAlways: false,
              color: '#BCC1C8',
              fontFamily: 'Open Sans',
              formatter: (w) => {
                let total = w.globals.seriesTotals.reduce(
                  (a, b) => a + b,
                  0
                );
                return Math.round(total * 10) / 10 + " €/h"
              }
            },
          },
        }
      }
    }
  };
  //----------------
  const [liveWaterMetrics, setLiveWaterMetrics] = useState([{
    name: "water consumption",
    data: []//many data arrays will be saved there holding the time and value e.g-> [164783294,20]
  }
  ]);
  const [livePowerMetrics, setLivePowerMetrics] = useState([{
    name: "power consumption",
    data: []
  }
  ]);
  const [liveCngMetrics, setLiveCngMetrics] = useState([{
    name: "cng consumption",
    data: []
  }]);

  const [liveCostMetrics, setLiveCostMetrics] = useState([{
    name: "water cost",
    data: []
  }
    , {
    name: "power cost",
    data: []
  },
  {
    name: "cng cost",
    data: []
  }]);

  const [waterOptions, setWaterOptions] = useState({
    chart: {
      type: 'area',
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Water consumption during the last hour',
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#FFFFFF'
      },
    },
    subtitle: {
      text: 'Price Movements',
      align: 'left'
    },
    xaxis: {
      labels: {
        datetimeUTC: false,
        style: {
          colors: '#008FFB' //replace with your desired color
        }
      },
      type: 'datetime',
      tooltip: {
        enabled: true,
        formatter: function(value) {
          // Use this formatter function to format the tooltip value
          const date = new Date(value);
          return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        }
      },
    },
    yaxis: {
      opposite: true
    },
    tooltip: {
      x: {
        format: 'HH:mm' // You might think this is enough, but custom formatter as shown above in xaxis.tooltip is necessary for specific custom formats
      }
    },
    legend: {
      horizontalAlign: 'left'
    }
  });
  
  const [powerOptions, setPowerOptions] = useState({
    chart: {
      type: 'area',
      zoom: {
        enabled: false
      }
    },

    stroke: {
      curve: 'straight'
    },

    title: {
      text: 'Power consumption during the last hour',
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#FFFFFF'
      },

    },
    subtitle: {
      text: 'Consumption Movements',
      align: 'left'
    },

    xaxis: {
      labels: {
        datetimeUTC: false,
        style: {
          colors: '#008FFB' //replace with your desired color
        }
      },
      type: 'datetime',
      tooltip: {
        enabled: true,
        formatter: function(value) {
          // Use this formatter function to format the tooltip value
          const date = new Date(value);
          return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        }
      },
    },
    
    yaxis: {
      opposite: true
    },
    tooltip: {
      x: {
        format: 'HH:mm' // You might think this is enough, but custom formatter as shown above in xaxis.tooltip is necessary for specific custom formats
      }
    },
    legend: {
      horizontalAlign: 'left'
    }
  })
  const [cngOptions, setCngOptions] = useState({
    chart: {
      type: 'area',
      zoom: {
        enabled: false
      }
    },

    stroke: {
      curve: 'straight'
    },

    title: {
      text: 'Cng consumption during the last hour',
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#FFFFFF'
      },

    },
    subtitle: {
      text: 'Consumption Movements',
      align: 'left'
    },

    xaxis: {
      labels: {
        datetimeUTC: false,
        style: {
          colors: '#008FFB' //replace with your desired color
        }
      },
      type: 'datetime',
      tooltip: {
        enabled: true,
        formatter: function(value) {
          // Use this formatter function to format the tooltip value
          const date = new Date(value);
          return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        }
      },
    },
    yaxis: {
      opposite: true
    },
    tooltip: {
      x: {
        format: 'HH:mm' // You might think this is enough, but custom formatter as shown above in xaxis.tooltip is necessary for specific custom formats
      }
    },
    legend: {
      horizontalAlign: 'left'
    }
  })
  const [costOptions, setCostOptions] = useState({

    chart: {
      type: 'area',
      stacked: true,
      forecolor: '#008FFB'
    },
    title: {
      text: 'Total energy cost during the last hour',
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#FFFFFF'
      },

    },
    colors: ['#008FFB', '#00E396', '#CED4DC'],

    stroke: {
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    xaxis: {
      labels: {
        datetimeUTC: false,
        style: {
          colors: '#008FFB' //replace with your desired color
        }
      },
      type: 'datetime'
    },

  })

  const userOptions = useSelector(state => state.userOptions)
  const subscription = useSelector(state => state.subscription)

  const dispatch = useDispatch();

  useEffect(() => {

    return () => {
      dispatch(mqttUnsubscribe())
    }
  }, [])

  useEffect(() => {
    console.log(userOptions)
    if (userOptions.defaultBuildingId != "") {//if a building is selected subscribe to this
      console.log("start subscription")
      dispatch(mqttSubscription(userOptions.defaultBuildingId))
    }
  }, [userOptions])

  useEffect(() => {
    function modifyDash(newDataObj) {

      // Extracting water values
      const waterValue = newDataObj['water_value']; // Assuming 'water_value' is the correct key
      const waterPriceValue = newDataObj['water_price_value'];
      const wattValue = newDataObj['watt_value']; 
      const wattPriceValue = newDataObj['wattt_price_value']
      const cngValue = newDataObj['cng_value']; 
      const cngPriceValue = newDataObj['cng_price_value']

      setWaterConsCurr(waterValue);
      setWaterCostCurr(waterPriceValue);
      setPowerConsCurr(wattValue);
      setPowerCostCurr(wattPriceValue);
      setCngConsCurr(cngValue);
      setCngCostCurr(cngPriceValue);
      // Now, update liveMetrics for the chart
      const timestamp = new Date().getTime();
      const newWaterConsMetric = [timestamp, parseFloat(waterValue)];
      const newPowerConsMetric = [timestamp, parseFloat(wattValue)];
      const newCngConsMetric = [timestamp, parseFloat(cngValue)];


      setLiveWaterMetrics(prevMetrics => {
        const newWaterConsMetricArray = [...prevMetrics[0].data, newWaterConsMetric];
  
        // If length exceeds 20, remove the oldest entry
        if (newWaterConsMetricArray.length > 20) {
          newWaterConsMetricArray.shift();
        }
        // Return new metrics array with updated data
        return [{ ...prevMetrics[0], data: newWaterConsMetricArray  }];

      })
      setLivePowerMetrics(prevMetrics => {
        const newPowerConsMetricArray = [...prevMetrics[0].data, newPowerConsMetric];
  
        // If length exceeds 20, remove the oldest entry
        if (newPowerConsMetricArray.length > 20) {
          newPowerConsMetricArray.shift();
        }
        // Return new metrics array with updated data
        return [{ ...prevMetrics[0], data: newPowerConsMetricArray  }];

      })
      setLiveCngMetrics(prevMetrics => {
        const newCngConsMetricArray = [...prevMetrics[0].data, newCngConsMetric];
  
        // If length exceeds 20, remove the oldest entry
        if (newCngConsMetricArray.length > 20) {
          newCngConsMetricArray.shift();
        }
        // Return new metrics array with updated data
        return [{ ...prevMetrics[0], data: newCngConsMetricArray  }];

      })
    }

    if (Object.keys(buildingMetrics).length !== 0)//so it will not run on init 
    {
      console.log(buildingMetrics)
      modifyDash(buildingMetrics[0])
    }
  }, [buildingMetrics])




useEffect(() => {
  console.log(liveWaterMetrics)

  
}, [liveWaterMetrics])

  useEffect(() => {
    if (liveCostMetrics[0].data.length > 0)//check if any vale has been fetched (we chose water value to do the check randomly)
    {
      let updCostSumArray = []
      console.log(liveCostMetrics)


      updCostSumArray[0] = liveCostMetrics[0].data[liveCostMetrics[0].data.length - 1][1]//water donut value=last water cost value
      updCostSumArray[1] = liveCostMetrics[1].data[liveCostMetrics[1].data.length - 1][1]//power donut value=last water cost value
      updCostSumArray[2] = liveCostMetrics[2].data[liveCostMetrics[2].data.length - 1][1]//cng donut value=last water cost value
      //transform to flaot cause calculations need to be done for the average cost consuption measure
      updCostSumArray[0] = parseFloat(updCostSumArray[0])
      updCostSumArray[1] = parseFloat(updCostSumArray[1])
      updCostSumArray[2] = parseFloat(updCostSumArray[2])
      console.log(updCostSumArray)
      setCostSum(updCostSumArray)

    }

  }, [liveCostMetrics])




  return (

    <div id="wrapper">
      <div className="content-area">
        <div className="container-fluid">

          <div className="row">
            <div className="col-md-6">
              <div className="panel mt-md-2">
                <div id="sumCostChart">

                  <ReactApexCharts options={sumCostDonut} series={costSum} type="donut" />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="panel mt-md-2">
                <div id="costChart">
                  <ReactApexCharts options={costOptions} series={liveCostMetrics} type="area" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="panel mt-md-2">
                <div id="powerConsChart">
                  <ReactApexCharts options={powerOptions} series={livePowerMetrics} type="area" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel mt-md-2">
                <div id="cngConsChart">
                  <ReactApexCharts options={cngOptions} series={liveCngMetrics} type="area" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel mt-md-2">
                <div id="waterConsChart">
                  <ReactApexCharts options={waterOptions} series={liveWaterMetrics} type="area" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

