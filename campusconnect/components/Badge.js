// Small coloured label, e.g. Pending / Completed / High
export default function Badge({ text }) {
  return <span className={"badge badge-" + text.toLowerCase()}>{text}</span>;
}
