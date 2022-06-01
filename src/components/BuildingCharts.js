import React, { useEffect, useState } from 'react'
import { Amplify, PubSub } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from "react-redux";
import { loadSelectedBuildingId } from "../actions/userOptions"
import ReactApexCharts from 'react-apexcharts'
import produce from "immer"
import { buildingTSData, cleanProfileStateArray } from '../actions/buildingTSData';
import { mqttSubscription, mqttUnsubscribe } from '../actions/subscription';


export const BuildingCharts = () => {

  const [timeseries, setTimeseries] = useState([])
  
  const chartOptions = ({
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


  const data = useSelector(state => state.buildingTSData);
  const userOptions = useSelector(state => state.userOptions)
  const subscription = useSelector(state => state.subscription)
  const dispatch = useDispatch();



  useEffect(() => {
    if(userOptions.defaultBuildingId!=null){//if a building is selected subscribe to this
      dispatch(mqttSubscription(userOptions.defaultBuildingId))
      dispatch(buildingTSData(userOptions.defaultBuildingId))
   }  
    return () => {

      dispatch(mqttUnsubscribe())
    }
  }, [])

  useEffect(() => {
    
    async function fillChart(dataArray) {
      let wattValueArray = []
      let cngValueArray = []
      let waterValueArray = []
      let timeArray = []
      dataArray.map(measure => {
        let fullTimeMeasure = measure.Data[4].ScalarValue
        let shortTimeMeasure = fullTimeMeasure.slice(0, 22)
        timeArray.push(shortTimeMeasure)
        wattValueArray.push(measure.Data[9].ScalarValue)//the numbers are the coresponding columns from tm table row
        cngValueArray.push(measure.Data[10].ScalarValue)
        waterValueArray.push(measure.Data[5].ScalarValue)
      })

      let newValues = produce(values, draftState => {
        draftState[0].data = wattValueArray
        draftState[1].data = cngValueArray
        draftState[2].data = waterValueArray
      })

      
      updateChart(newValues,timeArray)//passing ready to insert to setState objects to update our chart
    }

    if (data.length > 0) {
      console.log("filling chart...->")
      fillChart(data)
    }

  }, [data])

  useEffect(() => {
    function modifyChart(subDataArray) {
      let curr_time  =new Date().toISOString().replace("T"," ").substring(0, 19);
      let newWattValuesArray = [...values[0].data]
      let newCngValuesArray = [...values[1].data]
      let newWaterValuesArray = [...values[2].data]
      let newTimesArray = [...timeseries]
      console.log(newWaterValuesArray)
      newWattValuesArray.shift()
      newCngValuesArray.shift()
      newWaterValuesArray.shift()
      newWattValuesArray.push(subDataArray[0])
      newCngValuesArray.push(subDataArray[2])
      newWaterValuesArray.push(subDataArray[4])
      newTimesArray.shift()
      newTimesArray.push(curr_time)
      
      let newValues = produce(values, draftState => {
        draftState[0].data = newWattValuesArray
        draftState[1].data = newCngValuesArray
        draftState[2].data = newWaterValuesArray
      })  
      console.log(newValues)
      console.log(newTimesArray)
      updateChart(newValues, newTimesArray)
    }
     
    if (Object.keys(subscription).length !== 0)//so it will not run on init 
    {
    console.log("i run",subscription)
      modifyChart(subscription)
    }
  }, [subscription])

  function updateChart(valuesToUpdate, timesToUpdate) {
    
    setValues(valuesToUpdate)
    setTimeseries(timesToUpdate)

  }

  return (
    <div>
      <ReactApexCharts options={chartOptions} series={values} type="area" />
    </div>
  );
}
//aws dynamodb get-item --table-name 'Subscriptions'  --key='PK':'b_1'