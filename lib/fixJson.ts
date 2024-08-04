import {log, logging} from "@/lib/logging";
// fixes the json string returned by the API since it does not want to return a valid JSON string

export default function fixJson(triviaResponse: string): string {
  // match starting from the first occurrence of '{ "categories"'
  // to the first occurrence of '","annotations"'
  const regex = /\{[\s\S]{0,10}"categories"[\s\S]*\}(?=[\s\S]{0,10}"annotations")/;

  let result = JSON.stringify(triviaResponse).match(regex);
  
  
  if (result) {
    // replace the brackets that were stripped
    const resultString = `[\n${result[0]}\n]`;
    return resultString
  }
  
  return "";
}

/*
export default function fixJson(text: string): string {

  let result = "";
  let startIndex = text.indexOf('categories');
  startIndex--
  log(`startIndex: ${startIndex}`, "blue");

  if (startIndex !== -1) {
    result = text.substring(startIndex);
  }
  const endIndex = result.indexOf('","annotations"');
  if (endIndex !== -1) {
    result = result.substring(0, endIndex);
  }
  return result.trim();
}
/*
export default function fixJson(text: string): string {
    // Strip everything up to the first occurrence of '[{ "category"'
    let result = "";
    const startIndex = text.indexOf('{\n "categories');
    // log(`startIndex: ${startIndex}`, "blue");
    if (startIndex !== -1) {
      result = text.substring(startIndex);
      // log(`startIndex trim: ${result}`);
    }
    // Strip everything including and following '"","annotations"'
    const endIndex = result.indexOf('","annotations"');
    if (endIndex !== -1) {
      result = result.substring(0, endIndex);
    }
    return result;
}
*/