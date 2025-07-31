


async function fetchData() {
  // setLoading(true);
  try {
    const genAI = new GoogleGenerativeAI(chatApi);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // const result = await model.generateContent(message);
    const result = await model.generateContent(`${domainInstruction}${message}`);
    console.log(result.response.text());
    //setChat(result.response.text());
    setChat([...chat, { prompt: message, response: result.response.text() }]);
    //   setLoading(false);

  } catch (error) {
    console.log("Error:", error);
    if (error.message.includes("503")) {
      console.log("Retrying...");

      setTimeout(() => {
        fetchData();
      }, 5000);

    }
  }
  setMessage("");
}