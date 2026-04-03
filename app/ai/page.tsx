import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";

type SearchParamValue = string | string[] | undefined;
type SearchParams = Record<string, SearchParamValue>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

type DocFile = {
  relativePath: string;
  extension: string;
  title: string;
  content: string;
  sizeBytes: number;
  updatedAt: Date;
};

type DocLookup = {
  keyToPath: Map<string, string>;
  extensions: string[];
};

const DOC_ORDER = [
  "index.md",
  "quickstart.md",
  "api-reference.md",
  "strategies.md",
  "examples/python.md",
  "examples/nodejs.md",
  "schema.json",
  "openapi.yaml",
  "discover.html",
];

const SUPPORTED_EXTENSIONS = new Set(["md", "html", "json", "yaml", "yml"]);

export default async function DocsPage(props: PageProps) {
  const docs = await loadDocs();
  const lookup = buildDocLookup(docs);
  const searchParams = (await props.searchParams) ?? {};
  const selectedPath = parseSelectedPath(searchParams.doc, docs);
  const selectedDoc = docs.find((doc) => doc.relativePath === selectedPath) ?? docs[0];
  const stats = summarizeDocs(docs);
  const groupedDocs = groupDocs(docs);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--bg-primary)]">
      <header className="flex w-full items-center justify-between gap-8 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-6 py-4 md:px-10 lg:px-[80px]">
        <Link
          href="/"
          className="font-jetbrains text-[20px] font-bold tracking-[1px] text-[var(--text-primary)] md:text-[22px]"
        >
          MUSASHI
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/mission"
            className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            MISSION
          </Link>
          <Link
            href="/ai"
            className="font-jetbrains text-xs font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--text-primary)]"
          >
            API
          </Link>
          <Link
            href="/pricing"
            className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            PRICING
          </Link>
          <Link
            href="/privacy"
            className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            PRIVACY
          </Link>
        </nav>
        <Link
          href="/install"
          className="border border-[#FFFFFF40] bg-transparent px-5 py-[10px] transition-colors hover:bg-[var(--overlay-light)]"
        >
          <span className="font-jetbrains text-xs font-bold text-[var(--text-primary)]">Install</span>
        </Link>
      </header>

      <main className="flex w-full flex-1 flex-col px-6 py-8 md:px-10 md:py-10 lg:px-[80px] lg:py-12">
        <section className="mb-8 flex w-full flex-col gap-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-6 md:mb-10 md:p-8">
          <div className="border-l-4 border-[var(--text-primary)] pl-4">
            <h1 className="font-grotesk text-[32px] font-bold tracking-[-1px] text-[var(--text-primary)] md:text-[42px]">
              Docs Console
            </h1>
            <p className="mt-2 font-jetbrains text-sm text-[var(--text-secondary)]">
              Unified documentation for AI agents, API schema, and integration examples.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCell label="FILES" value={String(stats.fileCount)} />
            <StatCell label="SIZE" value={stats.totalSize} />
            <StatCell label="FORMATS" value={stats.formatSummary} />
            <StatCell label="UPDATED" value={stats.lastUpdated} />
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full border border-[var(--border-primary)] bg-[var(--bg-tertiary)] lg:sticky lg:top-6 lg:w-[320px] lg:shrink-0">
            <div className="border-b border-[var(--border-primary)] px-5 py-4">
              <p className="font-jetbrains text-[11px] font-bold tracking-[2px] text-[var(--text-light)]">
                {"// DOC TREE"}
              </p>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-3">
              {groupedDocs.map((group) => (
                <div key={group.name} className="mb-4 last:mb-0">
                  <p className="mb-2 px-2 font-jetbrains text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-tertiary)]">
                    {group.name}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((doc) => {
                      const isActive = doc.relativePath === selectedDoc.relativePath;
                      return (
                        <Link
                          key={doc.relativePath}
                          href={`/ai?doc=${encodeURIComponent(doc.relativePath)}`}
                          className={`block border px-3 py-2 transition-colors ${
                            isActive
                              ? "border-[var(--text-primary)] bg-[var(--overlay-light)]"
                              : "border-transparent hover:border-[var(--border-primary)] hover:bg-[var(--overlay-lighter)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className={`font-jetbrains text-xs ${
                                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                              }`}
                            >
                              {doc.title}
                            </span>
                            <span className="font-jetbrains text-[10px] uppercase text-[var(--text-tertiary)]">
                              {doc.extension}
                            </span>
                          </div>
                          <p className="mt-1 truncate font-jetbrains text-[10px] text-[var(--text-tertiary)]">
                            {doc.relativePath}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <article className="w-full border border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
            <div className="flex flex-col gap-2 border-b border-[var(--border-primary)] px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-4">
              <div>
                <h2 className="font-grotesk text-[26px] font-bold tracking-[-0.5px] text-[var(--text-primary)]">
                  {selectedDoc.title}
                </h2>
                <p className="font-jetbrains text-[11px] text-[var(--text-tertiary)]">{selectedDoc.relativePath}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-jetbrains text-[10px] uppercase text-[var(--text-tertiary)]">
                  {selectedDoc.extension}
                </span>
                <span className="font-jetbrains text-[10px] text-[var(--text-tertiary)]">
                  {formatBytes(selectedDoc.sizeBytes)}
                </span>
              </div>
            </div>

            <div className="px-5 py-6 md:px-8 md:py-8">
              {selectedDoc.extension === "md" ? (
                <MarkdownRenderer content={selectedDoc.content} lookup={lookup} />
              ) : (
                <CodeRenderer content={selectedDoc.content} language={selectedDoc.extension} />
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3">
      <p className="font-jetbrains text-[10px] font-bold tracking-[1.5px] text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-1 font-jetbrains text-sm font-medium text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function MarkdownRenderer({ content, lookup }: { content: string; lookup: DocLookup }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let blockKey = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (/^\s*$/.test(line)) {
      index += 1;
      continue;
    }

    const fencedCodeMatch = line.match(/^```([\w-]+)?\s*$/);
    if (fencedCodeMatch) {
      const language = fencedCodeMatch[1] ?? "text";
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      blocks.push(
        <CodeRenderer
          key={`code-${blockKey}`}
          content={codeLines.join("\n")}
          language={language}
        />,
      );
      blockKey += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      blocks.push(renderHeading(level, text, id, lookup, blockKey));
      blockKey += 1;
      index += 1;
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${blockKey}`} className="my-2 border-[var(--border-primary)]" />);
      blockKey += 1;
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${blockKey}`}
          className="border-l-2 border-[var(--text-lighter)] bg-[var(--overlay-lighter)] px-4 py-3 font-jetbrains text-sm leading-[1.75] text-[var(--text-secondary)]"
        >
          {renderInline(quoteLines.join(" "), lookup, `quote-${blockKey}`)}
        </blockquote>,
      );
      blockKey += 1;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const itemMatch = lines[index].match(/^\s*[-*+]\s+(.+)$/);
        if (!itemMatch) {
          break;
        }
        items.push(itemMatch[1].trim());
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${blockKey}`} className="list-disc space-y-2 pl-5">
          {items.map((item, itemIndex) => (
            <li
              key={`ul-${blockKey}-${itemIndex}`}
              className="font-jetbrains text-sm leading-[1.8] text-[var(--text-secondary)]"
            >
              {renderInline(item, lookup, `ul-${blockKey}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      );
      blockKey += 1;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const itemMatch = lines[index].match(/^\s*\d+\.\s+(.+)$/);
        if (!itemMatch) {
          break;
        }
        items.push(itemMatch[1].trim());
        index += 1;
      }
      blocks.push(
        <ol key={`ol-${blockKey}`} className="list-decimal space-y-2 pl-5">
          {items.map((item, itemIndex) => (
            <li
              key={`ol-${blockKey}-${itemIndex}`}
              className="font-jetbrains text-sm leading-[1.8] text-[var(--text-secondary)]"
            >
              {renderInline(item, lookup, `ol-${blockKey}-${itemIndex}`)}
            </li>
          ))}
        </ol>,
      );
      blockKey += 1;
      continue;
    }

    if (looksLikeTable(lines, index)) {
      const headerCells = parseTableRow(lines[index]);
      index += 2;
      const rowCells: string[][] = [];
      while (index < lines.length && /^\s*\|/.test(lines[index])) {
        rowCells.push(parseTableRow(lines[index]));
        index += 1;
      }

      blocks.push(
        <div key={`table-${blockKey}`} className="overflow-x-auto border border-[var(--border-primary)]">
          <table className="min-w-full border-collapse">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {headerCells.map((headerCell, cellIndex) => (
                  <th
                    key={`thead-${blockKey}-${cellIndex}`}
                    className="border-b border-[var(--border-primary)] px-3 py-2 text-left font-jetbrains text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {renderInline(headerCell, lookup, `thead-${blockKey}-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowCells.map((row, rowIndex) => (
                <tr key={`tbody-${blockKey}-${rowIndex}`} className="border-b border-[var(--border-primary)] last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`td-${blockKey}-${rowIndex}-${cellIndex}`}
                      className="px-3 py-2 font-jetbrains text-xs leading-[1.7] text-[var(--text-secondary)]"
                    >
                      {renderInline(cell, lookup, `td-${blockKey}-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      blockKey += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && !isBlockStart(lines, index)) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push(
        <p
          key={`p-${blockKey}`}
          className="font-jetbrains text-sm leading-[1.85] text-[var(--text-secondary)]"
        >
          {renderInline(paragraphLines.join(" "), lookup, `p-${blockKey}`)}
        </p>,
      );
      blockKey += 1;
    }
  }

  return <div className="space-y-5">{blocks}</div>;
}

function CodeRenderer({ content, language }: { content: string; language: string }) {
  return (
    <div className="overflow-x-auto border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] px-3 py-2">
        <span className="font-jetbrains text-[10px] uppercase tracking-[1px] text-[var(--text-tertiary)]">{language}</span>
      </div>
      <pre className="p-4 font-jetbrains text-xs leading-[1.75] text-[var(--text-secondary)]">
        <code>{content}</code>
      </pre>
    </div>
  );
}

function renderHeading(
  level: number,
  text: string,
  id: string,
  lookup: DocLookup,
  key: number,
): ReactNode {
  if (level === 1) {
    return (
      <h1
        key={`h1-${key}`}
        id={id}
        className="scroll-mt-20 border-l-4 border-[var(--text-primary)] pl-4 font-grotesk text-[34px] font-bold tracking-[-0.8px] text-[var(--text-primary)]"
      >
        {renderInline(text, lookup, `h1-${key}`)}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2
        key={`h2-${key}`}
        id={id}
        className="scroll-mt-20 pt-2 font-grotesk text-[24px] font-bold tracking-[-0.3px] text-[var(--text-primary)]"
      >
        {renderInline(text, lookup, `h2-${key}`)}
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3
        key={`h3-${key}`}
        id={id}
        className="scroll-mt-20 font-jetbrains text-[16px] font-semibold text-[var(--text-primary)]"
      >
        {renderInline(text, lookup, `h3-${key}`)}
      </h3>
    );
  }

  return (
    <h4
      key={`h4-${key}`}
      id={id}
      className="scroll-mt-20 font-jetbrains text-sm font-semibold text-[var(--text-primary)]"
    >
      {renderInline(text, lookup, `h4-${key}`)}
    </h4>
  );
}

function renderInline(text: string, lookup: DocLookup, keyPrefix: string): ReactNode[] {
  const pattern = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const segments = text.split(pattern);

  return segments.map((segment, index) => {
    if (!segment) {
      return null;
    }

    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-code-${index}`}
          className="rounded bg-[var(--overlay-lighter)] px-1.5 py-0.5 font-jetbrains text-[12px] text-[var(--text-light)]"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = resolveLink(linkMatch[2], lookup);
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          key={`${keyPrefix}-link-${index}`}
          href={href}
          className="text-[var(--text-primary)] underline decoration-[var(--border-primary)] underline-offset-2 hover:decoration-[var(--text-primary)]"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      );
    }

    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-[var(--text-primary)]">
          {segment.slice(2, -2)}
        </strong>
      );
    }

    if (segment.startsWith("*") && segment.endsWith("*")) {
      return (
        <em key={`${keyPrefix}-em-${index}`} className="italic text-[var(--text-light)]">
          {segment.slice(1, -1)}
        </em>
      );
    }

    return <span key={`${keyPrefix}-text-${index}`}>{segment}</span>;
  });
}

function resolveLink(rawLink: string, lookup: DocLookup): string {
  const trimmedLink = rawLink.trim();

  if (/^(https?:\/\/|mailto:)/i.test(trimmedLink) || trimmedLink.startsWith("#")) {
    return trimmedLink;
  }

  const [pathPart, hashPart] = trimmedLink.split("#");
  const normalizedPath = normalizeDocPath(pathPart);
  const resolvedPath = findDocPath(normalizedPath, lookup);

  if (!resolvedPath) {
    return trimmedLink;
  }

  const hashSuffix = hashPart ? `#${hashPart}` : "";
  return `/ai?doc=${encodeURIComponent(resolvedPath)}${hashSuffix}`;
}

function findDocPath(normalizedPath: string, lookup: DocLookup): string | null {
  const normalized = normalizedPath.toLowerCase();
  if (!normalized) {
    return null;
  }

  const aliasCandidates: string[] = [];
  const baseName = path.posix.basename(normalized);

  aliasCandidates.push(normalized, baseName, normalized.replace(/\.[^.]+$/, ""));

  if (!/\.[^.]+$/.test(normalized)) {
    for (const extension of lookup.extensions) {
      aliasCandidates.push(`${normalized}.${extension}`, `${baseName}.${extension}`);
    }
  }

  if (baseName.includes("python-agent")) {
    aliasCandidates.push("examples/python.md");
  }
  if (baseName.includes("nodejs-agent")) {
    aliasCandidates.push("examples/nodejs.md");
  }
  if (baseName === "ai-agents.md") {
    aliasCandidates.push("index.md");
  }
  if (normalized.includes("trading-strategies")) {
    aliasCandidates.push("strategies.md");
  }

  for (const candidate of aliasCandidates) {
    const resolved = lookup.keyToPath.get(candidate);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

function looksLikeTable(lines: string[], index: number): boolean {
  if (index + 1 >= lines.length) {
    return false;
  }

  const headerLine = lines[index];
  const separatorLine = lines[index + 1];
  return /^\s*\|.+\|\s*$/.test(headerLine) && /^\s*\|[\s:|-]+\|\s*$/.test(separatorLine);
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index];
  if (/^\s*$/.test(line)) {
    return true;
  }
  if (/^```/.test(line)) {
    return true;
  }
  if (/^(#{1,6})\s+/.test(line)) {
    return true;
  }
  if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
    return true;
  }
  if (/^\s*>\s?/.test(line)) {
    return true;
  }
  if (/^\s*[-*+]\s+/.test(line)) {
    return true;
  }
  if (/^\s*\d+\.\s+/.test(line)) {
    return true;
  }
  if (looksLikeTable(lines, index)) {
    return true;
  }
  return false;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function groupDocs(docs: DocFile[]): Array<{ name: string; items: DocFile[] }> {
  const buckets = new Map<string, DocFile[]>();

  for (const doc of docs) {
    const directory = path.posix.dirname(doc.relativePath);
    const groupName = directory === "." ? "Core" : toTitleCase(directory);
    const existing = buckets.get(groupName) ?? [];
    existing.push(doc);
    buckets.set(groupName, existing);
  }

  return Array.from(buckets.entries())
    .sort(([nameA], [nameB]) => {
      if (nameA === "Core") {
        return -1;
      }
      if (nameB === "Core") {
        return 1;
      }
      return nameA.localeCompare(nameB);
    })
    .map(([name, items]) => ({ name, items }));
}

function toTitleCase(value: string): string {
  return value
    .split("/")
    .join(" ")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function summarizeDocs(docs: DocFile[]) {
  const totalBytes = docs.reduce((sum, doc) => sum + doc.sizeBytes, 0);
  const formats = new Set(docs.map((doc) => doc.extension.toUpperCase()));
  const latest = docs.reduce((max, doc) => (doc.updatedAt > max ? doc.updatedAt : max), new Date(0));

  return {
    fileCount: docs.length,
    totalSize: formatBytes(totalBytes),
    formatSummary: Array.from(formats).sort().join(" / "),
    lastUpdated: formatDate(latest),
  };
}

function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }
  return `${(value / 1024).toFixed(1)} KB`;
}

function formatDate(value: Date): string {
  if (value.getTime() === 0) {
    return "--";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
}

function parseSelectedPath(value: SearchParamValue, docs: DocFile[]): string {
  const selected = Array.isArray(value) ? value[0] : value;
  if (!selected) {
    return docs[0]?.relativePath ?? "";
  }

  const normalized = normalizeDocPath(decodeURIComponent(selected));
  const match = docs.find((doc) => doc.relativePath.toLowerCase() === normalized.toLowerCase());
  return match?.relativePath ?? docs[0]?.relativePath ?? "";
}

function normalizeDocPath(filePath: string): string {
  return filePath
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/^docs\//, "")
    .replace(/^ai\//, "")
    .replace(/^\/+/, "")
    .trim();
}

function buildDocLookup(docs: DocFile[]): DocLookup {
  const keyToPath = new Map<string, string>();
  const extensionSet = new Set<string>();

  for (const doc of docs) {
    const normalizedPath = doc.relativePath.toLowerCase();
    const baseName = path.posix.basename(normalizedPath);
    const withoutExtension = normalizedPath.replace(/\.[^.]+$/, "");

    keyToPath.set(normalizedPath, doc.relativePath);
    keyToPath.set(baseName, doc.relativePath);
    keyToPath.set(withoutExtension, doc.relativePath);
    extensionSet.add(doc.extension.toLowerCase());
  }

  return {
    keyToPath,
    extensions: Array.from(extensionSet).sort(),
  };
}

async function loadDocs(): Promise<DocFile[]> {
  const docsRoot = await resolveDocsRoot();
  const relativeFiles = await collectFiles(docsRoot);
  const docs = await Promise.all(
    relativeFiles.map(async (relativePath) => {
      const absolutePath = path.join(docsRoot, relativePath);
      const [content, stat] = await Promise.all([
        fs.readFile(absolutePath, "utf8"),
        fs.stat(absolutePath),
      ]);

      return {
        relativePath,
        extension: path.extname(relativePath).replace(/^\./, "").toLowerCase(),
        title: deriveTitle(relativePath, content),
        content,
        sizeBytes: stat.size,
        updatedAt: stat.mtime,
      };
    }),
  );

  return docs.sort((docA, docB) => compareDocOrder(docA.relativePath, docB.relativePath));
}

async function resolveDocsRoot(): Promise<string> {
  const candidates = [path.resolve(process.cwd(), "..", "ai"), path.resolve(process.cwd(), "ai")];
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }
  throw new Error("Unable to locate /ai documentation folder.");
}

async function collectFiles(rootPath: string, subPath = "."): Promise<string[]> {
  const currentPath = path.resolve(rootPath, subPath);
  const entries = await fs.readdir(currentPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    if (entry.isDirectory()) {
      const nestedPath = path.join(subPath, entry.name);
      const nestedFiles = await collectFiles(rootPath, nestedPath);
      files.push(...nestedFiles);
      continue;
    }

    const extension = path.extname(entry.name).replace(/^\./, "").toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      continue;
    }
    files.push(normalizeDocPath(path.join(subPath, entry.name)));
  }

  return files;
}

function deriveTitle(relativePath: string, content: string): string {
  const extension = path.extname(relativePath).replace(/^\./, "").toLowerCase();

  if (extension === "md") {
    const firstHeading = content
      .replace(/\r\n/g, "\n")
      .split("\n")
      .find((line) => line.startsWith("# "));
    if (firstHeading) {
      return firstHeading.replace(/^#\s+/, "").trim();
    }
  }

  if (extension === "html") {
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }

  const baseName = path.basename(relativePath, path.extname(relativePath));
  return toTitleCase(baseName);
}

function compareDocOrder(pathA: string, pathB: string): number {
  const rankA = DOC_ORDER.indexOf(pathA);
  const rankB = DOC_ORDER.indexOf(pathB);

  if (rankA !== -1 && rankB !== -1) {
    return rankA - rankB;
  }
  if (rankA !== -1) {
    return -1;
  }
  if (rankB !== -1) {
    return 1;
  }
  return pathA.localeCompare(pathB);
}
