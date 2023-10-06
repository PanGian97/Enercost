import React, { useEffect, useState } from 'react'
import { Amplify, PubSub } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from "react-redux";
import { loadSelectedBuildingId } from "../actions/userOptions"
import ReactApexCharts from 'react-apexcharts'
import produce from "immer"
import { buildingTSData, cleanProfileStateArray } from '../actions/buildingTSData';
import { mqttSubscription, mqttUnsubscribe } from '../actions/subscription';
import './styles/BuildingCharts.css'
import moment from 'moment'
export const BuildingCharts = () => {

  const [dataPeriod, setDataPeriod] = useState('day')
  const [timeseries, setTimeseries] = useState([])
  const [isReadyToFetch, setIsReadyToFetch] = useState(false)
  const valuesChartOptions = ({
    chart: {
      id: "apex-example",
      type: "line",
      width: 'auto', height: 'auto'
    },
    colors: ['#77B6EA', '#545454', '#72C111'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Average Watt,CNG and water consumption',
      align: 'left'
    },

    xaxis: {
      categories: timeseries,
      type: 'datetime',
      labels: {
       
        datetimeUTC: false,
        format: ' MMM dd->HH:mm:ss ',
        show: true
      }
    },
    tooltip: {
      x: {
        format: "HH:mm:ss"
      }
    }
  }
  )
  const pricesChartOptions = ({
    chart: {
      id: "apex-example",
      type: "line",
      width: 'auto', height: 'auto'
    },
    colors: ['#EBD601', '#01EB28', '#0188EB'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Average Watt,CNG and water cost',
      align: 'left'
    },

    xaxis: {
      categories: timeseries,
      type: 'datetime',
      labels: {
       
        datetimeUTC: false,
        format: ' MMM dd->HH:mm:ss ',
        show: true
      }
    },
    tooltip: {
      x: {
        format: "HH:mm:ss"
      }
    }
  }
  )

  const [values, setValues] = useState([{
    name: 'wattage readings',
    data: []
  }, {
    name: 'cng readings',
    data: []
  }, {
    name: 'water readings',
    data: []
  }])
  const [priceValues, setPriceValues] = useState([{
    name: 'wattage consumption readings',
    data: []
  }, {
    name: 'cng consumption  readings',
    data: []
  }, {
    name: 'water consumption  readings',
    data: []
  }])

  const buildingMetrics = useSelector(state => state.buildingTSData);
  const userOptions = useSelector(state => state.userOptions)
  const subscription = useSelector(state => state.subscription)
  const sessionData = useSelector(state => state.sessionData)
  const dispatch = useDispatch();

  useEffect(() => {
    if (isReadyToFetch) {
      const idJwtToken = sessionData.idToken.jwtToken
    
      switch (dataPeriod) {//we need subscription to live data only on minute selection
        case 'day':
          dispatch(mqttUnsubscribe())
          dispatch(buildingTSData(idJwtToken, userOptions.defaultBuildingId, 'day'))
          break;
        case 'hour':
          dispatch(mqttUnsubscribe())
          dispatch(buildingTSData(idJwtToken, userOptions.defaultBuildingId, 'hour'))
          break;
        case 'minute':
          dispatch(buildingTSData(idJwtToken, userOptions.defaultBuildingId, 'minute'))
          dispatch(mqttSubscription(userOptions.defaultBuildingId))
        default:
          break;
      }
    }
  }, [dataPeriod])


  useEffect(() => {
    if (Object.keys(sessionData).length !== 0) {//if user session info loaded because the request needs session tokenid
      const idJwtToken = sessionData.idToken.jwtToken
      if (userOptions.defaultBuildingId != null) {//if a building is selected subscribe toLocalTime this
        setIsReadyToFetch(true)
        dispatch(buildingTSData(idJwtToken, userOptions.defaultBuildingId, 'day'))
        
      }
    } return () => {
      dispatch(mqttUnsubscribe())
    }
  }, [sessionData])

  useEffect(() => {

    async function fillChart(dataArray) {
      let wattValueArray = []
      let cngValueArray = []
      let waterValueArray = []
      let wattPriceArray = []
      let cngPriceArray =[]
      let waterPriceArray=[]
      let timeArray = []
      dataArray.map(measure => {
        
     let fullTimeMeasure = measure.Data[4].ScalarValue
     let shortTimeMeasure = fullTimeMeasure.slice(0, 22)

        let toLocalTime= moment.utc(shortTimeMeasure).local().format('YYYY-MM-DD HH:mm:ss');
        timeArray.push(toLocalTime)
         
        wattValueArray.push(measure.Data[9].ScalarValue)//the numbers are the coresponding columns from tm table row (unfortunatelly the response doesnt include titles,call them all as Scalar values so it follows the sequence they subscribed in the TM db)
        cngValueArray.push(measure.Data[10].ScalarValue)
        waterValueArray.push(measure.Data[5].ScalarValue)
        wattPriceArray.push(measure.Data[6].ScalarValue)
        cngPriceArray.push(measure.Data[7].ScalarValue)
        waterPriceArray.push(measure.Data[8].ScalarValue)
        

      })
      let newValues = produce(values, draftState => {
        draftState[0].data = wattValueArray
        draftState[1].data = cngValueArray
        draftState[2].data = waterValueArray
      })
      let newPriceValues = produce(priceValues, draftState => {
        draftState[0].data = wattPriceArray
        draftState[1].data = cngPriceArray
        draftState[2].data = waterPriceArray
      })
      updateChart(newValues,newPriceValues, timeArray)//passing ready toLocalTime insert toLocalTime setState objects toLocalTime update our chart
    }

    
      console.log("updating Chart...-> ",buildingMetrics)
      fillChart(buildingMetrics)
    
  }, [buildingMetrics])

  useEffect(() => {
    function modifyChart(subDataArray) {
      let currTime = new Date().toISOString().replace("T", " ").substring(0, 19);
      let newWattValuesArray = [...values[0].data]
      let newCngValuesArray = [...values[1].data]
      let newWaterValuesArray = [...values[2].data]
      let newWattPriceValuesArray =[...priceValues[0].data]
      let newCngPriceValuesArray =[...priceValues[1].data]
      let newWaterPriceValuesArray =[...priceValues[2].data]
      let newTimesArray = [...timeseries]
      newWattValuesArray.shift()
      newCngValuesArray.shift()
      newWaterValuesArray.shift()
      newWattPriceValuesArray.shift()
      newCngPriceValuesArray.shift()
      newWaterPriceValuesArray.shift()
      newTimesArray.shift()
      newWattValuesArray.push(subDataArray[0])
      newCngValuesArray.push(subDataArray[2])
      newWaterValuesArray.push(subDataArray[4])
      newWattPriceValuesArray.push(subDataArray[1])
      newCngPriceValuesArray.push(subDataArray[3])
      newWaterPriceValuesArray.push(subDataArray[5])
      newTimesArray.push(currTime)

      let newValues = produce(values, draftState => {
        draftState[0].data = newWattValuesArray
        draftState[1].data = newCngValuesArray
        draftState[2].data = newWaterValuesArray
      })
      let newPriceValues = produce(priceValues, draftState => {
        draftState[0].data = newWattPriceValuesArray
        draftState[1].data = newCngPriceValuesArray
        draftState[2].data = newWaterPriceValuesArray
      })
      updateChart(newValues,newPriceValues, newTimesArray)
    }

    if (Object.keys(subscription).length !== 0)//so it will not run on init 
    {
      console.log("i run", subscription)
      modifyChart(subscription)
    }
  }, [subscription])

  function updateChart(valuesToUpdate,pricevaluesToUpdate, timesToUpdate) {

    setValues(valuesToUpdate)
    setPriceValues(pricevaluesToUpdate)
    setTimeseries(timesToUpdate)
  }
  return (
    <div id="wrapper">
      <div className="content-area">
        <div className="container-fluid">
          <div className="row mt-3">
            <div className='title col-md-8'>History consumption & cost charts for the building {userOptions.defaultBuildingId} </div>
            <div className="btn-group col-md-4">
              <button type="button" className="btn btn-primary" onClick={() => setDataPeriod('day')}>Day</button>
              <button type="button" className="btn btn-primary" onClick={() => setDataPeriod('hour')}>Hour</button>
              <button type="button" className="btn btn-primary btn-livedata"  onClick={() => setDataPeriod('minute')}>Minute</button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="chart-panel col-md-12">
              <div id="historyChartCons">
                <ReactApexCharts options={valuesChartOptions} series={values} type="area" height='300%' />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="chart-panel col-md-12">
              <div id="historyChartCons">
                <ReactApexCharts options={pricesChartOptions} series={priceValues} type="area" height='260%' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//aws dynamodb get-item --table-name 'Subscriptions'  --key='PK':'b_1'