import "@remirror/styles/all.css";

import { css } from "@emotion/css";
import { createContextState } from "create-context-state";
import React, { useEffect } from "react";
import jsx from "refractor/lang/jsx.js";
import md from "refractor/lang/markdown.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority, getThemeVar } from "remirror";
import {
    BlockquoteExtension,
    BoldExtension,
    BulletListExtension,
    CodeBlockExtension,
    CodeExtension,
    DocExtension,
    HardBreakExtension,
    HeadingExtension,
    ItalicExtension,
    LinkExtension,
    ListItemExtension,
    MarkdownExtension,
    OrderedListExtension,
    StrikeExtension,
    TableExtension,
    TrailingNodeExtension,
    TextHighlightExtension,
} from "remirror/extensions";
import {
    MarkdownToolbar,
    ReactExtensions,
    Remirror,
    ThemeProvider,
    useHelpers,
    useRemirror,
    UseRemirrorReturn,
    useCommands,
} from "@remirror/react";
import { MarkdownEditor } from "@remirror/react-editors/markdown";

function MarkdownPreview() {
    const { getMarkdown } = useHelpers(true);
    const markdown = getMarkdown();
    console.log("markdown", markdown);

    return (
        <pre>
            <code>{getMarkdown()}</code>
        </pre>
    );
}

export const Basic = () => {
    return (
        <MarkdownEditor
            placeholder="Start typing..."
            initialContent={basicContent}
        >
            <MarkdownPreview />
        </MarkdownEditor>
    );
};

const basicContent = "";

const [DualEditorProvider, useDualEditor] = createContextState(({ props }) => {
    return {
        ...props,

        setMarkdown: (text) => {
            return props.markdown.getContext()?.setContent({
                type: "doc",
                content: [
                    {
                        type: "codeBlock",
                        attrs: { language: "markdown" },
                        content: text ? [{ type: "text", text }] : undefined,
                    },
                ],
            });
        },
        setVisual: (markdown) => {
            return props.visual.getContext()?.setContent(markdown);
        },
    };
});
const HighlightButtons = () => {
    const commands = useCommands();
    return (
        <>
            <button
                className="hhh"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commands.setTextHighlight("red")}
            >
                Highlight red
            </button>
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commands.setTextHighlight("green")}
            >
                Highlight green
            </button>
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commands.removeTextHighlight()}
            >
                Remove
            </button>
        </>
    );
};

const MarkdownTextEditor = () => {
    const { markdown, setVisual } = useDualEditor();
    return (
        <Remirror
            manager={markdown.manager}
            autoRender="end"
            onChange={({ helpers, state }) => {
                const text = helpers.getText({ state });
                return setVisual(text);
            }}
            classNames={[
                css`
                    &.ProseMirror {
                        padding: 0;

                        pre {
                            height: 100%;
                            padding: ${getThemeVar("space", 3)};
                            margin: 0;
                        }
                    }
                `,
            ]}
        >
            {/* <Toolbar items={toolbarItems} refocusEditor label='Top Toolbar' /> */}
        </Remirror>
    );
};

const VisualEditor = () => {
    const { visual, setMarkdown } = useDualEditor();

    return (
        <Remirror
            autoFocus
            manager={visual.manager}
            autoRender="end"
            onChange={({ helpers, state }) => {
                return setMarkdown(helpers.getMarkdown(state));
            }}
            initialContent={visual.state}
            classNames={[
                css`
                    &.ProseMirror {
                        p,
                        h3,
                        h4 {
                            margin-top: ${getThemeVar("space", 2)};
                            margin-bottom: ${getThemeVar("space", 2)};
                        }

                        h1,
                        h2 {
                            margin-bottom: ${getThemeVar("space", 3)};
                            margin-top: ${getThemeVar("space", 3)};
                        }
                    }
                `,
            ]}
        >
            <MarkdownToolbar />
        </Remirror>
    );
};

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const DualEditor = () => {
    const visual = useRemirror({
        extensions,
        stringHandler: "markdown",
        content: "**Markdown** content is the _best_",
    });
    const markdown = useRemirror({
        extensions: () => [
            new DocExtension({ content: "codeBlock" }),
            new CodeBlockExtension({
                supportedLanguages: [md, typescript],
                defaultLanguage: "markdown",
                syntaxTheme: "base16_ateliersulphurpool_light",
                defaultWrap: true,
            }),
        ],
        builtin: {
            exitMarksOnArrowPress: false,
        },

        stringHandler: "html",
    });

    return (
        <DualEditorProvider visual={visual} markdown={markdown}>
            <ThemeProvider>
                <VisualEditor />
                <MarkdownTextEditor />
                <HighlightButtons />
            </ThemeProvider>
        </DualEditorProvider>
    );
};

const extensions = () => [
    new LinkExtension({ autoLink: true }),
    new BoldExtension(),
    new StrikeExtension(),
    new ItalicExtension(),
    new HeadingExtension(),
    new BlockquoteExtension(),
    new BulletListExtension({ enableSpine: true }),
    new OrderedListExtension(),
    new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
    }),
    new CodeExtension(),
    new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
    new TrailingNodeExtension(),
    new TableExtension(),
    new MarkdownExtension({ copyAsMarkdown: false }),
    /**
     * `HardBreakExtension` allows us to create a newline inside paragraphs.
     * e.g. in a list item
     */
    new HardBreakExtension(),
    new TextHighlightExtension(),
];

export default Basic;
