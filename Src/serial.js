
if ("serial" in navigator) {
    // The Web Serial API is supported.
    console.log("support serial, 1");

    document.querySelector("button").addEventListener("click", async () => {
      // Prompt user to select any serial port.
      const port = await navigator.serial.requestPort();
      // const ports = await navigator.serial.getPorts();
      //console.log(port.getInfo());

      await port.open({ baudRate: 9600 });
      console.log(port)

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();          

      // Listen to data coming from the serial device.
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
          }
          console.log(value);
        }
      } catch (error) {
        console.log(error)
      }
    });

  } else {
    console.log("not support serial");
  }
