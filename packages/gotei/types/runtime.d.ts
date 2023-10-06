/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { OrArray, OrComputed, typeSymbol } from "./common";
import { Signal, SignalSetter } from "./state";

export declare namespace Gotei {
	type TypedEvent<
		E extends Event = Event,
		T extends EventTarget = EventTarget,
	> = Omit<E, "currentTarget"> & { readonly currentTarget: T };

	export type EventHandler<
		E extends Event = Event,
		T extends EventTarget = EventTarget,
	> =
		| ((ev: TypedEvent<E, T>) => any)
		| {
				handler: (ev: TypedEvent<E, T>) => any;
				options?: AddEventListenerOptions;
		  };

	interface EventHandlers<T extends EventTarget = EventTarget> {
		onabort?: OrArray<EventHandler<UIEvent, T>>;
		onanimationcancel?: OrArray<EventHandler<AnimationEvent, T>>;
		onanimationend?: OrArray<EventHandler<AnimationEvent, T>>;
		onanimationiteration?: OrArray<EventHandler<AnimationEvent, T>>;
		onanimationstart?: OrArray<EventHandler<AnimationEvent, T>>;
		onauxclick?: OrArray<EventHandler<MouseEvent, T>>;
		onbeforeinput?: OrArray<EventHandler<InputEvent, T>>;
		onblur?: OrArray<EventHandler<FocusEvent, T>>;
		oncancel?: OrArray<EventHandler<Event, T>>;
		oncanplay?: OrArray<EventHandler<Event, T>>;
		oncanplaythrough?: OrArray<EventHandler<Event, T>>;
		onchange?: OrArray<EventHandler<Event, T>>;
		onclick?: OrArray<EventHandler<MouseEvent, T>>;
		onclose?: OrArray<EventHandler<Event, T>>;
		oncompositionend?: OrArray<EventHandler<CompositionEvent, T>>;
		oncompositionstart?: OrArray<EventHandler<CompositionEvent, T>>;
		oncompositionupdate?: OrArray<EventHandler<CompositionEvent, T>>;
		oncontextmenu?: OrArray<EventHandler<MouseEvent, T>>;
		oncopy?: OrArray<EventHandler<ClipboardEvent, T>>;
		oncuechange?: OrArray<EventHandler<Event, T>>;
		oncut?: OrArray<EventHandler<ClipboardEvent, T>>;
		ondblclick?: OrArray<EventHandler<MouseEvent, T>>;
		ondrag?: OrArray<EventHandler<DragEvent, T>>;
		ondragend?: OrArray<EventHandler<DragEvent, T>>;
		ondragenter?: OrArray<EventHandler<DragEvent, T>>;
		ondragleave?: OrArray<EventHandler<DragEvent, T>>;
		ondragover?: OrArray<EventHandler<DragEvent, T>>;
		ondragstart?: OrArray<EventHandler<DragEvent, T>>;
		ondrop?: OrArray<EventHandler<DragEvent, T>>;
		ondurationchange?: OrArray<EventHandler<Event, T>>;
		onemptied?: OrArray<EventHandler<Event, T>>;
		onended?: OrArray<EventHandler<Event, T>>;
		onerror?: OrArray<EventHandler<ErrorEvent, T>>;
		onfocus?: OrArray<EventHandler<FocusEvent, T>>;
		onfocusin?: OrArray<EventHandler<FocusEvent, T>>;
		onfocusout?: OrArray<EventHandler<FocusEvent, T>>;
		onformdata?: OrArray<EventHandler<FormDataEvent, T>>;
		onfullscreenchange?: OrArray<EventHandler<Event, T>>;
		onfullscreenerror?: OrArray<EventHandler<Event, T>>;
		ongotpointercapture?: OrArray<EventHandler<PointerEvent, T>>;
		oninput?: OrArray<EventHandler<Event, T>>;
		oninvalid?: OrArray<EventHandler<Event, T>>;
		onkeydown?: OrArray<EventHandler<KeyboardEvent, T>>;
		onkeypress?: OrArray<EventHandler<KeyboardEvent, T>>;
		onkeyup?: OrArray<EventHandler<KeyboardEvent, T>>;
		onload?: OrArray<EventHandler<Event, T>>;
		onloadeddata?: OrArray<EventHandler<Event, T>>;
		onloadedmetadata?: OrArray<EventHandler<Event, T>>;
		onloadstart?: OrArray<EventHandler<Event, T>>;
		onlostpointercapture?: OrArray<EventHandler<PointerEvent, T>>;
		onmousedown?: OrArray<EventHandler<MouseEvent, T>>;
		onmouseenter?: OrArray<EventHandler<MouseEvent, T>>;
		onmouseleave?: OrArray<EventHandler<MouseEvent, T>>;
		onmousemove?: OrArray<EventHandler<MouseEvent, T>>;
		onmouseout?: OrArray<EventHandler<MouseEvent, T>>;
		onmouseover?: OrArray<EventHandler<MouseEvent, T>>;
		onmouseup?: OrArray<EventHandler<MouseEvent, T>>;
		onpaste?: OrArray<EventHandler<ClipboardEvent, T>>;
		onpause?: OrArray<EventHandler<Event, T>>;
		onplay?: OrArray<EventHandler<Event, T>>;
		onplaying?: OrArray<EventHandler<Event, T>>;
		onpointercancel?: OrArray<EventHandler<PointerEvent, T>>;
		onpointerdown?: OrArray<EventHandler<PointerEvent, T>>;
		onpointerenter?: OrArray<EventHandler<PointerEvent, T>>;
		onpointerleave?: OrArray<EventHandler<PointerEvent, T>>;
		onpointermove?: OrArray<EventHandler<PointerEvent, T>>;
		onpointerout?: OrArray<EventHandler<PointerEvent, T>>;
		onpointerover?: OrArray<EventHandler<PointerEvent, T>>;
		onpointerup?: OrArray<EventHandler<PointerEvent, T>>;
		onprogress?: OrArray<EventHandler<ProgressEvent, T>>;
		onratechange?: OrArray<EventHandler<Event, T>>;
		onreset?: OrArray<EventHandler<Event, T>>;
		onresize?: OrArray<EventHandler<UIEvent, T>>;
		onscroll?: OrArray<EventHandler<Event, T>>;
		onsecuritypolicyviolation?: OrArray<
			EventHandler<SecurityPolicyViolationEvent, T>
		>;
		onseeked?: OrArray<EventHandler<Event, T>>;
		onseeking?: OrArray<EventHandler<Event, T>>;
		onselect?: OrArray<EventHandler<Event, T>>;
		onselectionchange?: OrArray<EventHandler<Event, T>>;
		onselectstart?: OrArray<EventHandler<Event, T>>;
		onslotchange?: OrArray<EventHandler<Event, T>>;
		onstalled?: OrArray<EventHandler<Event, T>>;
		onsubmit?: OrArray<EventHandler<SubmitEvent, T>>;
		onsuspend?: OrArray<EventHandler<Event, T>>;
		ontimeupdate?: OrArray<EventHandler<Event, T>>;
		ontoggle?: OrArray<EventHandler<Event, T>>;
		ontouchcancel?: OrArray<EventHandler<TouchEvent, T>>;
		ontouchend?: OrArray<EventHandler<TouchEvent, T>>;
		ontouchmove?: OrArray<EventHandler<TouchEvent, T>>;
		ontouchstart?: OrArray<EventHandler<TouchEvent, T>>;
		ontransitioncancel?: OrArray<EventHandler<TransitionEvent, T>>;
		ontransitionend?: OrArray<EventHandler<TransitionEvent, T>>;
		ontransitionrun?: OrArray<EventHandler<TransitionEvent, T>>;
		ontransitionstart?: OrArray<EventHandler<TransitionEvent, T>>;
		onvolumechange?: OrArray<EventHandler<Event, T>>;
		onwaiting?: OrArray<EventHandler<Event, T>>;
		onwebkitanimationend?: OrArray<EventHandler<Event, T>>;
		onwebkitanimationiteration?: OrArray<EventHandler<Event, T>>;
		onwebkitanimationstart?: OrArray<EventHandler<Event, T>>;
		onwebkittransitionend?: OrArray<EventHandler<Event, T>>;
		onwheel?: OrArray<EventHandler<WheelEvent, T>>;
	}

