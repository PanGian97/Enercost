import React, { useEffect, useState } from 'react'
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { Amplify, PubSub } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from "react-redux";
import { loadSelectedBuildingId } from "../actions/userOptions"
import ReactApexCharts from 'react-apexcharts'
import produce from "immer"
import { unstable_batchedUpdates } from 'react-dom'//to skip multiple re-renders during setstates
import { buildingTSData, cleanProfileStateArray } from '../actions/buildingTSData';
import { mqttSubscription, mqttUnsubscribe } from '../actions/subscription';
import './styles/BuildingDash.css'

export const BuildingDash = () => {

  const [costSum, setCostSum] = useState([0, 0, 0])


  const sumcostDonut = {
    chart: {
      type: "donut",

    },
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val + ".00" + " €/h"
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
                const total = w.globals.seriesTotals.reduce(
                  (a, b) => a + b,
                  0
                );
                return `${total}€`;
              }
            },
          },
        }
      }
    }
  };
  const [waterCons, setWaterCons] = useState(0)
  const [powerCons, setPowerCons] = useState(0)
  const [cngCons, setCngCons] = useState(0)

  const [waterCost, setWaterCost] = useState(0)
  const [powerCost, setPowerCost] = useState(0)
  const [cngCost, setCngCost] = useState(0)

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
      text: 'Fundamental Analysis of Stocks',
      align: 'left'
    },
    subtitle: {
      text: 'Price Movements',
      align: 'left'
    },

    xaxis: {
      formatter: function (value, timestamp) {
        return new Date(timestamp) // The formatter function overrides format property
      },
      type: 'datetime',
    },
    yaxis: {
      opposite: true
    },
    legend: {
      horizontalAlign: 'left'
    }
  })
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
      text: 'Fundamental Analysis of Power per Hour',
      align: 'left'
    },
    subtitle: {
      text: 'Price Movements',
      align: 'left'
    },

    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      opposite: true
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
      text: 'Fundamental Analysis of Cng per Hour',
      align: 'left'
    },
    subtitle: {
      text: 'Live Movements',
      align: 'left'
    },

    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      opposite: true
    },
    legend: {
      horizontalAlign: 'left'
    }
  })
  const [costOptions, setCostOptions] = useState({
    chart: {
      type: 'area',
      stacked: true,
    },
    colors: ['#008FFB', '#00E396', '#CED4DC'],
    dataLabels: {
      enabled: false
    },
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
      type: 'datetime'
    }
  })

  const userOptions = useSelector(state => state.userOptions)
  const subscription = useSelector(state => state.subscription)

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(loadSelectedBuildingId())

    return () => {
      dispatch(mqttUnsubscribe())
    }
  }, [])

  useEffect(() => {
    console.log(userOptions.defaultBuildingId)
 if(userOptions.defaultBuildingId!=null){//if a building is selected subscribe to this
    dispatch(mqttSubscription(userOptions.defaultBuildingId))
 }   
  }, [userOptions])

  useEffect(() => {
    function modifyDash(newValuesArray) {
     
      let currConsMetrics = {
        water: '0', cng: '0', power: '0'
      }
      let currCostMetrics = {
        water: '0', cng: '0', power: '0'
      }

      currConsMetrics.power = newValuesArray[0]//not best practice
      currCostMetrics.power = newValuesArray[1]
      currConsMetrics.cng = newValuesArray[2]
      currCostMetrics.cng = newValuesArray[3]
      currConsMetrics.water = newValuesArray[4]
      currCostMetrics.water = newValuesArray[5]
      unstable_batchedUpdates(() => {
        setPowerCons(currConsMetrics.power)
        setCngCons(currConsMetrics.cng)
        setWaterCons(currConsMetrics.water)
        setPowerCost(currCostMetrics.power)
        setCngCost(currCostMetrics.cng)
        setWaterCost(currCostMetrics.water)
      })
    }

    if (Object.keys(subscription).length !== 0)//so it will not run on init 
    {
      modifyDash(subscription)
    }
  }, [subscription])

  useEffect(() => {//just to see how many renders per metrics...
    console.log('rendered')
  }, [waterCons, waterCost, powerCons, powerCost, cngCons, cngCost])
  useEffect(() => {

    let waterMetric = []
    let updWaterArray = [...liveWaterMetrics[0].data]
    const time = new Date()
    waterMetric.push(new Date(time).getTime())
    waterMetric.push(waterCons)
    if (updWaterArray.length > 20) {//if it holds values bigger than 20
      updWaterArray.shift()
    }
    updWaterArray.push(waterMetric)//later we will load prev metric values from old array 

    let tempWaterArray = produce(liveWaterMetrics, draftState => {
      draftState[0].data = updWaterArray
    })
    setLiveWaterMetrics(tempWaterArray)

  }, [waterCons])
  useEffect(() => {

    let powerMetric = []
    let updPowerArray = [...livePowerMetrics[0].data]
    const time = new Date()
    powerMetric.push(new Date(time).getTime())
    powerMetric.push(powerCons)
    if (updPowerArray.length > 20) {//if it holds values bigger than 20
      updPowerArray.shift()
    }
    updPowerArray.push(powerMetric)//later we will load prev metric values from old array 

    let tempPowerArray = produce(livePowerMetrics, draftState => {
      draftState[0].data = updPowerArray
    })
    setLivePowerMetrics(tempPowerArray)

  }, [powerCons])
  useEffect(() => {

    let cngMetric = []
    let updCngArray = [...liveCngMetrics[0].data]
    const time = new Date()
    cngMetric.push(new Date(time).getTime())
    cngMetric.push(cngCons)
    if (updCngArray.length > 20) {//if it holds values bigger than 20
      updCngArray.shift()
    }
    updCngArray.push(cngMetric)//later we will load prev metric values from old array 

    let tempCngArray = produce(liveCngMetrics, draftState => {
      draftState[0].data = updCngArray
    })
    setLiveCngMetrics(tempCngArray)

  }, [cngCons])
  useEffect(() => {

    let waterCostMetric = []
    let powerCostMetric = []
    let cngCostMetric = []
    let updWaterCostArray = [...liveCostMetrics[0].data]
    let updPowerCostArray = [...liveCostMetrics[1].data]
    let updCngCostArray = [...liveCostMetrics[2].data]
    const time = new Date()
    waterCostMetric.push(new Date(time).getTime())
    waterCostMetric.push(waterCost)
    powerCostMetric.push(new Date(time).getTime())
    powerCostMetric.push(powerCost)
    cngCostMetric.push(new Date(time).getTime())
    cngCostMetric.push(cngCost)
    if (updWaterCostArray.length > 20) {//if this array (we just chose 1 of 3) holds values bigger than 20
      updWaterCostArray.shift()
      updPowerCostArray.shift()
      updCngCostArray.shift()
    }
    updWaterCostArray.push(waterCostMetric)//later we will load prev metric values from old array 
    updPowerCostArray.push(powerCostMetric)
    updCngCostArray.push(cngCostMetric)

    let tempCostArray = produce(liveCostMetrics, draftState => {
      draftState[0].data = updWaterCostArray
      draftState[1].data = updPowerCostArray
      draftState[2].data = updCngCostArray
    })
    setLiveCostMetrics(tempCostArray)

  }, [waterCost])

  useEffect(() => {
    if (liveCostMetrics[0].data.length > 0)//check if any vale has been fetched (we chose water value to do the check randomly)
    {
      let updCostSumArray = []

      updCostSumArray[0] = liveCostMetrics[0].data[liveCostMetrics[0].data.length - 1][1]//water donut value=last water cost value
      updCostSumArray[1] = liveCostMetrics[1].data[liveCostMetrics[1].data.length - 1][1]//power donut value=last water cost value
      updCostSumArray[2] = liveCostMetrics[2].data[liveCostMetrics[2].data.length - 1][1]//cng donut value=last water cost value
      console.log(updCostSumArray)
      setCostSum(updCostSumArray)
    }

  }, [liveCostMetrics])
  useEffect(() => {
    console.log(costSum)
  }, [costSum])
  useEffect(() => {
    // console.log(livePowerMetrics)
  }, [livePowerMetrics])

  return (

    <div id="wrapper">
      <div className="content-area">
        <div className="container-fluid">
          <div className='title'>Real time cost and consumption for the building {userOptions.defaultBuildingId} </div>
          <div className="row">
            <div className="col-md-6">
              <div className="panel mt-md-2">
                <div id="sumCostChart">
                  <ReactApexCharts options={sumcostDonut} series={costSum} type="donut" width='100%' />
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

