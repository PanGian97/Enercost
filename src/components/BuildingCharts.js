import React, { useEffect, useState } from 'react'
import { Amplify, PubSub } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from "react-redux";
import { loadSelectedBuildingId } from "../actions/userOptions"
import ReactApexCharts from 'react-apexcharts'
import produce from "immer"
import { buildingTSData, cleanProfileStateArray, updateChartData } from '../actions/buildingTSData';
import { mqttSubscription, mqttUnsubscribe } from '../actions/subscription';
import './styles/BuildingCharts.css'
import moment from 'moment'
export const BuildingCharts = () => {

  const [dataPeriod, setDataPeriod] = useState('day')
  const [timeseries, setTimeseries] = useState([])
  const [isReadyToFetch, setIsReadyToFetch] = useState(false)
  const [liveLedColor, setLiveLedColor] = useState("red")
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
      align: 'left',
      style: {
        color: 'white'
      },
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
      align: 'left',
      style: {
        color: 'white'
      },
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

  const buildingMetrics = useSelector(state => state.buildingTSData)
  const buildingUpdatedMetrics = useSelector(state => state.updateChartData)
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
        dispatch(buildingTSData(idJwtToken, userOptions.defaultBuildingId, dataPeriod))

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
      let cngPriceArray = []
      let waterPriceArray = []
      let timeArray = []


      dataArray.forEach(item => {
        wattValueArray.push(item.watt_value);
        cngValueArray.push(item.cng_value);
        waterValueArray.push(item.water_value);
        wattPriceArray.push(item.watt_price_value);
        cngPriceArray.push(item.cng_price_value);
        waterPriceArray.push(item.water_price_value);
        timeArray.push(item.timestamp);
      });
      let newValues = []
      newValues[0] = wattValueArray
      newValues[1] = cngValueArray
      newValues[2] = waterValueArray

      let newPriceValues = []
      newPriceValues[0] = wattPriceArray
      newPriceValues[1] = cngPriceArray
      newPriceValues[2] = waterPriceArray

      // Update 'values' state
      setValues([
        { name: 'wattage readings', data: wattValueArray },
        { name: 'cng readings', data: cngValueArray },
        { name: 'water readings', data: waterValueArray },
      ]);

      // Update 'priceValues' state
      setPriceValues([
        { name: 'wattage consumption readings', data: wattPriceArray },
        { name: 'cng consumption readings', data: cngPriceArray },
        { name: 'water consumption readings', data: waterPriceArray },
      ]);
      setTimeseries(timeArray)
    }


    fillChart(buildingMetrics)
    console.log(buildingMetrics)
  }, [buildingMetrics])
  useEffect(() => {
    console.log(priceValues)
   
  }, [priceValues])
  useEffect(() => {
    function modifyDataArray(subDataArray) {
      console.log(subDataArray)


    }
    console.log("inside subscription  useffect")
    if (Object.keys(subscription).length !== 0)//so it will not run on init 
    {
      modifyDataArray(subscription)
      setLiveLedColor("green")
    }
    else { setLiveLedColor("red") }
  }, [subscription])


  return (
    <div id="wrapper">
      <div className="content-area">
        <div className="container-fluid">
          <div className="row mt-3">
            <div className='title col-md-8'>History consumption & cost charts for the building {userOptions.defaultBuildingId} </div>
            <div className="btn-group col-md-4">
              <button type="button" className="btn btn-dark" onClick={() => setDataPeriod('day')}>Day</button>
              <button type="button" className="btn btn-dark" onClick={() => setDataPeriod('hour')}>Hour</button>
              <button type="button" className="btn btn-dark btn-livedata" onClick={() => setDataPeriod('minute')}>Minute
                <div className='live-container'>
                  <span className="live-text">Live</span>
                  <span className={`led ${liveLedColor}`}></span>
                </div>
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="chart-panel col-md-12">
              <div id="historyChartCons">
                <ReactApexCharts options={valuesChartOptions} series={values} type="area" height='280%' />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="chart-panel col-md-12">
              <div id="historyChartCons">
                <ReactApexCharts options={pricesChartOptions} series={priceValues} type="area" height='280%' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//aws dynamodb get-item --table-name 'Subscriptions'  --key='PK':'b_1'