	interface AriaAttributes {
		"aria-activedescendant"?: OrComputed<string | undefined | null>;
		"aria-atomic"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-autocomplete"?: OrComputed<
			"none" | "inline" | "list" | "both" | undefined | null
		>;
		"aria-busy"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-checked"?: OrComputed<
			boolean | "false" | "mixed" | "true" | undefined | null
		>;
		"aria-colcount"?: OrComputed<number | string | undefined | null>;
		"aria-colindex"?: OrComputed<number | string | undefined | null>;
		"aria-colspan"?: OrComputed<number | string | undefined | null>;
		"aria-controls"?: OrComputed<string | undefined | null>;
		"aria-current"?: OrComputed<
			| boolean
			| "false"
			| "true"
			| "page"
			| "step"
			| "location"
			| "date"
			| "time"
			| undefined
			| null
		>;
		"aria-describedby"?: OrComputed<string | undefined | null>;
		"aria-details"?: OrComputed<string | undefined | null>;
		"aria-disabled"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-dropeffect"?: OrComputed<
			"none" | "copy" | "execute" | "link" | "move" | "popup" | undefined | null
		>;
		"aria-errormessage"?: OrComputed<string | undefined | null>;
		"aria-expanded"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-flowto"?: OrComputed<string | undefined | null>;
		"aria-grabbed"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-haspopup"?: OrComputed<
			| boolean
			| "false"
			| "true"
			| "menu"
			| "listbox"
			| "tree"
			| "grid"
			| "dialog"
			| undefined
			| null
		>;
		"aria-hidden"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-invalid"?: OrComputed<
			boolean | "false" | "true" | "grammar" | "spelling" | undefined | null
		>;
		"aria-keyshortcuts"?: OrComputed<string | undefined | null>;
		"aria-label"?: OrComputed<string | undefined | null>;
		"aria-labelledby"?: OrComputed<string | undefined | null>;
		"aria-level"?: OrComputed<number | string | undefined | null>;
		"aria-live"?: OrComputed<"off" | "assertive" | "polite" | undefined | null>;
		"aria-modal"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-multiline"?: OrComputed<
			boolean | "false" | "true" | undefined | null
		>;
		"aria-multiselectable"?: OrComputed<
			boolean | "false" | "true" | undefined | null
		>;
		"aria-orientation"?: OrComputed<
			"horizontal" | "vertical" | undefined | null
		>;
		"aria-owns"?: OrComputed<string | undefined | null>;
		"aria-placeholder"?: OrComputed<string | undefined | null>;
		"aria-posinset"?: OrComputed<number | string | undefined | null>;
		"aria-pressed"?: OrComputed<
			boolean | "false" | "mixed" | "true" | undefined | null
		>;
		"aria-readonly"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-relevant"?: OrComputed<
			| "additions"
			| "additions removals"
			| "additions text"
			| "all"
			| "removals"
			| "removals additions"
			| "removals text"
			| "text"
			| "text additions"
			| "text removals"
			| undefined
			| null
		>;
		"aria-required"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-roledescription"?: OrComputed<string | undefined | null>;
		"aria-rowcount"?: OrComputed<number | string | undefined | null>;
		"aria-rowindex"?: OrComputed<number | string | undefined | null>;
		"aria-rowspan"?: OrComputed<number | string | undefined | null>;
		"aria-selected"?: OrComputed<boolean | "false" | "true" | undefined | null>;
		"aria-setsize"?: OrComputed<number | string | undefined | null>;
		"aria-sort"?: OrComputed<
			"none" | "ascending" | "descending" | "other" | undefined | null
		>;
		"aria-valuemax"?: OrComputed<number | string | undefined | null>;
		"aria-valuemin"?: OrComputed<number | string | undefined | null>;
		"aria-valuenow"?: OrComputed<number | string | undefined | null>;
		"aria-valuetext"?: OrComputed<string | undefined | null>;
	}

