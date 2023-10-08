interface GoteiDocument
	extends Pick<Document, "createElement" | "createTextNode"> {}

class Context {
	private doc: GoteiDocument | null = null;

	config(document: GoteiDocument) {
		this.doc = document;
	}

	document(): GoteiDocument {
		if (!this.doc) {
			this.doc = globalThis.document;
		}
		return this.doc;
	}
}

const CONTEXT = new Context();

export const config = CONTEXT.config.bind(CONTEXT);
export const document = CONTEXT.document.bind(CONTEXT);
