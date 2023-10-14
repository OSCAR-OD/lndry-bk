const SPLIT = (data: unknown[], size: number = 5) => {
  return data.reduce((resultArray : any, item : unknown, index: number) => {
    const chunkIndex = Math.floor(index/size);
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray
  }, []);
}

export default SPLIT;