	type AriaRole =
		| "alert"
		| "alertdialog"
		| "application"
		| "article"
		| "banner"
		| "button"
		| "cell"
		| "checkbox"
		| "columnheader"
		| "combobox"
		| "complementary"
		| "contentinfo"
		| "definition"
		| "dialog"
		| "directory"
		| "document"
		| "feed"
		| "figure"
		| "form"
		| "grid"
		| "gridcell"
		| "group"
		| "heading"
		| "img"
		| "link"
		| "list"
		| "listbox"
		| "listitem"
		| "log"
		| "main"
		| "marquee"
		| "math"
		| "menu"
		| "menubar"
		| "menuitem"
		| "menuitemcheckbox"
		| "menuitemradio"
		| "navigation"
		| "none"
		| "note"
		| "option"
		| "presentation"
		| "progressbar"
		| "radio"
		| "radiogroup"
		| "region"
		| "row"
		| "rowgroup"
		| "rowheader"
		| "scrollbar"
		| "search"
		| "searchbox"
		| "separator"
		| "slider"
		| "spinbutton"
		| "status"
		| "switch"
		| "tab"
		| "table"
		| "tablist"
		| "tabpanel"
		| "term"
		| "textbox"
		| "timer"
		| "toolbar"
		| "tooltip"
		| "tree"
		| "treegrid"
		| "treeitem";

	interface HTMLAttributes extends AriaAttributes {
		accesskey?: OrComputed<string | undefined | null>;
		autocapitalize?: OrComputed<string | undefined | null>;
		autofocus?: OrComputed<boolean | string | undefined | null>;
		class?: string | undefined | null;
		contenteditable?: OrComputed<
			"true" | "false" | boolean | "inherit" | string | undefined | null
		>;
		dir?: OrComputed<string | undefined | null>;
		draggable?: OrComputed<"true" | "false" | boolean | undefined | null>;
		enterkeyhint?: OrComputed<
			| "enter"
			| "done"
			| "go"
			| "next"
			| "previous"
			| "search"
			| "send"
			| undefined
			| null
		>;
		hidden?: OrComputed<boolean | string | undefined | null>;
		id?: OrComputed<string | undefined | null>;
		inert?: OrComputed<boolean | string | undefined | null>;
		inputmode?: OrComputed<
			| "none"
			| "text"
			| "tel"
			| "url"
			| "email"
			| "numeric"
			| "decimal"
			| "search"
			| undefined
			| null
		>;
		is?: OrComputed<string | undefined | null>;
		itemid?: OrComputed<string | undefined | null>;
		itemprop?: OrComputed<string | undefined | null>;
		itemref?: OrComputed<string | undefined | null>;
		itemscope?: OrComputed<boolean | string | undefined | null>;
		itemtype?: OrComputed<string | undefined | null>;
		lang?: OrComputed<string | undefined | null>;
		slot?: OrComputed<string | undefined | null>;
		spellcheck?: OrComputed<"true" | "false" | boolean | undefined | null>;
		style?: string | undefined | null;
		tabindex?: OrComputed<number | string | undefined | null>;
		title?: OrComputed<string | undefined | null>;
		translate?: OrComputed<"yes" | "no" | undefined | null>;
		radiogroup?: OrComputed<string | undefined | null>;
		role?: OrComputed<AriaRole | undefined | null>;
		about?: OrComputed<string | undefined | null>;
		datatype?: OrComputed<string | undefined | null>;
		inlist?: OrComputed<any>;
		prefix?: OrComputed<string | undefined | null>;
		property?: OrComputed<string | undefined | null>;
		resource?: OrComputed<string | undefined | null>;
		typeof?: OrComputed<string | undefined | null>;
		vocab?: OrComputed<string | undefined | null>;
		contextmenu?: OrComputed<string | undefined | null>;
		autosave?: OrComputed<string | undefined | null>;
		color?: OrComputed<string | undefined | null>;
		results?: OrComputed<number | string | undefined | null>;
		security?: OrComputed<string | undefined | null>;
		unselectable?: OrComputed<"on" | "off" | undefined | null>;
	}

	type HTMLAttributeReferrerPolicy =
		| ""
		| "no-referrer"
		| "no-referrer-when-downgrade"
		| "origin"
		| "origin-when-cross-origin"
		| "same-origin"
		| "strict-origin"
		| "strict-origin-when-cross-origin"
		| "unsafe-url";

	type HTMLAttributeAnchorTarget = "_self" | "_blank" | "_parent" | "_top";

	interface AnchorHTMLAttributes extends HTMLAttributes {
		download?: OrComputed<string | boolean | undefined | null>;
		href?: OrComputed<string | URL | undefined | null>;
		hreflang?: OrComputed<string | undefined | null>;
		media?: OrComputed<string | undefined | null>;
		ping?: OrComputed<string | undefined | null>;
		rel?: OrComputed<string | undefined | null>;
		target?: OrComputed<HTMLAttributeAnchorTarget | undefined | null>;
		type?: OrComputed<string | undefined | null>;
		referrerpolicy?: OrComputed<HTMLAttributeReferrerPolicy | undefined | null>;
	}

