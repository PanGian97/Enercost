// import React, { useEffect, useState } from 'react'
// import { API } from 'aws-amplify'
// import api from '../api/timestream'
// import Chart from 'react-apexcharts'

// import produce from "immer"
// const Body2 = () => {

//   const LOADING_MSG = "Values haven't been loadied yet to the chart"
//   const [timeseries, setTimeseries] = useState({
//     chart: {
//        id: "apex-example" ,
//        type:"line",
//        width:'auto',height:'auto'

//     },
//     colors: ['#77B6EA', '#545454','#72C111'],
//     dataLabels: {
//       enabled: true,
//     },
//     stroke: {
//        curve: 'smooth'
//     },
//     title: {
//       text: 'Average Watt,CNG and water consumption',
//       align: 'left'
//     },
  
//     xaxis: {
//       categories: [],
//       type: 'datetime',
//       labels: {
//         format: ' MMM dd->HH:mm:ss '
//       }
//     },
//       tooltip: {
//       x: {
//           format: "HH:mm:ss"
//          }
//        }
  

//   })
//   const [values, setValues] = useState([{
//     name: 'wattage readings',
//     data: []
//   },{
//     name: 'cng readings',
//     data: []
//   },{
//     name: 'water readings',
//     data: []
//   }])
//   const [areInitialValuesLoaded, setAreInitialValuesLoaded] = useState(false)
//   const [recievedData, setRecievedData] = useState({})

//   useEffect(() => {
//     async function fetchMeasures() {
//       const res = await api.getMeasures()
//       const dataArray = res.Rows
//       console.log(dataArray)
//       return dataArray
//     }

//     async function doSubscription() {//Attention! The function that will be called it uses the old values and not the ones seted after this function called
//       await iotSub.setupPubSub()
//         .then(iotSub.PubSub.subscribe('buildings').subscribe({
//           next: data => {
//             console.log('Message received', data)
//             console.log(values)//it outputs the old state values when the function run 
//             setRecievedData({ ...data })
//           },
//           error: error => console.error(error),
//           complete: () => console.log('Done'),
//         }))
//         .catch(console.error)
//     }

//     async function fillChart(dataArray) {
//       let wattValueArray = []
//       let cngValueArray=[]
//       let waterValueArray=[]
//       let timeArray = []
//       dataArray.map(measure => {

//         let fullTimeMeasure = measure.Data[3].ScalarValue
//         let shortTimeMeasure = fullTimeMeasure.slice(0, 22)
//         let timeMeasure = new Date(shortTimeMeasure).getTime()
//         timeArray.push(timeMeasure)       
//         wattValueArray.push(measure.Data[0].ScalarValue)
//         cngValueArray.push(measure.Data[1].ScalarValue)
//         waterValueArray.push(measure.Data[2].ScalarValue)        
//       })

//       let newValues = produce(values, draftState => {
//         draftState[0].data = wattValueArray
//         draftState[1].data = cngValueArray
//         draftState[2].data = waterValueArray
//       })
     
//       let newTimes = produce(timeseries, draftState => {
//         draftState.xaxis.categories = timeArray
//       })
//       updateChart(newValues, newTimes)//passing ready to insert to setState objects to update our chart
//     }
//     async function graphProcedures() {
//       try {
//         let dbMeasures = await fetchMeasures()
//         fillChart(dbMeasures)//when it will succesfully load the chart values second useffect function will run 
//        doSubscription()
//       } catch (e) {
//         console.log(e)
//       }
//     }

//     api.setConfiguration("us-east-2", "AKIAZICCGFA6ZCORB6N6", "Cd0wCb7W6oV3/bH3QnTk+Tv/5V6ekJpj4QmmMu4O")
//     graphProcedures()
//   }, [])

//   useEffect(() => {
//     function onChartDataLoad() {
//       console.log("useffect run:Values loaded")
//       console.log(values)
//       setAreInitialValuesLoaded(true)
//     }

//     onChartDataLoad()
//   }, [values]);

//   useEffect(() => {
//     if (Object.keys(recievedData).length !== 0)//so it will not run on init 
//     {
//       modifyChart()
     
//     }
//   }, [recievedData]);

//   function updateChart(valuesToUpdate, timesToUpdate) {
//     setValues(valuesToUpdate)
//     setTimeseries(timesToUpdate)
//   }

//   function modifyChart() {

//     let curr_time = new Date().toLocaleString()
//     let newWattValuesArray = [...values[0].data]
//     let newCngValuesArray = [...values[1].data]
//     let newWaterValuesArray = [...values[2].data]
//     let newTimesArray = [...timeseries.xaxis.categories]

//     newWattValuesArray.shift()
//     newCngValuesArray.shift()
//     newWaterValuesArray.shift()
//     newWattValuesArray.push(recievedData.value.watt_value)
//     newCngValuesArray.push(recievedData.value.cng_value)
//     newWaterValuesArray.push(recievedData.value.water_value)
//     newTimesArray.shift()
//     newTimesArray.push(curr_time)
//     let newValues = produce(values, draftState => {
//       draftState[0].data = newWattValuesArray
//       draftState[1].data = newCngValuesArray
//       draftState[2].data = newWaterValuesArray
//     })
    
//     let newTimes = produce(timeseries, draftState => {
//       draftState.xaxis.categories = newTimesArray
//     })
//     updateChart(newValues, newTimes)
//   }

//   function showAlert(msg) { alert(msg) }

//   return (

//     <div>
//       {/* <button onClick={() => areInitialValuesLoaded ? modifyChart() : showAlert(LOADING_MSG)}>
//         Update value
//       </button> */}
//       <Chart options={timeseries} series={values} type="line" width={1600} height={500} />

//     </div>
//   );
// }

// export default Body2


// //aws dynamodb get-item --table-name 'Subscriptions'  --key='PK':'b_1'