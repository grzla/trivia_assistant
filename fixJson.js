let json = `[{"type":"text","text":{"value":"{\n  \"categories\": [\n    {\n      \"category\": \"Pop Culture\",\n      \"questions\": [\n        {\n          \"difficulty\": \"Easy\",\n          \"question\": \"In the animated series SpongeBob SquarePants, in what item does SpongeBob reside?\",\n          \"answer\": \"Pineapple\"\n        },\n        {\n          \"difficulty\": \"Medium\",\n          \"question\": \"What former CEO of WeWork is giving up on plans to reacquire the company after a bankruptcy plan recently excluded him from the company's future?\",\n          \"answer\": \"Adam Neumann\"\n        },\n        {\n          \"difficulty\": \"Medium\",\n          \"question\": \"What is the main item that can be found in Sandy Cheeks' dome in the animated Nickelodeon series SpongeBob SquarePants?\",\n          \"answer\": \"Tree\"\n        }\n      ]\n    },\n    {\n      \"category\": \"General Knowledge\",\n      \"questions\": [\n        {\n          \"difficulty\": \"Easy\",\n          \"question\": \"Priyanka Chopra played Victoria Leeds in what 2017 movie?\",\n          \"answer\": \"Baywatch\"\n        },\n        {\n          \"difficulty\": \"Medium\",\n          \"question\": \"What is the least densely populated state in the US per square mile?\",\n          \"answer\": \"Alaska\"\n        },\n        {\n          \"difficulty\": \"Medium\",\n          \"question\": \"What relation was Napoleon III to the first Napoleon emperor?\",\n          \"answer\": \"Nephew\"\n        }\n      ]\n    },\n    {\n      \"category\": \"Bonus Round\",\n      \"questions\": [\n        {\n          \"difficulty\": \"Hard\",\n          \"question\": \"Who did President Eisenhower beat in his second election?\",\n          \"answer\": \"Adlai E. Stevenson\"\n        },\n        {\n          \"difficulty\": \"Hard\",\n          \"question\": \"In 1960, the Motown record label was founded in what city?\",\n          \"answer\": \"Detroit\"\n        },\n        {\n          \"difficulty\": \"Hard\",\n          \"question\": \"What is the first book of the New Testament in the Bible?\",\n          \"answer\": \"Matthew\"\n        }\n      ]\n    }\n  ]\n}","annotations":[]}}]`

function fixJson(triviaResponse) {
    // match starting from the first occurrence of '{ "categories"'
    // to the first occurrence of '","annotations"'
    const regex = /\{[\s\S]{0,10}"categories"[\s\S]*\}(?=[\s\S]{0,10}"annotations")/;

    let result = triviaResponse.match(regex);
    
    
    if (result) {
      // replace the brackets that were stripped
      result = `[\n${result[0]}\n]`;
      return result
    }
    
    return "";
  }

  console.log(fixJson(json));