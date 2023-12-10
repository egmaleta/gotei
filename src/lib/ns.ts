import { MountFunction } from "./mount";
import { Signal, SignalSetter } from "./state";
import { AnyProps, OrArray, OrComputed } from "./type-utils";

export declare namespace Gotei {
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

  type TypedEvent<E extends Event, T extends EventTarget> = Omit<
    E,
    "currentTarget"
  > & { readonly currentTarget: T };

  export type EventHandler<E extends Event, T extends EventTarget> =
    | ((ev: TypedEvent<E, T>) => any)
    | {
        handler: (ev: TypedEvent<E, T>) => any;
        options?: AddEventListenerOptions;
      };

  type EventHandlers<T extends EventTarget> = {
    [K in keyof GlobalEventHandlersEventMap as `on-${K}`]?: OrArray<
      EventHandler<GlobalEventHandlersEventMap[K], T>
    >;
  };

  interface GoteiAttributes<T extends HTMLElement> extends EventHandlers<T> {
    "bind-this"?: SignalSetter<Node | null>;

    "bind-value"?: T extends HTMLInputElement | HTMLTextAreaElement
      ? Signal<string | number>
      : never;

    use?: OrArray<(element: T) => any>;

    "class-list"?: OrComputed<string>[];
    "class-record"?: Record<string, OrComputed<boolean>>;

    "style-record"?: {
      [K in keyof CSSProperties]?: OrComputed<CSSProperties[K]>;
    } & {
      [K in string as `--${K}`]: OrComputed<string>;
    };

    [customAttr: string]: any;
  }

