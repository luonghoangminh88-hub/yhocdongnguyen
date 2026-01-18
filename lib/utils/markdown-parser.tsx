// Utility function to parse simple markdown to HTML
export function parseMarkdown(text: string): string {
  if (!text) return ""

  let html = text

  // Convert **bold** to <strong> with styling (non-greedy, works across lines)
  html = html.replace(/\*\*([^\*]+?)\*\*/gs, "<strong class='text-amber-900 dark:text-amber-100 font-semibold'>$1</strong>")

  // Convert numbered lists (1. 2. 3.) to <ol><li>
  const numberedListRegex = /^(\d+)\.\s+(.+)$/gm
  if (numberedListRegex.test(html)) {
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, "<li>$2</li>")
    html = html.replace(/(<li>.*<\/li>)/s, "<ol class='list-decimal list-inside space-y-2 ml-4'>$1</ol>")
  }

  // Convert bullet lists (• or -) to <ul><li>
  const bulletListRegex = /^[•-]\s+(.+)$/gm
  if (bulletListRegex.test(html)) {
    html = html.replace(/^[•-]\s+(.+)$/gm, "<li>$1</li>")
    html = html.replace(/(<li>.*<\/li>)/s, "<ul class='list-disc list-inside space-y-2 ml-4'>$1</ul>")
  }

  // Convert line breaks to paragraphs with spacing
  html = html.replace(/\n\n+/g, "</p><p class='mt-3'>")
  html = `<p class='text-muted-foreground'>${html}</p>`

  return html
}

// Split text by markdown headers and structure
export function parseStructuredMarkdown(text: string): Array<{ type: string; content: string }> {
  const sections: Array<{ type: string; content: string }> = []
  const lines = text.split("\n")

  let currentSection = { type: "paragraph", content: "" }

  for (const line of lines) {
    if (line.startsWith("**") && line.endsWith(":**")) {
      // Header detected
      if (currentSection.content.trim()) {
        sections.push(currentSection)
      }
      currentSection = { type: "header", content: line.replace(/\*\*/g, "").replace(":", "") }
      sections.push(currentSection)
      currentSection = { type: "paragraph", content: "" }
    } else if (line.match(/^[•-]\s+/) || line.match(/^\d+\.\s+/)) {
      // List item
      if (currentSection.type !== "list") {
        if (currentSection.content.trim()) {
          sections.push(currentSection)
        }
        currentSection = { type: "list", content: line }
      } else {
        currentSection.content += "\n" + line
      }
    } else {
      if (currentSection.type === "list" && line.trim()) {
        if (currentSection.content.trim()) {
          sections.push(currentSection)
        }
        currentSection = { type: "paragraph", content: line }
      } else {
        currentSection.content += (currentSection.content ? "\n" : "") + line
      }
    }
  }

  if (currentSection.content.trim()) {
    sections.push(currentSection)
  }

  return sections
}
