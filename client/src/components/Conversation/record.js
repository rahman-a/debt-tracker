// const recordAudio = async (_) => {
//     if (isRecording) {
//       setIsRecording(false)
//       recorder.stop()
//       return
//     }
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//     if (stream.active) {
//       const mediaRecorder = new MediaRecorder(stream, {
//         audioBitsPerSecond: 128000,
//         mimeType: 'audio/webm',
//       })
//       console.log('mediaRecorder: ', mediaRecorder)
//       setIsRecording(true)
//       setRecorder(mediaRecorder)
//       mediaRecorder.start()
//       const audioChunks = []
//       mediaRecorder.addEventListener('dataavailable', (event) => {
//         audioChunks.push(event.data)
//       })

//       mediaRecorder.addEventListener('stop', () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
//         composeMessage('audio', audioBlob)
//         setIsRecording(false)
//       })

//       setTimeout(() => {
//         if (mediaRecorder.state !== 'inactive') mediaRecorder.stop()
//       }, 30000)
//     }
//   }
