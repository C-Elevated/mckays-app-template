import { Schema, Node as ProsemirrorNode } from "prosemirror-model"
import { diffWordsWithSpace } from "diff"

export enum DiffType {
  Inserted = "inserted",
  Deleted = "deleted",
  Unchanged = "unchanged"
}

export function diffEditor(
  schema: Schema,
  oldDoc: Record<string, any>,
  newDoc: Record<string, any>
): ProsemirrorNode {
  const oldContent = flattenDoc(oldDoc)
  const newContent = flattenDoc(newDoc)

  const diff = diffWordsWithSpace(oldContent, newContent)
  const fragment = []

  for (const part of diff) {
    const text = schema.text(part.value, [
      schema.marks.diffMark.create({
        type: part.added
          ? DiffType.Inserted
          : part.removed
            ? DiffType.Deleted
            : DiffType.Unchanged
      })
    ])
    fragment.push(text)
  }

  return schema.node("doc", {}, [schema.node("paragraph", {}, fragment)])
}

function flattenDoc(doc: Record<string, any>): string {
  if (typeof doc === "string") return doc
  if (Array.isArray(doc)) return doc.map(flattenDoc).join("")
  if (doc.text) return doc.text
  if (doc.content) return flattenDoc(doc.content)
  return ""
}
