import youtubeDataApiKey from '../api_keys/youtubeDataApiKey';

interface ILinkGenerators {
  type: string;
  id?: string;
  forUsername?: string;
  playlistId?: string;
  maxResults?: number;
  part?: string;
}

/* The object that is passed to this will be processed and a link will be returned. 
The object will have a type key with the value of the Youtube data api endpoint the request wil be in.
An exaple input object looks like this -
const optionsOne = {
        type: `channels`,
        key: `AIzaSyAcdZMDhO75zYlCi_aqRXzccVToAmQ8Quc`,
        part: `snippet,contentDetails`,
        id: UC-lHJZR3Gqxm24_Vd_AJ5Yw
      };
*/

function linkGenerator(obj: ILinkGenerators) {
  const options: any = {
    key: youtubeDataApiKey,
    type: obj.type
  };

  options[`part`] = obj.part;

  if (obj.type === `channels`) {
    if ('id' in obj) {
      options[`id`] = obj.id;
    } else {
      options[`forUsername`] = obj.forUsername;
    }
  }

  if (obj.type === `playlistItems`) {
    options[`playlistId`] = obj.playlistId;
    options[`maxResults`] = obj.maxResults;
  }

  let link = `https://www.googleapis.com/youtube/v3/`;
  link = `${link}${options.type}?`;
  delete options.type;
  const keys = Object.keys(options);

  for (const part of keys) {
    link += `${part}=${options[part]}&`;
  }

  return link;
}

export default linkGenerator;
