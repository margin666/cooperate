import {HighlightStyle, syntaxHighlighting} from "@codemirror/language"
import {tags as t} from "@lezer/highlight"
import { EditorView, } from 'codemirror';
import {Extension} from "@codemirror/state"


export const theme = EditorView.theme({
    "&": { height: "calc(90vh - 70px)", color: '#FA5075', backgroundColor: "#fa507517",},
    ".cm-scroller": { overflow: "auto" },
    ".cm-content": {
        caretColor: "red",
        fontSize: '16px',
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#fa507589",
        color: '#fff'
    },
    ".cm-gutters": {
        backgroundColor: "rgba(47, 21, 50, 0.92)",
        color: "#ddd",
        border: "none"
    },
    ".cm-activeLine": {
        backgroundColor: "#fa50751f",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "#fa50751f"
    },

}, {
    dark: true
})



const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd",
  darkBackground = "#21252b",
  highlightBackground = "#2c313a",
  background = "#282c34",
  tooltipBackground = "#353a42",
  selection = "#3E4451",
  cursor = "#528bff"

/// The colors used in the theme, as CSS color strings.
export const color = {
  chalky,
  coral,
  cyan,
  invalid,
  ivory,
  stone,
  malibu,
  sage,
  whiskey,
  violet,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor
}

export const myHighlightStyle = HighlightStyle.define([
    {tag: t.keyword,
     color: violet},
    {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
     color: coral},
    {tag: [t.function(t.variableName), t.labelName],
     color: malibu},
    {tag: [t.color, t.constant(t.name), t.standard(t.name)],
     color: whiskey},
    {tag: [t.definition(t.name), t.separator],
     color: ivory},
    {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
     color: chalky},
    {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
     color: cyan},
    {tag: [t.meta, t.comment],
     color: stone},
    {tag: t.strong,
     fontWeight: "bold"},
    {tag: t.emphasis,
     fontStyle: "italic"},
    {tag: t.strikethrough,
     textDecoration: "line-through"},
    {tag: t.link,
     color: stone,
     textDecoration: "underline"},
    {tag: t.heading,
     fontWeight: "bold",
     color: coral},
    {tag: [t.atom, t.bool, t.special(t.variableName)],
     color: whiskey },
    {tag: [t.processingInstruction, t.string, t.inserted],
     color: sage},
    {tag: t.invalid,
     color: invalid},
  ])


  export const pick:Extension = [theme, syntaxHighlighting(myHighlightStyle)]
