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


  // Logic for calculating file hash (MD5)
  const handleFile = (event) => {
    // Targets the file user selected from file input
    let file = event.target.files[0]

    // Sets targeted file to state
    setSelectedFile({...file})
    console.log('hello there')
    console.log(selectedFile)
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

  // Logic to for checking hash against MetaDefender API
  const checkFile = (event) => {
    event.preventDefault()

    // GET request to server to perform hash query. If successfull, sets response to state...
    axios.get(`http://localhost:3003/hash/${fileHash}`).then(
      (response) => {
        console.log('success?')
        console.log(response.data)
        if (response.data.error) {
          handleUpload()
        } else {
          setFileInfo({...response.data})
        }
      }
    )
    .catch((error) => {
      // ... if hash is not found, file is uploaded using 'uploadFile()' function on line 57
      console.error(error)
    })
  }


  // POST request to server
  const handleUpload = () => {
    let file = selectedFile

    let formData = new FormData()

    formData.append('file', file)

    console.log('formdata below?')
    console.log(formData)

    axios.post('http://localhost:3003/file', formData).then(
      (response) => {
        console.log(response)
        console.log('ay success bb!')

        // Grabs the "data_id" from response from POST request and sets it to state
        setDataId(response.data.data_id)

        // Function to look up file by data_id
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

        // Logic to repeatedly send GET requests to the API if progress is not 100% complete (not sure if this works tbh)
        if (fileInfo.process_info.progress_percentage !== 100) {
          fileLookUp(data_id)
        } else {
          return
        }
      }
    )
  }

  // https://stackoverflow.com/questions/26795643/how-to-convert-object-containing-objects-into-array-of-objects
  
  
  // The below code block was used to have information displayed while working. It as also my 'workspace' to test things and figure out how things work with the API
  const getAPIKey = () => {
    axios.get('http://localhost:3003/hash/05C12A287334386C94131AB8AA00D08A')
    .then(
      (response) => {
        console.log(response.data)
        setFileInfo({...response.data})
        console.log('adsf')
        console.log(fileInfo)
        console.log(fileInfo.scan_results.scan_details)
        // console.log(Object.keys(fileInfo.scan_results.scan_details)[0])
        // console.log(arrayOfObj)

        // Here is where I tried to convert the "scan_details" object into an array so I could map through it and list all of the scan details
        let arrayOfObj = null
        console.log('array made??')
        arrayOfObj = Object.entries(fileInfo.scan_results.scan_details).map((e) => ( { [e[0]]: e[1] } ))
        setScanDetails([...arrayOfObj])
        console.log(scanDetails)
        console.log('working.')
        console.log(scanDetails[0]['AegisLab']['scan_time'].toString())
      }
    )
    .catch((error) => console.error(error))
  }

  
  // Hook to have getAPIKey() run on app load, so I could have some information displayed while working on the front end
  useEffect(() => {
    getAPIKey()
  }, [])
  
  return (
    <div>
      <h1>OPSWAT Tech Assessment</h1>
      <div>
        <h2>API Key Info</h2>
        <p>asdf</p><br/>
        
        <p>{fileHash}</p>
        <form onSubmit={checkFile}>
          <input id="input" type="file" name="file" onChange={(e) => handleFile(e)}></input>
          <button type="button" onClick={(e) => handleUpload(e)}>Upload File</button>
        </form>
      </div>
      <div>
        <h2>File Information:</h2>
        <p>File Name: {fileInfo?.file_info?.display_name}</p>
        <p>Overall Status: {fileInfo?.scan_results?.scan_all_result_a}</p>
        <p>More Details:</p>
        <ul>
          {scanDetails.map((details, index) => {
            return (
              <>
                <li key={index}>
                  <p>Engine: {scanDetails[index]['AegisLab']['def_time']}</p>
                  <p>Threat Found: {scanDetails[index]['AegisLab']['def_time']}</p>
                  <p>Scan Result: {scanDetails[index]['AegisLab']['def_time']}</p>
                  <p>Def Time: {scanDetails[index]['AegisLab']['def_time']}</p>
                </li>
                <hr/>
              </>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App;