	interface AudioHTMLAttributes extends MediaHTMLAttributes {}

	interface AreaHTMLAttributes extends HTMLAttributes {
		alt?: OrComputed<string | undefined | null>;
		coords?: OrComputed<string | undefined | null>;
		download?: OrComputed<any>;
		href?: OrComputed<string | undefined | null>;
		hreflang?: OrComputed<string | undefined | null>;
		media?: OrComputed<string | undefined | null>;
		referrerpolicy?: OrComputed<HTMLAttributeReferrerPolicy | undefined | null>;
		rel?: OrComputed<string | undefined | null>;
		shape?: OrComputed<string | undefined | null>;
		target?: OrComputed<string | undefined | null>;
	}

	interface BaseHTMLAttributes extends HTMLAttributes {
		href?: OrComputed<string | undefined | null>;
		target?: OrComputed<string | undefined | null>;
	}

	interface BlockquoteHTMLAttributes extends HTMLAttributes {
		cite?: OrComputed<string | undefined | null>;
	}

	interface ButtonHTMLAttributes extends HTMLAttributes {
		disabled?: OrComputed<boolean | string | undefined | null>;
		form?: OrComputed<string | undefined | null>;
		formaction?: OrComputed<string | undefined | null>;
		formenctype?: OrComputed<string | undefined | null>;
		formmethod?: OrComputed<string | undefined | null>;
		formnovalidate?: OrComputed<boolean | string | undefined | null>;
		formtarget?: OrComputed<string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		type?: OrComputed<"submit" | "reset" | "button" | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
	}

