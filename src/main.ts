import { simpleGit } from 'simple-git';
import semver from 'semver'
import { Argv } from './type';
// import fs from "fs-extra";

const git = simpleGit();

// 获取所有tag
export const getTags = async () => {
  return new Promise<string[]>((resolve, reject) => {
    git.tags((err, tags) => {
      if (err) {
        reject(err);
      }
      resolve(tags.all);
    });
  });
}

// 将tag 用 {
// [platform: string]: []
// }
function parseTags(tags: string[]) {
  const result: any = {};
  tags.forEach(tag => {
    const r = semver.parse(tag);
    const {
      prerelease,
      major,
      minor,
      patch,
    } = r;

    const version = `${major}.${minor}.${patch}`;

    const realPreRelease = prerelease[0] ?? 'default';

    if (!result[realPreRelease]) {
      result[realPreRelease] = [];
    }
    result[realPreRelease].push({
      ...r,
      version,
    });
  });

  // 排序
  Object.keys(result).forEach(key => {
    result[key].sort((a: any, b: any) => {
      return semver.rcompare(b.version, a.version);
    });
  });

  return result;
}


export function run(args: Argv) {

  const {
    major,
    minor,
    patch,
    preid,
  } = args;
  console.log('run');

  getTags().then(tags => {
    // console.log(tags);
    const rr = parseTags(tags);

    // console.log(rr);
  
    // 可用的 preid
    const preids = Object.keys(rr);

    if(!preids.includes(preid!)){
     console.log('平台不存在');
     return;
    }

    // 获取最新的tag
    const latest = rr[preid!][0];

    console.log(`latest: ${latest.version}`);


    const newTags = [
      major && semver.inc(latest.version, 'major'),
      minor && semver.inc(latest.version, 'minor'),
      patch && semver.inc(latest.version, 'patch'),
    ].filter(Boolean).map((tag: any) => `${tag}-${preid}`)

    console.log(newTags);
    

    // fs.writeJSONSync('tags.json', rr, {
    //   spaces: 2
    // });
  });
}