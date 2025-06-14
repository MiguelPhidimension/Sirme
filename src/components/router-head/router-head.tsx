import React from "react";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 * In React, this would typically be handled by React Helmet or similar library,
 * but for now we'll create a basic version that can be extended.
 */

interface HeadMeta {
  key?: string;
  name?: string;
  content?: string;
  property?: string;
  [key: string]: any;
}

interface HeadLink {
  key?: string;
  rel?: string;
  href?: string;
  [key: string]: any;
}

interface HeadStyle {
  key?: string;
  props?: any;
  style?: string;
}

interface HeadScript {
  key?: string;
  props?: any;
  script?: string;
}

interface DocumentHead {
  title?: string;
  meta: HeadMeta[];
  links: HeadLink[];
  styles: HeadStyle[];
  scripts: HeadScript[];
}

interface RouterHeadProps {
  head?: DocumentHead;
  location?: {
    url: {
      href: string;
    };
  };
}

export const RouterHead: React.FC<RouterHeadProps> = ({ 
  head = { title: '', meta: [], links: [], styles: [], scripts: [] },
  location = { url: { href: '' } }
}) => {
  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={location.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
};
