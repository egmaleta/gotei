class GoteiConfig {
  constructor(private _prefix: string) {}

  get prefix() {
    return this._prefix;
  }

  set prefix(prefix: string) {
    const p = prefix.trim();
    if (p.length > 0) {
      this._prefix = p;
    }
  }
}

const config = new GoteiConfig("gt-");

const prefix = document.documentElement.getAttribute("gotei-prefix");
if (prefix !== null) {
  config.prefix = prefix;
}

export default config;
