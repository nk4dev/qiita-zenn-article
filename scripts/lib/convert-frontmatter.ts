import { existsSync, readFileSync } from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  return undefined;
}

function toTagName(entry: unknown): string {
  let raw = "";
  if (typeof entry === "string") {
    raw = entry;
  } else if (entry && typeof entry === "object" && "name" in entry) {
    const rawName = (entry as { name?: unknown }).name;
    raw = rawName != null ? String(rawName) : "";
  } else if (entry != null) {
    raw = String(entry);
  }

  const cleaned = raw.trim().replace(/^#/, "").trim();
  const atIndex = cleaned.indexOf("@");
  return atIndex === -1 ? cleaned : cleaned.slice(0, atIndex).trim();
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed !== "" ? trimmed : null;
}

function normalizeUpdatedAt(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
}

const HANDLED_OR_REMOVED_KEYS = new Set([
  "emoji",
  "type",
  "published",
  "topics",
  "title",
  "tags",
  "private",
  "updated_at",
  "id",
  "organization_url_name",
  "slide",
  "ignorePublish",
  "posting_campaign_uuid",
  "agreed_posting_campaign_term",
]);

export function convertFrontmatter(outputPath?: string) {
  return function _convertFrontmatter(inputContent: string) {
    const { data, content } = matter(inputContent);
    const dataCloned = { ...data } as Record<string, unknown>;

    // Load existing output frontmatter so Qiita-assigned metadata is preserved.
    // Let read/parse errors throw rather than silently dropping an existing `id`.
    const existingData: Record<string, unknown> =
      outputPath && existsSync(outputPath)
        ? (matter(readFileSync(outputPath, "utf8")).data as Record<
            string,
            unknown
          >)
        : {};

    const rawTags = Array.isArray(dataCloned.tags) ? dataCloned.tags : [];
    const rawTopics = Array.isArray(dataCloned.topics)
      ? dataCloned.topics
      : dataCloned.topics != null
        ? [dataCloned.topics]
        : [];

    const dedupedTags = new Map<string, string>();
    for (const entry of [...rawTags, ...rawTopics]) {
      const tagName = toTagName(entry);
      if (!tagName) {
        continue;
      }
      const key = tagName.toLowerCase();
      if (!dedupedTags.has(key)) {
        dedupedTags.set(key, tagName);
      }
    }

    const organizationUrlName =
      "organization_url_name" in dataCloned
        ? normalizeOptionalString(dataCloned.organization_url_name)
        : normalizeOptionalString(existingData.organization_url_name);

    const slide =
      parseBoolean(dataCloned.slide) ??
      parseBoolean(existingData.slide) ??
      false;

    const ignorePublish =
      parseBoolean(dataCloned.ignorePublish) ??
      parseBoolean(existingData.ignorePublish) ??
      false;

    const orderedData: Record<string, unknown> = {
      title: dataCloned.title == null ? "" : String(dataCloned.title),
      tags: Array.from(dedupedTags.values()),
      private: !Boolean(dataCloned.published),
      updated_at: normalizeUpdatedAt(existingData.updated_at),
      id: normalizeOptionalString(existingData.id),
      organization_url_name: organizationUrlName,
      slide,
      ignorePublish,
    };

    if (
      "posting_campaign_uuid" in dataCloned &&
      dataCloned.posting_campaign_uuid !== undefined
    ) {
      orderedData.posting_campaign_uuid = dataCloned.posting_campaign_uuid;
    } else if (existingData.posting_campaign_uuid !== undefined) {
      orderedData.posting_campaign_uuid = existingData.posting_campaign_uuid;
    }

    if (
      "agreed_posting_campaign_term" in dataCloned &&
      dataCloned.agreed_posting_campaign_term !== undefined
    ) {
      orderedData.agreed_posting_campaign_term =
        parseBoolean(dataCloned.agreed_posting_campaign_term) ?? false;
    } else if (existingData.agreed_posting_campaign_term !== undefined) {
      orderedData.agreed_posting_campaign_term =
        parseBoolean(existingData.agreed_posting_campaign_term) ?? false;
    }

    for (const [key, value] of Object.entries(dataCloned)) {
      if (!HANDLED_OR_REMOVED_KEYS.has(key)) {
        orderedData[key] = value;
      }
    }

    const frontmatter = yaml.dump(orderedData, { lineWidth: -1 });
    return `---\n${frontmatter}---\n${content}`;
  };
}
