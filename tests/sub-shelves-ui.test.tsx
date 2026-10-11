import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShelvesPage } from "../src/features/library/Shelves";
import { ShelfModal } from "../src/features/library/components/modals/ShelfModal";
import { useLibraryStore, useUIStore } from "../src/core/store";
import type { Collection } from "../src/core/types";
vi.mock("../src/core/lib/useSmartShelves", () => ({ useSmartShelves: (_books: unknown, collections: Collection[]) => ({ collections, ready: true }) }));
let root: Root; let host: HTMLDivElement;
const parent: Collection = { id: "root", name: "Comics", kind: "general", bookIds: [], createdAt: new Date() };
const child: Collection = { ...parent, id: "child", name: "Manga", parentId: "root" };
beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    useUIStore.setState({ searchQuery: "" }); useLibraryStore.setState({ books: [], collections: [parent, child] });
    host=document.createElement("div"); document.body.append(host); root=createRoot(host);
});
afterEach(() => { act(() => root.unmount()); host.remove(); });
describe("combined sub-shelf interface", () => {
    it("browses an empty parent, opens its child, and returns to the parent", () => {
        act(() => root.render(<ShelvesPage />));
        expect(host.querySelectorAll("button.block.w-full")).toHaveLength(1);
        act(() => host.querySelector<HTMLButtonElement>("button.block.w-full")!.click());
        const open = Array.from(host.querySelectorAll("nav button")).find(b => b.textContent === "Manga") as HTMLButtonElement;
        expect(open).toBeDefined(); act(() => open.click());
        expect(host.querySelector("h1")?.textContent).toBe("Manga");
        act(() => host.querySelector<HTMLButtonElement>('button[aria-label="Back to shelves"]')!.click());
        expect(host.querySelector("h1")?.textContent).toBe("Comics");
    });
    it("preserves smart rules when promoting a child through the parent selector", () => {
        const onSave=vi.fn(); const rules = { mode: "all" as const, conditions: [{ field: "format" as const, operator: "equals" as const, value: "cbr" }] };
        act(() => root.render(<ShelfModal isOpen shelf={{ ...child, smartRules: rules }} collections={[parent, child]} onClose={vi.fn()} onSave={onSave} />));
        const select=document.querySelector<HTMLSelectElement>("#shelf-parent")!; expect(select.value).toBe("root");
        act(() => { select.value=""; select.dispatchEvent(new Event("change",{bubbles:true})); });
        act(() => document.querySelector("form")!.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true})));
        expect(onSave).toHaveBeenCalledWith("Manga","",rules,undefined);
    });
    it("defaults a new sub-shelf to the open parent", () => {
        act(() => root.render(<ShelvesPage />)); act(() => host.querySelector<HTMLButtonElement>("button.block.w-full")!.click());
        const create=Array.from(host.querySelectorAll("nav button")).find(b => b.textContent?.includes("New sub-shelf")) as HTMLButtonElement;
        act(() => create.click()); expect(document.querySelector<HTMLSelectElement>("#shelf-parent")?.value).toBe("root");
    });
});
