import { existsSync, readFileSync } from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";

export function convertFrontmatter(outputPath?: string) {
  return function _convertFrontmatter(inputContent: string) {
    const { data, content } = matter(inputContent);
    const dataCloned = { ...data };

    // Remove unnecessary fields
    delete dataCloned.emoji;
    delete dataCloned.type;

    // Convert published to private (reversed)
    dataCloned.private = !dataCloned.published;
    delete dataCloned.published;

    // Convert topics to Qiita-style tag objects and merge with existing tags.
    // Qiita tags are objects like: { name: 'TagName', versions?: ['...'] }
    // Additionally, we parse versioned topics that use the `@` syntax,
    // e.g. `package@1.x` -> { name: 'package', versions: ['1.x'] }.
    function toTagObject(entry: any): { name: string; versions?: string[] } {
      // Helper to parse a name@versions string
      function parseInlineVersion(str: string) {
        const entryStr = str.trim().replace(/^#/, "");
        const atIndex = entryStr.indexOf("@");
        if (atIndex === -1) {
          return {
            name: entryStr,
            versions: undefined as string[] | undefined,
          };
        }
        const namePart = entryStr.slice(0, atIndex).trim();
        const versionPart = entryStr.slice(atIndex + 1).trim();
        const versions = versionPart
          ? versionPart
              .split(/[,\s]+/)
              .map((v: any) => String(v).trim())
              .filter(Boolean)
          : undefined;
        return { name: namePart, versions };
      }

      if (typeof entry === "string") {
        const parsed = parseInlineVersion(entry);
        return parsed.versions && parsed.versions.length
          ? { name: parsed.name, versions: parsed.versions }
          : { name: parsed.name };
      } else if (entry && typeof entry === "object") {
        // Normalize name; if it contains `@`, extract version from it as fallback.
        let name = entry.name
          ? String(entry.name).trim()
          : String(entry).trim();
        let versions: string[] | undefined;

        if (Array.isArray(entry.versions) && entry.versions.length) {
          versions = entry.versions.map(String).map((v: string) => v.trim());
        } else if (
          typeof entry.versions === "string" &&
          entry.versions.trim()
        ) {
          versions = entry.versions
            .split(/[,\s]+/)
            .map((v: any) => String(v).trim())
            .filter(Boolean);
        } else if (typeof entry.version === "string" && entry.version.trim()) {
          // Accept `version` field too, in case it's used
          versions = entry.version
            .split(/[,\s]+/)
            .map((v: string) => v.trim())
            .filter(Boolean);
        } else {
          // Another fallback: parse `name@versions` if present inside the name string
          const parsed = parseInlineVersion(name);
          if (parsed.versions && parsed.versions.length) {
            name = parsed.name;
            versions = parsed.versions;
          }
        }

        return versions && versions.length ? { name, versions } : { name };
      } else {
        // Fallback for unexpected types
        const parsed = parseInlineVersion(String(entry));
        return parsed.versions && parsed.versions.length
          ? { name: parsed.name, versions: parsed.versions }
          : { name: parsed.name };
      }
    }

    // Normalize any existing tags in frontmatter into Qiita tag objects
    const existingTagsArr: { name: string; versions?: string[] }[] =
      Array.isArray(dataCloned.tags)
        ? (dataCloned.tags as any[]).map((t) => toTagObject(t))
        : [];

    // Normalize topics (Zenn) to tag objects
    const topicsArr = Array.isArray(dataCloned.topics)
      ? dataCloned.topics
      : dataCloned.topics
        ? [dataCloned.topics]
        : [];
    const normalizedTopics: { name: string; versions?: string[] }[] = (
      topicsArr as any[]
    ).map((t) => toTagObject(t));

    // Merge existing tags and topics, deduplicating by tag name (case-insensitive)
    const mergedMap = new Map<string, { name: string; versions?: string[] }>();
    for (const tag of existingTagsArr) {
      mergedMap.set(tag.name.toLowerCase(), {
        name: tag.name,
        versions: tag.versions ? [...tag.versions] : undefined,
      });
    }

    for (const tag of normalizedTopics) {
      const key = tag.name.toLowerCase();
      if (mergedMap.has(key)) {
        const current = mergedMap.get(key)!;
        if (current.versions || tag.versions) {
          const combined = new Set<string>();
          if (current.versions) {
            for (const v of current.versions) combined.add(v);
          }
          if (tag.versions) {
            for (const v of tag.versions) combined.add(v);
          }
          current.versions = Array.from(combined);
        }
      } else {
        mergedMap.set(key, {
          name: tag.name,
          versions: tag.versions ? [...tag.versions] : undefined,
        });
      }
    }

    const mergedTags = Array.from(mergedMap.values());
    if (mergedTags.length) {
      dataCloned.tags = mergedTags;
    } else {
      delete dataCloned.tags;
    }
    delete dataCloned.topics;

    // Add new fields
    if (outputPath && existsSync(outputPath)) {
      const existingData = matter(readFileSync(outputPath, "utf8")).data;
      dataCloned.updated_at = existingData.updated_at || null;
      dataCloned.id = existingData.id || null;
      dataCloned.organization_url_name =
        existingData.organization_url_name || null;
    } else {
      dataCloned.updated_at = null;
      dataCloned.id = null;
      dataCloned.organization_url_name = null;
    }

    const frontmatter = yaml.dump(dataCloned);
    return `---\n${frontmatter}---\n${content}`;
  };
}
