/** Render the supplied title and full introductory paragraph once; never truncate research. */
export function articlePresentation(body, title) {
  let rest = body;
  const heading = rest.match(/^# ([^\n]+)\n+/);
  if (heading && heading[1] === title) rest = rest.slice(heading[0].length);
  const lead = rest.split(/\n\s*\n/)[0];
  const isParagraph =
    lead && !/^(#{1,6}\s|---\s*$|[-*+]\s|\d+\.\s|>)/m.test(lead);
  if (!isParagraph) return { intro: "", body: rest };
  return { intro: lead, body: rest.slice(lead.length).trimStart() };
}
