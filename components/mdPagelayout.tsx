import { getPost } from "@/lib/utils/contentHelper";
import * as path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const contentDir = path.basename(__dirname);

export default function MdPageLayout({ locale }: { locale: string }) {
  const document = getPost(contentDir + "." + locale + ".md");
  return (
    <article className=" prose prose-stone dark:prose-invert">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {document.data.title}
      </h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {document.content}
      </ReactMarkdown>
    </article>
  );
}
