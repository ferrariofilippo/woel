import fs from "fs";
import matter from "gray-matter";
import path from "path";
import slugify from "slugify";

const baseDirectory = path.join(process.cwd(), "i18n");
export function getFileName(slug: string, contentDir: string) {
  const posts = getSortedPostsData(contentDir);
  const fileName = posts
    .filter((post: any) => post.slug == slug)
    .map((post: any) => post.fileName)
    .pop();
  return fileName;
}
export function getPost(filename: string): any;
export function getPost(filename: string, customUrl?: string): any;
export function getPost(filename: string, customUrl?: string): any {
  if (filename === null) {
    return null;
  }
  let finalPath = path.join(baseDirectory, filename);

  if (customUrl) {
    finalPath = path.join(baseDirectory, customUrl, filename);
  }
  return matter.read(finalPath);
}

export function getSortedPostsData(contentDir: string) {
  const fileNames = fs.readdirSync(path.join(baseDirectory, contentDir));
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(baseDirectory, contentDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return {
      id,
      ...matterResult.data,
      slug: slugify(matterResult.data.title, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      }),
      date: getFileInfo(fileName, contentDir).birthtime.toDateString(),
      lastUpdatedAt: getFileInfo(fileName, contentDir).mtime.toDateString(),
      fileName: fileName,
    };
  });
  return allPostsData.sort((a: any, b: any) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
export const getFileInfo = (filePath: string, contentDir: string) => {
  const fileInfo = fs.statSync(path.join(baseDirectory, contentDir, filePath));
  return fileInfo;
};
