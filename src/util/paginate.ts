import * as console from "console";

export const paginate = async (page:string, size: string, data:any) => {
  const start = (parseInt(page)-1)*parseInt(size);
  const end = parseInt(size) * parseInt(page) -1;
  const output: any[] = [];
  data.map((it:any, i:number) => {
    if(i>=start && i<=end){
      output.push(it);
    }
  });
  const relativeEnd = end + 1;
  return {
    total: data.length,
    start: start+1,
    end: relativeEnd>data.length?data.length:relativeEnd,
    totalPage: Math.ceil(data.length/parseInt(size)),
    currentPage: parseInt(page),
    data: output
  }
}