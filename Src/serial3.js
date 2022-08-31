// 2022-08-30, jjuiddong
// connect, disconnect event not work
// port close not work

if ("serial" in navigator) {
  // The Web Serial API is supported.
  console.log("support serial, 3");

  document.querySelector("button").addEventListener("click", async () => {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();

    port.addEventListener("connect", (event) => {
      // TODO: Automatically open event.target or warn user a port is available.
      console.log('connect serial')
    });
    
    port.addEventListener("disconnect", (event) => {
      // TODO: Remove |event.target| from the UI.
      // If the serial port was opened, a stream error would be observed as well.
      console.log('disconnect serial')
    });

    navigator.serial.addEventListener('connect', (event) => {
      console.log('connect serial 2')      
    });

    await port.open({ baudRate: 9600 });
    console.log(port);

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
   
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // reader.cancel() has been called.
          break;
        }
        console.log(value)
      }
    } catch (error) {
      // Handle error...
    } finally {
      // Allow the serial port to be closed later.
      reader.releaseLock();
    }
    
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);    
    
    document.querySelector('button.close').addEventListener('click', async () => {
      console.log('reader cancel')
      reader.cancel();
      await readableStreamClosed.catch(() => { /* Ignore the error */ });
      
      console.log('writer close')
      writer.close();
      await writableStreamClosed;
      
      await port.close();      
    });


  });
} else {
  console.log("not support serial");
}