	interface CanvasHTMLAttributes extends HTMLAttributes {
		height?: OrComputed<number | string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface ColHTMLAttributes extends HTMLAttributes {
		span?: OrComputed<number | string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface ColgroupHTMLAttributes extends HTMLAttributes {
		span?: OrComputed<number | string | undefined | null>;
	}

	interface DataHTMLAttributes extends HTMLAttributes {
		value?: OrComputed<string | number | undefined | null>;
	}

	interface DetailsHTMLAttributes extends HTMLAttributes {
		open?: OrComputed<boolean | string | undefined | null>;
	}

	interface DelHTMLAttributes extends HTMLAttributes {
		cite?: OrComputed<string | undefined | null>;
		datetime?: OrComputed<string | undefined | null>;
	}

	interface DialogHTMLAttributes extends HTMLAttributes {
		open?: OrComputed<boolean | string | undefined | null>;
	}

	interface EmbedHTMLAttributes extends HTMLAttributes {
		height?: OrComputed<number | string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		type?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface FieldsetHTMLAttributes extends HTMLAttributes {
		disabled?: OrComputed<boolean | string | undefined | null>;
		form?: OrComputed<string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
	}

	interface FormHTMLAttributes extends HTMLAttributes {
		"accept-charset"?: OrComputed<string | undefined | null>;
		action?: OrComputed<string | undefined | null>;
		autocomplete?: OrComputed<string | undefined | null>;
		autocorrect?: OrComputed<string | undefined | null>;
		enctype?: OrComputed<string | undefined | null>;
		method?: OrComputed<string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		novalidate?: OrComputed<boolean | string | undefined | null>;
		target?: OrComputed<string | undefined | null>;
	}

	interface HtmlHTMLAttributes extends HTMLAttributes {
		manifest?: OrComputed<string | undefined | null>;
	}

	interface IframeHTMLAttributes extends HTMLAttributes {
		allow?: OrComputed<string | undefined | null>;
		allowfullscreen?: OrComputed<boolean | string | undefined | null>;
		allowtransparency?: OrComputed<boolean | string | undefined | null>;
		fetchpriority?: OrComputed<"auto" | "high" | "low" | undefined | null>;
		frameborder?: OrComputed<number | string | undefined | null>;
		height?: OrComputed<number | string | undefined | null>;
		loading?: OrComputed<"eager" | "lazy" | undefined | null>;
		marginheight?: OrComputed<number | string | undefined | null>;
		marginwidth?: OrComputed<number | string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		referrerpolicy?: OrComputed<HTMLAttributeReferrerPolicy | undefined | null>;
		sandbox?: OrComputed<string | undefined | null>;
		scrolling?: OrComputed<string | undefined | null>;
		seamless?: OrComputed<boolean | string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		srcdoc?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface ImgHTMLAttributes extends HTMLAttributes {
		alt?: OrComputed<string | undefined | null>;
		crossorigin?: OrComputed<
			"anonymous" | "use-credentials" | "" | undefined | null
		>;
		decoding?: OrComputed<"async" | "auto" | "sync" | undefined | null>;
		fetchpriority?: OrComputed<"auto" | "high" | "low" | undefined | null>;
		height?: OrComputed<number | string | undefined | null>;
		loading?: OrComputed<"eager" | "lazy" | undefined | null>;
		referrerpolicy?: OrComputed<HTMLAttributeReferrerPolicy | undefined | null>;
		sizes?: OrComputed<string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		srcset?: OrComputed<string | undefined | null>;
		usemap?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface InsHTMLAttributes extends HTMLAttributes {
		cite?: OrComputed<string | undefined | null>;
		datetime?: OrComputed<string | undefined | null>;
	}

	type HTMLInputTypeAttribute =
		| "button"
		| "checkbox"
		| "color"
		| "date"
		| "datetime-local"
		| "email"
		| "file"
		| "hidden"
		| "image"
		| "month"
		| "number"
		| "password"
		| "radio"
		| "range"
		| "reset"
		| "search"
		| "submit"
		| "tel"
		| "text"
		| "time"
		| "url"
		| "week";

	interface InputHTMLAttributes extends HTMLAttributes {
		accept?: OrComputed<string | undefined | null>;
		alt?: OrComputed<string | undefined | null>;
		autocomplete?: OrComputed<string | undefined | null>;
		autocorrect?: OrComputed<string | undefined | null>;
		capture?: OrComputed<boolean | string | undefined | null>;
		checked?: OrComputed<boolean | string | undefined | null>;
		crossorigin?: OrComputed<string | undefined | null>;
		dirname?: OrComputed<string | undefined | null>;
		disabled?: OrComputed<boolean | string | undefined | null>;
		form?: OrComputed<string | undefined | null>;
		formaction?: OrComputed<string | undefined | null>;
		formenctype?: OrComputed<string | undefined | null>;
		formmethod?: OrComputed<string | undefined | null>;
		formnovalidate?: OrComputed<boolean | string | undefined | null>;
		formtarget?: OrComputed<string | undefined | null>;
		height?: OrComputed<number | string | undefined | null>;
		list?: OrComputed<string | undefined | null>;
		max?: OrComputed<number | string | undefined | null>;
		maxlength?: OrComputed<number | string | undefined | null>;
		min?: OrComputed<number | string | undefined | null>;
		minlength?: OrComputed<number | string | undefined | null>;
		multiple?: OrComputed<boolean | string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		pattern?: OrComputed<string | undefined | null>;
		placeholder?: OrComputed<string | undefined | null>;
		readonly?: OrComputed<boolean | string | undefined | null>;
		required?: OrComputed<boolean | string | undefined | null>;
		size?: OrComputed<number | string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		step?: OrComputed<number | string | undefined | null>;
		type?: OrComputed<HTMLInputTypeAttribute | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface LabelHTMLAttributes extends HTMLAttributes {
		form?: OrComputed<string | undefined | null>;
		for?: OrComputed<string | undefined | null>;
	}

	interface LiHTMLAttributes extends HTMLAttributes {
		value?: OrComputed<string | number | undefined | null>;
	}

	interface LinkHTMLAttributes extends HTMLAttributes {
		as?: OrComputed<string | undefined | null>;
		crossorigin?: OrComputed<boolean | string | undefined | null>;
		href?: OrComputed<string | URL | undefined | null>;
		hreflang?: OrComputed<string | undefined | null>;
		fetchpriority?: OrComputed<"auto" | "high" | "low" | undefined | null>;
		integrity?: OrComputed<string | undefined | null>;
		media?: OrComputed<string | undefined | null>;
		imagesrcset?: OrComputed<string | undefined | null>;
		imagesizes?: OrComputed<string | undefined | null>;
		referrerpolicy?: OrComputed<HTMLAttributeReferrerPolicy | undefined | null>;
		rel?: OrComputed<string | undefined | null>;
		sizes?: OrComputed<string | undefined | null>;
		type?: OrComputed<string | undefined | null>;
		charset?: OrComputed<string | undefined | null>;
	}

	interface MapHTMLAttributes extends HTMLAttributes {
		name?: OrComputed<string | undefined | null>;
	}

	interface MenuHTMLAttributes extends HTMLAttributes {
		type?: OrComputed<string | undefined | null>;
	}

	interface MediaHTMLAttributes extends HTMLAttributes {
		autoplay?: OrComputed<boolean | string | undefined | null>;
		controls?: OrComputed<boolean | string | undefined | null>;
		controlslist?: OrComputed<string | undefined | null>;
		crossorigin?: OrComputed<string | undefined | null>;
		loop?: OrComputed<boolean | string | undefined | null>;
		mediagroup?: OrComputed<string | undefined | null>;
		muted?: OrComputed<boolean | string | undefined | null>;
		playsinline?: OrComputed<boolean | string | undefined | null>;
		preload?: OrComputed<string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
	}

	interface MetaHTMLAttributes extends HTMLAttributes {
		charset?: OrComputed<string | undefined | null>;
		content?: OrComputed<string | URL | undefined | null>;
		"http-equiv"?: OrComputed<string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		media?: OrComputed<string | undefined | null>;
	}

	interface MeterHTMLAttributes extends HTMLAttributes {
		form?: OrComputed<string | undefined | null>;
		high?: OrComputed<number | string | undefined | null>;
		low?: OrComputed<number | string | undefined | null>;
		max?: OrComputed<number | string | undefined | null>;
		min?: OrComputed<number | string | undefined | null>;
		optimum?: OrComputed<number | string | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
	}

	interface QuoteHTMLAttributes extends HTMLAttributes {
		cite?: OrComputed<string | undefined | null>;
	}

	interface ObjectHTMLAttributes extends HTMLAttributes {
		classid?: OrComputed<string | undefined | null>;
		data?: OrComputed<string | undefined | null>;
		form?: OrComputed<string | undefined | null>;
		height?: OrComputed<number | string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		type?: OrComputed<string | undefined | null>;
		usemap?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
		wmode?: OrComputed<string | undefined | null>;
	}

	interface OlHTMLAttributes extends HTMLAttributes {
		reversed?: OrComputed<boolean | string | undefined | null>;
		start?: OrComputed<number | string | undefined | null>;
		type?: OrComputed<"1" | "a" | "A" | "i" | "I" | undefined | null>;
	}

	interface OptgroupHTMLAttributes extends HTMLAttributes {
		disabled?: OrComputed<boolean | string | undefined | null>;
		label?: OrComputed<string | undefined | null>;
	}

	interface OptionHTMLAttributes extends HTMLAttributes {
		disabled?: OrComputed<boolean | string | undefined | null>;
		label?: OrComputed<string | undefined | null>;
		selected?: OrComputed<boolean | string | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
	}

	interface OutputHTMLAttributes extends HTMLAttributes {
		form?: OrComputed<string | undefined | null>;
		for?: OrComputed<string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
	}

	interface ProgressHTMLAttributes extends HTMLAttributes {
		max?: OrComputed<number | string | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
	}

	interface SlotHTMLAttributes extends HTMLAttributes {
		name?: OrComputed<string | undefined | null>;
	}

	interface ScriptHTMLAttributes extends HTMLAttributes {
		async?: OrComputed<boolean | string | undefined | null>;
		charset?: OrComputed<string | undefined | null>;
		crossorigin?: OrComputed<string | undefined | null>;
		defer?: OrComputed<boolean | string | undefined | null>;
		fetchpriority?: OrComputed<"auto" | "high" | "low" | undefined | null>;
		integrity?: OrComputed<string | undefined | null>;
		nomodule?: OrComputed<boolean | string | undefined | null>;
		nonce?: OrComputed<string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		type?: OrComputed<string | undefined | null>;
	}

	interface SelectHTMLAttributes extends HTMLAttributes {
		autocomplete?: OrComputed<string | undefined | null>;
		autocorrect?: OrComputed<string | undefined | null>;
		disabled?: OrComputed<boolean | string | undefined | null>;
		form?: OrComputed<string | undefined | null>;
		multiple?: OrComputed<boolean | string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		required?: OrComputed<boolean | string | undefined | null>;
		size?: OrComputed<number | string | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
	}

	interface SourceHTMLAttributes extends HTMLAttributes {
		height?: OrComputed<number | string | undefined | null>;
		media?: OrComputed<string | undefined | null>;
		sizes?: OrComputed<string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		srcset?: OrComputed<string | undefined | null>;
		type?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface StyleHTMLAttributes extends HTMLAttributes {
		media?: OrComputed<string | undefined | null>;
		nonce?: OrComputed<string | undefined | null>;
		scoped?: OrComputed<boolean | string | undefined | null>;
		type?: OrComputed<string | undefined | null>;
	}

	interface TableHTMLAttributes extends HTMLAttributes {
		align?: OrComputed<"left" | "center" | "right" | undefined | null>;
		bgcolor?: OrComputed<string | undefined | null>;
		border?: OrComputed<string | number | undefined | null>;
		cellpadding?: OrComputed<number | string | undefined | null>;
		cellspacing?: OrComputed<number | string | undefined | null>;
		frame?: OrComputed<boolean | "false" | "true" | undefined | null>;
		rules?: OrComputed<
			"none" | "groups" | "rows" | "columns" | "all" | undefined | null
		>;
		summary?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
	}

	interface TextareaHTMLAttributes extends HTMLAttributes {
		autocomplete?: OrComputed<string | undefined | null>;
		autocorrect?: OrComputed<string | undefined | null>;
		cols?: OrComputed<number | string | undefined | null>;
		dirname?: OrComputed<string | undefined | null>;
		disabled?: OrComputed<boolean | string | undefined | null>;
		form?: OrComputed<string | undefined | null>;
		maxlength?: OrComputed<number | string | undefined | null>;
		minlength?: OrComputed<number | string | undefined | null>;
		name?: OrComputed<string | undefined | null>;
		placeholder?: OrComputed<string | undefined | null>;
		readonly?: OrComputed<boolean | string | undefined | null>;
		required?: OrComputed<boolean | string | undefined | null>;
		rows?: OrComputed<number | string | undefined | null>;
		value?: OrComputed<string | number | undefined | null>;
		wrap?: OrComputed<string | undefined | null>;
	}

	interface TdHTMLAttributes extends HTMLAttributes {
		align?: OrComputed<
			"left" | "center" | "right" | "justify" | "char" | undefined | null
		>;
		colspan?: OrComputed<number | string | undefined | null>;
		headers?: OrComputed<string | undefined | null>;
		rowspan?: OrComputed<number | string | undefined | null>;
		scope?: OrComputed<string | undefined | null>;
		abbr?: OrComputed<string | undefined | null>;
		valign?: OrComputed<
			"top" | "middle" | "bottom" | "baseline" | undefined | null
		>;
	}

	interface ThHTMLAttributes extends HTMLAttributes {
		align?: OrComputed<
			"left" | "center" | "right" | "justify" | "char" | undefined | null
		>;
		colspan?: OrComputed<number | string | undefined | null>;
		headers?: OrComputed<string | undefined | null>;
		rowspan?: OrComputed<number | string | undefined | null>;
		scope?: OrComputed<string | undefined | null>;
		abbr?: OrComputed<string | undefined | null>;
	}

	interface TimeHTMLAttributes extends HTMLAttributes {
		datetime?: OrComputed<string | undefined | null>;
	}

	interface TrackHTMLAttributes extends HTMLAttributes {
		default?: OrComputed<boolean | string | undefined | null>;
		kind?: OrComputed<string | undefined | null>;
		label?: OrComputed<string | undefined | null>;
		src?: OrComputed<string | undefined | null>;
		srclang?: OrComputed<string | undefined | null>;
	}

	interface VideoHTMLAttributes extends MediaHTMLAttributes {
		height?: OrComputed<number | string | undefined | null>;
		playsinline?: OrComputed<boolean | string | undefined | null>;
		poster?: OrComputed<string | undefined | null>;
		width?: OrComputed<number | string | undefined | null>;
		disablepictureinpicture?: OrComputed<boolean | string | undefined | null>;
	}

	type CSSProperties = Omit<
		CSSStyleDeclaration,
		| "getPropertyPriority"
		| "getPropertyValue"
		| "item"
		| "removeProperty"
		| "setProperty"
		| "parentRule"
		| "length"
		| typeof Symbol.iterator
		| number
	>;

	export type Attributes<
		A extends HTMLAttributes = HTMLAttributes,
		T extends EventTarget = EventTarget,
	> = A &
		EventHandlers<T> & {
			bindThis?: SignalSetter<Node | null>;
			bindValue?: "value" extends keyof A ? Signal<string | number> : never;
			use?: OrArray<(element: T) => any>;
			classList?: OrComputed<string>[];
			classRecord?: Record<string, OrComputed<boolean | undefined | null>>;
			styleRecord?: {
				[K in keyof CSSProperties]?: OrComputed<CSSProperties[K]>;
			} & Record<string, OrComputed<string>>;
		};

	export interface IntrinsicElements {
		a: Attributes<AnchorHTMLAttributes, HTMLAnchorElement>;
		abbr: Attributes<HTMLAttributes, HTMLElement>;
		address: Attributes<HTMLAttributes, HTMLElement>;
		area: Attributes<AreaHTMLAttributes, HTMLAreaElement>;
		article: Attributes<HTMLAttributes, HTMLElement>;
		aside: Attributes<HTMLAttributes, HTMLElement>;
		audio: Attributes<AudioHTMLAttributes, HTMLAudioElement>;
		b: Attributes<HTMLAttributes, HTMLElement>;
		base: Attributes<BaseHTMLAttributes, HTMLBaseElement>;
		bdi: Attributes<HTMLAttributes, HTMLElement>;
		bdo: Attributes<HTMLAttributes, HTMLElement>;
		blockquote: Attributes<BlockquoteHTMLAttributes, HTMLQuoteElement>;
		body: Attributes<HTMLAttributes, HTMLBodyElement>;
		br: Attributes<HTMLAttributes, HTMLBRElement>;
		button: Attributes<ButtonHTMLAttributes, HTMLButtonElement>;
		canvas: Attributes<CanvasHTMLAttributes, HTMLCanvasElement>;
		caption: Attributes<HTMLAttributes, HTMLTableCaptionElement>;
		cite: Attributes<HTMLAttributes, HTMLElement>;
		code: Attributes<HTMLAttributes, HTMLElement>;
		col: Attributes<ColHTMLAttributes, HTMLTableColElement>;
		colgroup: Attributes<ColgroupHTMLAttributes, HTMLTableColElement>;
		data: Attributes<DataHTMLAttributes, HTMLDataElement>;
		datalist: Attributes<HTMLAttributes, HTMLDataListElement>;
		dd: Attributes<HTMLAttributes, HTMLElement>;
		del: Attributes<DelHTMLAttributes, HTMLModElement>;
		details: Attributes<DetailsHTMLAttributes, HTMLDetailsElement>;
		dfn: Attributes<HTMLAttributes, HTMLElement>;
		dialog: Attributes<DialogHTMLAttributes, HTMLDialogElement>;
		div: Attributes<HTMLAttributes, HTMLDivElement>;
		dl: Attributes<HTMLAttributes, HTMLDListElement>;
		dt: Attributes<HTMLAttributes, HTMLElement>;
		em: Attributes<HTMLAttributes, HTMLElement>;
		embed: Attributes<EmbedHTMLAttributes, HTMLEmbedElement>;
		fieldset: Attributes<FieldsetHTMLAttributes, HTMLFieldSetElement>;
		figcaption: Attributes<HTMLAttributes, HTMLElement>;
		figure: Attributes<HTMLAttributes, HTMLElement>;
		footer: Attributes<HTMLAttributes, HTMLElement>;
		form: Attributes<FormHTMLAttributes, HTMLFormElement>;
		h1: Attributes<HTMLAttributes, HTMLHeadingElement>;
		h2: Attributes<HTMLAttributes, HTMLHeadingElement>;
		h3: Attributes<HTMLAttributes, HTMLHeadingElement>;
		h4: Attributes<HTMLAttributes, HTMLHeadingElement>;
		h5: Attributes<HTMLAttributes, HTMLHeadingElement>;
		h6: Attributes<HTMLAttributes, HTMLHeadingElement>;
		head: Attributes<HTMLAttributes, HTMLHeadElement>;
		header: Attributes<HTMLAttributes, HTMLElement>;
		hgroup: Attributes<HTMLAttributes, HTMLElement>;
		hr: Attributes<HTMLAttributes, HTMLHRElement>;
		html: Attributes<HtmlHTMLAttributes, HTMLHtmlElement>;
		i: Attributes<HTMLAttributes, HTMLElement>;
		iframe: Attributes<IframeHTMLAttributes, HTMLIFrameElement>;
		img: Attributes<ImgHTMLAttributes, HTMLImageElement>;
		input: Attributes<InputHTMLAttributes, HTMLInputElement>;
		ins: Attributes<InsHTMLAttributes, HTMLModElement>;
		kbd: Attributes<HTMLAttributes, HTMLElement>;
		label: Attributes<LabelHTMLAttributes, HTMLLabelElement>;
		legend: Attributes<HTMLAttributes, HTMLLegendElement>;
		li: Attributes<LiHTMLAttributes, HTMLLIElement>;
		link: Attributes<LinkHTMLAttributes, HTMLLinkElement>;
		main: Attributes<HTMLAttributes, HTMLElement>;
		map: Attributes<MapHTMLAttributes, HTMLMapElement>;
		mark: Attributes<HTMLAttributes, HTMLElement>;
		menu: Attributes<MenuHTMLAttributes, HTMLMenuElement>;
		meta: Attributes<MetaHTMLAttributes, HTMLMetaElement>;
		meter: Attributes<MeterHTMLAttributes, HTMLMeterElement>;
		nav: Attributes<HTMLAttributes, HTMLElement>;
		noscript: Attributes<HTMLAttributes, HTMLElement>;
		object: Attributes<ObjectHTMLAttributes, HTMLObjectElement>;
		ol: Attributes<OlHTMLAttributes, HTMLOListElement>;
		optgroup: Attributes<OptgroupHTMLAttributes, HTMLOptGroupElement>;
		option: Attributes<OptionHTMLAttributes, HTMLOptionElement>;
		output: Attributes<OutputHTMLAttributes, HTMLOutputElement>;
		p: Attributes<HTMLAttributes, HTMLParagraphElement>;
		picture: Attributes<HTMLAttributes, HTMLPictureElement>;
		pre: Attributes<HTMLAttributes, HTMLPreElement>;
		progress: Attributes<ProgressHTMLAttributes, HTMLProgressElement>;
		q: Attributes<QuoteHTMLAttributes, HTMLQuoteElement>;
		rp: Attributes<HTMLAttributes, HTMLElement>;
		rt: Attributes<HTMLAttributes, HTMLElement>;
		ruby: Attributes<HTMLAttributes, HTMLElement>;
		s: Attributes<HTMLAttributes, HTMLElement>;
		samp: Attributes<HTMLAttributes, HTMLElement>;
		slot: Attributes<SlotHTMLAttributes, HTMLSlotElement>;
		script: Attributes<ScriptHTMLAttributes, HTMLScriptElement>;
		search: Attributes<HTMLAttributes, HTMLElement>;
		section: Attributes<HTMLAttributes, HTMLElement>;
		select: Attributes<SelectHTMLAttributes, HTMLSelectElement>;
		small: Attributes<HTMLAttributes, HTMLElement>;
		source: Attributes<SourceHTMLAttributes, HTMLSourceElement>;
		span: Attributes<HTMLAttributes, HTMLSpanElement>;
		strong: Attributes<HTMLAttributes, HTMLElement>;
		style: Attributes<StyleHTMLAttributes, HTMLStyleElement>;
		sub: Attributes<HTMLAttributes, HTMLElement>;
		summary: Attributes<HTMLAttributes, HTMLElement>;
		sup: Attributes<HTMLAttributes, HTMLElement>;
		table: Attributes<TableHTMLAttributes, HTMLTableElement>;
		tbody: Attributes<HTMLAttributes, HTMLTableSectionElement>;
		td: Attributes<TdHTMLAttributes, HTMLTableCellElement>;
		template: Attributes<HTMLAttributes, HTMLTemplateElement>;
		textarea: Attributes<TextareaHTMLAttributes, HTMLTextAreaElement>;
		tfoot: Attributes<HTMLAttributes, HTMLTableSectionElement>;
		th: Attributes<ThHTMLAttributes, HTMLTableCellElement>;
		thead: Attributes<HTMLAttributes, HTMLTableSectionElement>;
		time: Attributes<TimeHTMLAttributes, HTMLTimeElement>;
		title: Attributes<HTMLAttributes, HTMLTitleElement>;
		tr: Attributes<HTMLAttributes, HTMLTableRowElement>;
		track: Attributes<TrackHTMLAttributes, HTMLTrackElement>;
		u: Attributes<HTMLAttributes, HTMLElement>;
		ul: Attributes<HTMLAttributes, HTMLUListElement>;
		var: Attributes<HTMLAttributes, HTMLElement>;
		video: Attributes<VideoHTMLAttributes, HTMLVideoElement>;
		wbr: Attributes<HTMLAttributes, HTMLElement>;
	}

	interface RenderContext {
		parent: ParentNode;
		childIndex: number;
	}

	export interface VNode<T extends string = string> {
		[typeSymbol]: T;
		mount(ctx: RenderContext): void;
	}
}

// html vnode
export type Tag = keyof Gotei.IntrinsicElements;
export type Props<T extends Tag> = Gotei.IntrinsicElements[T];
export type AnyProps = Record<string | symbol | number, any>;
export type HtmlVNodeChild =
	| Gotei.VNode
	| string
	| number
	| boolean
	| undefined
	| null;

export interface HtmlVNode<T extends Tag = Tag, P extends AnyProps = AnyProps>
	extends Gotei.VNode<"html"> {
	tag: T;
	props: Props<T> & P;
	children: HtmlVNodeChild[];
}

export declare const HtmlVNode: {
	prototype: HtmlVNode;
	new <T extends Tag, P extends AnyProps = AnyProps>(
		tag: T,
		props: Props<T> & P,
		children: HtmlVNodeChild[],
	): HtmlVNode<T, P>;
};

export declare function h<T extends Tag, P extends AnyProps = AnyProps>(
	tag: T,
	props: Gotei.Props<T> & P,
	children: HtmlVNodeChild[],
): HtmlVNode<T, P>;

// text vnode
export type TextRenderizable = string | number | boolean;

export interface TextVNode<T extends TextRenderizable = TextRenderizable>
	extends Gotei.VNode<"text"> {
	data: OrComputed<T>;
}

export declare const TextVNode: {
	prototype: TextVNode;
	new <T extends TextRenderizable>(data: OrComputed<T>): TextVNode<T>;
};

// conditional vnode
export interface ConditionalVNode<
	T extends HtmlVNode | TextVNode = HtmlVNode | TextVNode,
> extends Gotei.VNode<"maybe"> {
	vnode: T;
	condition: OrComputed<boolean>;
}

export declare const ConditionalVNode: {
	prototype: ConditionalVNode;
	new <T extends HtmlVNode | TextVNode>(
		vnode: T,
		condition: OrComputed<boolean>,
	): ConditionalVNode<T>;
};

// array vnode
export type Keyed<T> = T extends HtmlVNode<infer T, infer P>
	? HtmlVNode<T, P & { key: string | number }>
	: never;

export interface ArrayVNode<T = any> extends Gotei.VNode<"array"> {
	f: (item: T) => Keyed<HtmlVNode>;
	items: () => T[];
}

export declare const ArrayVNode: {
	prototype: ArrayVNode;
	new <T>(f: (item: T) => Keyed<HtmlVNode>, items: () => T[]): ArrayVNode<T>;
};
