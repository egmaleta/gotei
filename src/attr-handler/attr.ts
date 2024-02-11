import config from "../config";

function attr(name: string) {
  return `${config.prefix}${name}`;
}

function isEmpty(attr: string | null): attr is "" | null {
  return attr === null || attr.length === 0;
}

export { attr, isEmpty };
