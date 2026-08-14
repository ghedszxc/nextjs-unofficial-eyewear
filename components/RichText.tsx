import React, { ReactElement } from "react";

import {
  BlockTypes,
  MarkTypes,
  StoryblokRichTextNode,
  StoryblokRichTextProps,
  StoryblokServerRichText,
} from "@storyblok/react/rsc";
import Link from "next/link";
import Image from "next/image";
import { getStoryblokRoot } from "@/constants/storyblok";
import { getOriginalWidthHeightImg } from "@/lib/utils";

type RichTextProps = Pick<StoryblokRichTextProps, "doc"> & {
  className?: {
    div?: string;
    p?: string;
    a?: string;
  };
};

const RichText = (props: RichTextProps) => {
  const resolvers = {
    // custom resolvers
    [MarkTypes.LINK]: (node: StoryblokRichTextNode<ReactElement>) => {
      // Internal Link
      return node.attrs?.linktype === "story" ? (
        <Link
          href={node?.attrs?.href?.replace(new RegExp(`^/?${getStoryblokRoot()}/[^/]+`), "")}
          target={node.attrs?.target}
          key={node?.attrs?.uuid}
          className={props.className?.a}
        >
          {node.text}
        </Link>
      ) : (
        // External Link
        <a href={node.attrs?.href} target="_blank" key={node?.attrs?.href} className={props.className?.a}>
          {node.text}
        </a>
      );
    },

    // Image
    [BlockTypes.IMAGE]: (node: StoryblokRichTextNode<ReactElement>) => {
      const { width, height } = getOriginalWidthHeightImg(node?.attrs?.src);
      return (
        <Image
          key={node?.attrs?.id}
          src={node?.attrs?.src}
          alt={node?.attrs?.alt}
          width={width}
          height={height}
          
        />
      );
    },

    // Paragraph - allow dynamic class on <p>
    [BlockTypes.PARAGRAPH]: (node: StoryblokRichTextNode<ReactElement>) => {
      return <p key={node?.attrs?.id ?? Math.random()} className={props.className?.p}>{node.children}</p>;
    },
  };

  return (
    <div className={props.className?.div}>
      <StoryblokServerRichText
        doc={{
          type: props.doc.type,
          content: props.doc.content,
        }}
        resolvers={resolvers}
      />
    </div>
  );
};
export default RichText;