  interface ElementAttrsMap {
    a: AnchorHTMLAttributes & GoteiAttributes<HTMLAnchorElement>;
    abbr: HTMLAttributes & GoteiAttributes<HTMLElement>;
    address: HTMLAttributes & GoteiAttributes<HTMLElement>;
    area: AreaHTMLAttributes & GoteiAttributes<HTMLAreaElement>;
    article: HTMLAttributes & GoteiAttributes<HTMLElement>;
    aside: HTMLAttributes & GoteiAttributes<HTMLElement>;
    audio: AudioHTMLAttributes & GoteiAttributes<HTMLAudioElement>;
    b: HTMLAttributes & GoteiAttributes<HTMLElement>;
    base: BaseHTMLAttributes & GoteiAttributes<HTMLBaseElement>;
    bdi: HTMLAttributes & GoteiAttributes<HTMLElement>;
    bdo: HTMLAttributes & GoteiAttributes<HTMLElement>;
    blockquote: BlockquoteHTMLAttributes & GoteiAttributes<HTMLQuoteElement>;
    body: HTMLAttributes & GoteiAttributes<HTMLBodyElement>;
    br: HTMLAttributes & GoteiAttributes<HTMLBRElement>;
    button: ButtonHTMLAttributes & GoteiAttributes<HTMLButtonElement>;
    canvas: CanvasHTMLAttributes & GoteiAttributes<HTMLCanvasElement>;
    caption: HTMLAttributes & GoteiAttributes<HTMLTableCaptionElement>;
    cite: HTMLAttributes & GoteiAttributes<HTMLElement>;
    code: HTMLAttributes & GoteiAttributes<HTMLElement>;
    col: ColHTMLAttributes & GoteiAttributes<HTMLTableColElement>;
    colgroup: ColgroupHTMLAttributes & GoteiAttributes<HTMLTableColElement>;
    data: DataHTMLAttributes & GoteiAttributes<HTMLDataElement>;
    datalist: HTMLAttributes & GoteiAttributes<HTMLDataListElement>;
    dd: HTMLAttributes & GoteiAttributes<HTMLElement>;
    del: DelHTMLAttributes & GoteiAttributes<HTMLModElement>;
    details: DetailsHTMLAttributes & GoteiAttributes<HTMLDetailsElement>;
    dfn: HTMLAttributes & GoteiAttributes<HTMLElement>;
    dialog: DialogHTMLAttributes & GoteiAttributes<HTMLDialogElement>;
    div: HTMLAttributes & GoteiAttributes<HTMLDivElement>;
    dl: HTMLAttributes & GoteiAttributes<HTMLDListElement>;
    dt: HTMLAttributes & GoteiAttributes<HTMLElement>;
    em: HTMLAttributes & GoteiAttributes<HTMLElement>;
    embed: EmbedHTMLAttributes & GoteiAttributes<HTMLEmbedElement>;
    fieldset: FieldsetHTMLAttributes & GoteiAttributes<HTMLFieldSetElement>;
    figcaption: HTMLAttributes & GoteiAttributes<HTMLElement>;
    figure: HTMLAttributes & GoteiAttributes<HTMLElement>;
    footer: HTMLAttributes & GoteiAttributes<HTMLElement>;
    form: FormHTMLAttributes & GoteiAttributes<HTMLFormElement>;
    h1: HTMLAttributes & GoteiAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes & GoteiAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes & GoteiAttributes<HTMLHeadingElement>;
    h4: HTMLAttributes & GoteiAttributes<HTMLHeadingElement>;
    h5: HTMLAttributes & GoteiAttributes<HTMLHeadingElement>;
    h6: HTMLAttributes & GoteiAttributes<HTMLHeadingElement>;
    head: HTMLAttributes & GoteiAttributes<HTMLHeadElement>;
    header: HTMLAttributes & GoteiAttributes<HTMLElement>;
    hgroup: HTMLAttributes & GoteiAttributes<HTMLElement>;
    hr: HTMLAttributes & GoteiAttributes<HTMLHRElement>;
    html: HtmlHTMLAttributes & GoteiAttributes<HTMLHtmlElement>;
    i: HTMLAttributes & GoteiAttributes<HTMLElement>;
    iframe: IframeHTMLAttributes & GoteiAttributes<HTMLIFrameElement>;
    img: ImgHTMLAttributes & GoteiAttributes<HTMLImageElement>;
    input: InputHTMLAttributes & GoteiAttributes<HTMLInputElement>;
    ins: InsHTMLAttributes & GoteiAttributes<HTMLModElement>;
    kbd: HTMLAttributes & GoteiAttributes<HTMLElement>;
    label: LabelHTMLAttributes & GoteiAttributes<HTMLLabelElement>;
    legend: HTMLAttributes & GoteiAttributes<HTMLLegendElement>;
    li: LiHTMLAttributes & GoteiAttributes<HTMLLIElement>;
    link: LinkHTMLAttributes & GoteiAttributes<HTMLLinkElement>;
    main: HTMLAttributes & GoteiAttributes<HTMLElement>;
    map: MapHTMLAttributes & GoteiAttributes<HTMLMapElement>;
    mark: HTMLAttributes & GoteiAttributes<HTMLElement>;
    menu: MenuHTMLAttributes & GoteiAttributes<HTMLMenuElement>;
    meta: MetaHTMLAttributes & GoteiAttributes<HTMLMetaElement>;
    meter: MeterHTMLAttributes & GoteiAttributes<HTMLMeterElement>;
    nav: HTMLAttributes & GoteiAttributes<HTMLElement>;
    noscript: HTMLAttributes & GoteiAttributes<HTMLElement>;
    object: ObjectHTMLAttributes & GoteiAttributes<HTMLObjectElement>;
    ol: OlHTMLAttributes & GoteiAttributes<HTMLOListElement>;
    optgroup: OptgroupHTMLAttributes & GoteiAttributes<HTMLOptGroupElement>;
    option: OptionHTMLAttributes & GoteiAttributes<HTMLOptionElement>;
    output: OutputHTMLAttributes & GoteiAttributes<HTMLOutputElement>;
    p: HTMLAttributes & GoteiAttributes<HTMLParagraphElement>;
    picture: HTMLAttributes & GoteiAttributes<HTMLPictureElement>;
    pre: HTMLAttributes & GoteiAttributes<HTMLPreElement>;
    progress: ProgressHTMLAttributes & GoteiAttributes<HTMLProgressElement>;
    q: QuoteHTMLAttributes & GoteiAttributes<HTMLQuoteElement>;
    rp: HTMLAttributes & GoteiAttributes<HTMLElement>;
    rt: HTMLAttributes & GoteiAttributes<HTMLElement>;
    ruby: HTMLAttributes & GoteiAttributes<HTMLElement>;
    s: HTMLAttributes & GoteiAttributes<HTMLElement>;
    samp: HTMLAttributes & GoteiAttributes<HTMLElement>;
    slot: SlotHTMLAttributes & GoteiAttributes<HTMLSlotElement>;
    script: ScriptHTMLAttributes & GoteiAttributes<HTMLScriptElement>;
    search: HTMLAttributes & GoteiAttributes<HTMLElement>;
    section: HTMLAttributes & GoteiAttributes<HTMLElement>;
    select: SelectHTMLAttributes & GoteiAttributes<HTMLSelectElement>;
    small: HTMLAttributes & GoteiAttributes<HTMLElement>;
    source: SourceHTMLAttributes & GoteiAttributes<HTMLSourceElement>;
    span: HTMLAttributes & GoteiAttributes<HTMLSpanElement>;
    strong: HTMLAttributes & GoteiAttributes<HTMLElement>;
    style: StyleHTMLAttributes & GoteiAttributes<HTMLStyleElement>;
    sub: HTMLAttributes & GoteiAttributes<HTMLElement>;
    summary: HTMLAttributes & GoteiAttributes<HTMLElement>;
    sup: HTMLAttributes & GoteiAttributes<HTMLElement>;
    table: TableHTMLAttributes & GoteiAttributes<HTMLTableElement>;
    tbody: HTMLAttributes & GoteiAttributes<HTMLTableSectionElement>;
    td: TdHTMLAttributes & GoteiAttributes<HTMLTableCellElement>;
    template: HTMLAttributes & GoteiAttributes<HTMLTemplateElement>;
    textarea: TextareaHTMLAttributes & GoteiAttributes<HTMLTextAreaElement>;
    tfoot: HTMLAttributes & GoteiAttributes<HTMLTableSectionElement>;
    th: ThHTMLAttributes & GoteiAttributes<HTMLTableCellElement>;
    thead: HTMLAttributes & GoteiAttributes<HTMLTableSectionElement>;
    time: TimeHTMLAttributes & GoteiAttributes<HTMLTimeElement>;
    title: HTMLAttributes & GoteiAttributes<HTMLTitleElement>;
    tr: HTMLAttributes & GoteiAttributes<HTMLTableRowElement>;
    track: TrackHTMLAttributes & GoteiAttributes<HTMLTrackElement>;
    u: HTMLAttributes & GoteiAttributes<HTMLElement>;
    ul: HTMLAttributes & GoteiAttributes<HTMLUListElement>;
    var: HTMLAttributes & GoteiAttributes<HTMLElement>;
    video: VideoHTMLAttributes & GoteiAttributes<HTMLVideoElement>;
    wbr: HTMLAttributes & GoteiAttributes<HTMLElement>;
  }

  export type Tag = keyof ElementAttrsMap;

  export type Attrs<T extends Tag> = ElementAttrsMap[T];

  export type Child =
    | MountFunction
    | string
    | number
    | boolean
    | undefined
    | null;

  export type Component<
    P extends AnyProps = AnyProps,
    C extends Child = Child,
    R extends OrArray<Child> = OrArray<Child>,
  > = {
    (props: P, children: C[]): R;
  };
}
