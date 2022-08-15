import { useEffect, useState } from 'react'
import axios from 'axios'
const CryptoJS = require("crypto-js")

const App = () => {

  // Initializing states
  let [fileInfo, setFileInfo] = useState({})
  let [fileHash, setFileHash] = useState('')
  let [scanDetails, setScanDetails] = useState([])
  let [selectedFile, setSelectedFile] = useState({})
  let [dataId, setDataId] = useState('')
  let [engines, setEngines] = useState([])


  // Logic for calculating file hash (MD5)
  const handleFile = (event) => {
    // Targets the file user selected from file input and sets it to state
    setSelectedFile(event.target.files[0])

    // Setting the targeted file to a variable as the data is not a Blob when in state, which is necessary for line 36
    let file = event.target.files[0]

    const reader = new FileReader()

    // I don't fully understand FileReader() yet
    reader.addEventListener("loadend", (e) => {
      if (e.target.readyState == FileReader.DONE) {
        //converts file to hash using crypto-js
        const hash = CryptoJS.MD5(reader.result).toString()
        setFileHash(hash)
      }
    })
    reader.readAsDataURL(file)
  }

  // Logic for checking hash against MetaDefender API. Used when form is submitted
  const checkFile = (event) => {
    event.preventDefault()

    // GET request to server to perform hash query. If successfull, sets response to state...
    axios.get(`http://localhost:3003/hash/${fileHash}`).then(
      (response) => {
        if (response.data.error) {
          // ... if hash is not found, file is uploaded using 'handleUpload' function on line 67
          handleUpload()
        } else {
          // Setting response data to state
          setFileInfo({...response.data})

          // Function explanation and code on line 107
          sortScanDetails()
        }
      }
    )
    .catch((error) => {
      console.error(error)
    })
  }


  // POST request to server
  const handleUpload = () => {
    let file = selectedFile

    // Setting form data to a variable then appending the file to it
    const formData = new FormData()
    formData.append('file', file)

    // POST request to server while passing the form data as the request body
    axios.post('http://localhost:3003/file', formData).then(
      (response) => {
        // Grabs the "data_id" from response from POST request and sets it to state
        setDataId(response.data.data_id)

        // Function to look up file by data_id (line 91)
        fileLookUp(dataId)
      }
    )
    .catch((error) => {
      console.error(error)
    })
  }


  // GET request to server to look up file by data_id
  const fileLookUp = (data_id) => {
    axios.get(`http://localhost:3003/file/${data_id}`).then(
      (response) => {
        setFileInfo({...response.data})
        sortScanDetails()

        // Logic to repeatedly send GET requests to the API if progress is not 100% complete (actually just gets stuck in an infinite loop, which does the job, but is a bug)
        if (response.data.process_info.progress_percentage !== 100) {
          fileLookUp(data_id)
        } else {
          return
        }
      }
    )
  }

  // Logic to convert the "scan_details" object from the API response into an array and set it to state so I can map through it and list all of the scan details. Also does the same for the object keys so I can pull the engine names.
  const sortScanDetails = () => {
    let detailsArray = []
    let engineArray = []

    let keys = Object.keys(fileInfo.scan_results.scan_details)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      engineArray.push(key)
      detailsArray.push(fileInfo.scan_results.scan_details[key])
    }
    setScanDetails(detailsArray)
    setEngines(engineArray)
  }


  // The below code block is used to have information displayed while working. You can put in any 'data_id' or you can query a hash with 'http://localhost:3003/hash/{hash}'
  const showData = () => {
    axios.get('http://localhost:3003/file/bzIyMDgxM0VuM0t1d3ZwXzdLT0xfQVVMd29Z')
    .then(
      (response) => {
        setFileInfo({...response.data})
        sortScanDetails()
      }
    )
    .catch((error) => console.error(error))
  }

  //*********** Uncomment the line below to have data appear *************
  // showData()

  return (
    <div>
      <h1>OPSWAT Tech Assessment</h1>
      <div>
        <form onSubmit={(event) => checkFile(event)}>
          <input id="input" type="file" name="file" onChange={(event) => handleFile(event)}></input>
          <br/>
          <button type="submit">Upload File</button>
        </form>
      </div>
      <div>
        <h2>File Information:</h2>
        <p>File Name: {fileInfo?.file_info?.display_name}</p>
        <p>Overall Status: {fileInfo?.scan_results?.scan_all_result_a}</p>
        <p>More Details:</p>
        <div class="details-container">
          <ul>
            {scanDetails.map((details, index) => {
              return (
                <>
                  <hr/>
                  <li>
                    <p>Engine: {engines[index]}</p>
                    <p>Threat Found: {details.threat_found ? details.threat_found : '0'}</p>
                    <p>Scan Result: {details.scan_result_i}</p>
                    <p>Def Time: {details.def_time}</p>
                  </li>
                  <hr/>
                </>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App;
