if ("serial" in navigator) {
  // The Web Serial API is supported.
  console.log("support serial, 2");

  document.querySelector("button").addEventListener("click", async () => {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    console.log(port);

    let keepReading = true;
    let reader
    let textDecoder = new TextDecoder()    
    
    async function readUntilClosed() {
      while (port.readable && keepReading) {
        reader = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // reader.cancel() has been called.
              break;
            }
            console.log(textDecoder.decode(value))
          }
        } catch (error) {
          // Handle error...
        } finally {
          // Allow the serial port to be closed later.
          reader.releaseLock();
        }
      }
    
      console.log('serial close')
      await port.close();
    }
    
    const closedPromise = readUntilClosed();
    
    document.querySelector('button.close').addEventListener('click', async () => {
      // User clicked a button to close the serial port.
      keepReading = false;
      // Force reader.read() to resolve immediately and subsequently
      // call reader.releaseLock() in the loop example above.
      console.log('serial cancel')
      reader.cancel();
      await closedPromise;
    });


  });
} else {
  console.log("not support serial");
}
