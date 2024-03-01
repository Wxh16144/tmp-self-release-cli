import { simpleGit } from 'simple-git';

const git = simpleGit();

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const prereleaseplatform= [
  'mac',
  'arm64',
  'linux',
  'amd64',
]

// 随机生成一个tag
export const run = async () => {

  const randomTag = `${random(1, 2)}.${random(1, 12)}.${random(1, 20)}-${prereleaseplatform[random(0, 3)]}`;


  // 如果存在tag则跳过
  git.tags((err, tags) => {
    if (tags.all.includes(randomTag)) {
      console.log(`tag: ${randomTag} already exists`);
      process.exit(0);
    }
  });

  // 创建tag
  git.addTag(randomTag, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`tag: ${randomTag} created`);
  });
}