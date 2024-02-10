const PREFIX = "gt-";

function attr(name: string) {
  return `${PREFIX}${name}`;
}

function isEmpty(attr: string | null): attr is "" | null {
  return attr === null || attr.length === 0;
}

export { attr, isEmpty };
