export async function getMainCharacters(imageUrl: string): Promise<number> {
  try {
    const url = new URL("https://serverless.roboflow.com/poster-zjn5j/11");
    url.searchParams.append("api_key", process.env.ROBOFLOW_API_KEY || "");
    url.searchParams.append("image", imageUrl);
    
    const response = await fetch(url.toString(), {
      method: "POST",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Count the number of main characters (where class is "subject")
    const mainCharactersCount = data.predictions.filter(
      (prediction: any) => prediction.class === "subject" && prediction.confidence > 0.65
    ).length;
    
    return mainCharactersCount;
  } catch (error) {
    console.error("Error in getMainCharacters:", error);
    throw error;
  }
}